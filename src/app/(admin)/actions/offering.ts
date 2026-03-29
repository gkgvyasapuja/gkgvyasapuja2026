"use server";

import { db } from "@/db";
import {
  countries,
  states,
  cities,
  temples,
  users,
  offerings,
} from "@/db/schema";
import { eq } from "drizzle-orm";
const mammoth = require("mammoth");

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

export async function submitOffering(formData: any) {
  try {
    // 1. Insert/Update User
    const [user] = await db
      .insert(users)
      .values({
        firstName: formData.firstName,
        lastName: formData.lastName,
        gender: formData.gender,
        email: formData.email,
        phone: formData.phone,
        countryId: formData.countryId,
        stateId: formData.stateId,
        cityId: formData.cityId,
        templeId: formData.templeId,
        initiated: formData.initiated === "true" || formData.initiated === true,
        initiationType: formData.initiationType || "",
        initiationYear: formData.initiationYear || "",
        initiatedName: formData.initiatedName || "",
      })
      .returning();

    if (!user) {
      return { success: false, error: "Failed to create user record." };
    }

    // 2. Insert Offering
    await db.insert(offerings).values({
      userId: user.id,
      year: new Date().getFullYear().toString(),
      offering: formData.offeringText,
      language: formData.language || "English",
    });

    return { success: true };
  } catch (error) {
    console.error("Failed to submit offering:", error);
    return { success: false, error: "An unexpected error occurred." };
  }
}

export async function parseDocx(formData: FormData) {
  try {
    const file = formData.get("file") as File;
    if (!file) {
      return { success: false, error: "No file provided" };
    }
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const result = await mammoth.convertToHtml(
      { buffer },
      { ignoreEmptyParagraphs: false },
    );
    return { success: true, text: result.value };
  } catch (error) {
    console.error("Failed to parse docx:", error);
    return {
      success: false,
      error:
        "Failed to read the document. Please make sure it is a valid .docx file.",
    };
  }
}
