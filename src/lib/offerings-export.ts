import type { AdminOfferingExportRow } from "@/app/(admin)/actions/admin";
import {
  hasStaffEdit,
  staffMarkerLabel,
  contentEditorLabel,
  formatStaffEditedAt,
  offeringHasImages,
} from "@/lib/offering-staff-edit";
import { getObjectBuffer, objectKeyFromPublicUrl } from "@/lib/s3";
import {
  Document,
  HeadingLevel,
  Packer,
  Paragraph,
} from "docx";
import JSZip from "jszip";
import * as XLSX from "xlsx";

export function stripHtmlForExport(html: string): string {
  return html
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/p>/gi, "\n")
    .replace(/<\/div>/gi, "\n")
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function offeringFileName(documentUrl: string | null): string {
  if (!documentUrl) return "";
  try {
    const segment = new URL(documentUrl).pathname.split("/").pop();
    return segment ? decodeURIComponent(segment) : "";
  } catch {
    return "";
  }
}

function uniqueZipEntryName(baseName: string, used: Set<string>): string {
  if (!used.has(baseName)) {
    used.add(baseName);
    return baseName;
  }
  const dot = baseName.lastIndexOf(".");
  const stem = dot > 0 ? baseName.slice(0, dot) : baseName;
  const ext = dot > 0 ? baseName.slice(dot) : "";
  let n = 2;
  while (used.has(`${stem}_${n}${ext}`)) n += 1;
  const unique = `${stem}_${n}${ext}`;
  used.add(unique);
  return unique;
}

export async function buildOfferingsZipBuffer(
  rows: AdminOfferingExportRow[],
): Promise<Buffer | null> {
  const zip = new JSZip();
  const usedNames = new Set<string>();
  const entries: { entryName: string; key: string }[] = [];

  for (const row of rows) {
    const documentUrl = row.documentUrl;
    if (!documentUrl) continue;

    const key = objectKeyFromPublicUrl(documentUrl);
    if (!key) continue;

    const baseName =
      offeringFileName(documentUrl) || `offering_${row.id}.docx`;
    entries.push({
      entryName: uniqueZipEntryName(baseName, usedNames),
      key,
    });
  }

  if (entries.length === 0) return null;

  let added = 0;
  await Promise.all(
    entries.map(async ({ entryName, key }) => {
      try {
        const buffer = await getObjectBuffer(key);
        zip.file(entryName, buffer);
        added += 1;
      } catch (err) {
        console.error(`Failed to fetch offering document ${key}:`, err);
      }
    }),
  );

  if (added === 0) return null;

  return zip.generateAsync({
    type: "nodebuffer",
    compression: "DEFLATE",
    compressionOptions: { level: 6 },
  });
}

export function buildOfferingsXlsxBuffer(rows: AdminOfferingExportRow[]) {
  const templeName = (r: AdminOfferingExportRow) =>
    r.templeName ?? (r.user.otherTempleName ? `Other (${r.user.otherTempleName})` : "");

  const data = rows.map((r) => ({
    Devotee: `${r.user.firstName} ${r.user.lastName}`.trim(),
    Email: r.user.email || "",
    Gender: r.user.gender || "",
    "Initiated Name": r.user.initiatedName || "",
    Phone: r.user.phone || "",
    Year: r.year,
    Country: r.countryName ?? "",
    State: r.stateName ?? "",
    City: r.cityName ?? "",
    Temple: templeName(r),
    "File name": offeringFileName(r.documentUrl),
    Language: r.language,
    "Staff edited": hasStaffEdit(r) ? "Yes" : "No",
    "Marked by": staffMarkerLabel(r) ?? "",
    "Marked at": formatStaffEditedAt(r.markedEditedAt),
    "Last edited by": contentEditorLabel(r) ?? "",
    "Last edited at": formatStaffEditedAt(r.lastEditedAt),
    "Has images": offeringHasImages(r.offering) ? "Yes" : "No",
    Note: r.note ?? "",
    Date: r.createdAt ? new Date(r.createdAt).toLocaleDateString() : "",
  }));
  const ws = XLSX.utils.json_to_sheet(data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Offerings");
  return XLSX.write(wb, { type: "buffer", bookType: "xlsx" }) as Buffer;
}

export async function buildOfferingsDocxBuffer(rows: AdminOfferingExportRow[]) {
  const children: Paragraph[] = [
    new Paragraph({
      text: "Offerings (combined)",
      heading: HeadingLevel.TITLE,
    }),
    new Paragraph({ text: "" }),
  ];

  for (let i = 0; i < rows.length; i++) {
    const r = rows[i];

    const body = stripHtmlForExport(r.offering);
    for (const line of body.split(/\r?\n/)) {
      children.push(new Paragraph({ text: line.length > 0 ? line : " " }));
    }
    children.push(new Paragraph({ text: "" }));
  }

  const doc = new Document({
    sections: [
      {
        children,
      },
    ],
  });

  return Packer.toBuffer(doc);
}
