"use server";

import { db } from "@/db";
import {
  countries,
  states,
  cities,
  temples,
  users,
  offerings,
  offeringEditLogs,
} from "@/db/schema";
import { and, eq, sql } from "drizzle-orm";
import {
  deleteObjectByKey,
  deleteObjectByUrl,
  uploadOfferingDocx,
} from "@/lib/s3";
const mammoth = require("mammoth");

function formDataString(fd: FormData, key: string): string {
  const v = fd.get(key);
  return typeof v === "string" ? v : "";
}

export async function getCountries() {
  try {
    const data = await db.select().from(countries).orderBy(countries.name);
    return data;
  } catch (error) {
    console.error("Failed to fetch countries:", error);
    return [];
  }
}

export async function getStates(countryId: string) {
  try {
    const data = await db
      .select()
      .from(states)
      .where(eq(states.countryId, countryId))
      .orderBy(states.name);
    return data;
  } catch (error) {
    console.error("Failed to fetch states:", error);
    return [];
  }
}

export async function getCities(stateId: string) {
  try {
    const data = await db
      .select()
      .from(cities)
      .where(eq(cities.stateId, stateId))
      .orderBy(cities.name);
    return data;
  } catch (error) {
    console.error("Failed to fetch cities:", error);
    return [];
  }
}

export async function getTemplesByStateId(stateId: string) {
  try {
    const data = await db
      .select()
      .from(temples)
      .where(eq(temples.stateId, stateId))
      .orderBy(temples.name);
    return data;
  } catch (error) {
    console.error("Failed to fetch temples:", error);
    return [];
  }
}

/** Profile fields returned when an email already exists (for prefill). */
export type ExistingUserProfile = {
  firstName: string;
  lastName: string;
  gender: "male" | "female" | "other";
  email: string;
  phone: string;
  countryId: string;
  stateId: string;
  cityId: string;
  templeId: string;
  initiated: boolean;
  initiationType: string;
  initiationYear: string;
  initiatedName: string;
};

export async function checkUserByEmail(
  email: string,
): Promise<
  | { exists: false; error?: string }
  | { exists: true; user: ExistingUserProfile }
> {
  try {
    const trimmed = email.trim();
    if (!trimmed) {
      return { exists: false };
    }
    const [row] = await db
      .select()
      .from(users)
      .where(sql`lower(${users.email}) = ${trimmed.toLowerCase()}`)
      .limit(1);
    if (!row) {
      return { exists: false };
    }
    return {
      exists: true,
      user: {
        firstName: row.firstName,
        lastName: row.lastName,
        gender: row.gender,
        email: row.email,
        phone: row.phone,
        countryId: row.countryId,
        stateId: row.stateId,
        cityId: row.cityId,
        templeId: row.templeId,
        initiated: row.initiated,
        initiationType: row.initiationType,
        initiationYear: row.initiationYear,
        initiatedName: row.initiatedName,
      },
    };
  } catch (error) {
    console.error("checkUserByEmail:", error);
    return { exists: false, error: "Could not verify email. Try again." };
  }
}

export async function submitOffering(fd: FormData) {
  const year = new Date().getFullYear().toString();
  const email = formDataString(fd, "email").trim();
  const emailNorm = email.toLowerCase();
  const offeringText = formDataString(fd, "offeringText");
  const lang = formDataString(fd, "language") || "English";

  const initiatedRaw = formDataString(fd, "initiated");
  const initiated = initiatedRaw === "true" || initiatedRaw === "on";

  const userValues = {
    firstName: formDataString(fd, "firstName"),
    lastName: formDataString(fd, "lastName"),
    gender: formDataString(fd, "gender") as "male" | "female" | "other",
    email,
    phone: formDataString(fd, "phone"),
    countryId: formDataString(fd, "countryId"),
    stateId: formDataString(fd, "stateId"),
    cityId: formDataString(fd, "cityId"),
    templeId: formDataString(fd, "templeId"),
    initiated,
    initiationType: formDataString(fd, "initiationType") || "",
    initiationYear: formDataString(fd, "initiationYear") || "",
    initiatedName: formDataString(fd, "initiatedName") || "",
    updatedAt: new Date(),
  };

  const file = fd.get("file");
  if (!(file instanceof File) || file.size === 0) {
    return { success: false, error: "Please upload a .docx offering document." };
  }
  if (!file.name.toLowerCase().endsWith(".docx")) {
    return { success: false, error: "Only .docx files are accepted." };
  }

  let buffer: Buffer;
  try {
    buffer = Buffer.from(await file.arrayBuffer());
  } catch {
    return { success: false, error: "Could not read the uploaded file." };
  }

  let uploadKey: string;
  let documentUrl: string;
  try {
    const uploaded = await uploadOfferingDocx({
      year,
      buffer,
      originalFileName: file.name,
    });
    uploadKey = uploaded.key;
    documentUrl = uploaded.url;
  } catch (err) {
    console.error("S3 upload failed:", err);
    return {
      success: false,
      error:
        "Could not upload the document. Check AWS credentials and S3 bucket configuration.",
    };
  }

  let previousDocUrl: string | null = null;

  try {
    await db.transaction(async (tx) => {
      const [existingUser] = await tx
        .select()
        .from(users)
        .where(sql`lower(${users.email}) = ${emailNorm}`)
        .limit(1);

      let userId: string;
      if (existingUser) {
        await tx
          .update(users)
          .set(userValues)
          .where(eq(users.id, existingUser.id));
        userId = existingUser.id;
      } else {
        const [created] = await tx
          .insert(users)
          .values(userValues)
          .returning({ id: users.id });
        if (!created) {
          throw new Error("Failed to create user record.");
        }
        userId = created.id;
      }

      const [existingOffering] = await tx
        .select()
        .from(offerings)
        .where(and(eq(offerings.userId, userId), eq(offerings.year, year)))
        .limit(1);

      previousDocUrl = existingOffering?.documentUrl ?? null;

      if (existingOffering) {
        await tx
          .delete(offeringEditLogs)
          .where(eq(offeringEditLogs.offeringId, existingOffering.id));

        await tx
          .update(offerings)
          .set({
            offering: offeringText,
            language: lang as "Hindi" | "English",
            documentUrl,
            updatedAt: new Date(),
            lastEditedAt: null,
            lastEditedByRole: null,
            lastEditedByMaintainerId: null,
          })
          .where(eq(offerings.id, existingOffering.id));
      } else {
        await tx.insert(offerings).values({
          userId,
          year,
          offering: offeringText,
          language: lang as "Hindi" | "English",
          documentUrl,
        });
      }
    });
  } catch (error) {
    console.error("Failed to submit offering (transaction):", error);
    try {
      await deleteObjectByKey(uploadKey);
    } catch (delErr) {
      console.error("Failed to remove orphaned upload from S3:", delErr);
    }
    return { success: false, error: "An unexpected error occurred." };
  }

  if (previousDocUrl && previousDocUrl !== documentUrl) {
    try {
      await deleteObjectByUrl(previousDocUrl);
    } catch (err) {
      console.error("Failed to delete previous offering document from S3:", err);
    }
  }

  return { success: true };
}

export async function parseDocx(formData: FormData) {
  try {
    const file = formData.get("file") as File;
    if (!file) {
      return { success: false, error: "No file provided" };
    }
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    let hasImages = false;
    const result = await mammoth.convertToHtml(
      { buffer },
      {
        ignoreEmptyParagraphs: false,
        convertImage: mammoth.images.imgElement(function (image: {
          contentType: string;
          readAsBase64String: () => Promise<string>;
        }) {
          hasImages = true;
          return image.readAsBase64String().then(function (imageBuffer: string) {
            return {
              src: "data:" + image.contentType + ";base64," + imageBuffer,
            };
          });
        }),
      },
    );
    return { success: true, text: result.value, hasImages };
  } catch (error) {
    console.error("Failed to parse docx:", error);
    return {
      success: false,
      error:
        "Failed to read the document. Please make sure it is a valid .docx file.",
    };
  }
}
