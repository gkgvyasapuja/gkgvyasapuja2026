import type { AdminOfferingExportRow } from "@/app/(admin)/actions/admin";
import {
  Document,
  HeadingLevel,
  Packer,
  Paragraph,
} from "docx";
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

export function buildOfferingsXlsxBuffer(rows: AdminOfferingExportRow[]) {
  const data = rows.map((r) => ({
    Devotee: `${r.user.firstName} ${r.user.lastName}`.trim(),
    "Initiated Name": r.user.initiatedName || "",
    Phone: r.user.phone || "",
    Year: r.year,
    Country: r.countryName ?? "",
    State: r.stateName ?? "",
    City: r.cityName ?? "",
    Temple: r.templeName ?? "",
    Language: r.language,
    Offering: stripHtmlForExport(r.offering),
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
    const name = `${r.user.firstName} ${r.user.lastName}`.trim();
    const location = [r.countryName, r.stateName, r.cityName, r.templeName]
      .filter(Boolean)
      .join(" · ");

    children.push(
      new Paragraph({
        text: `${i + 1}. ${name} — ${r.year}`,
        heading: HeadingLevel.HEADING_2,
      }),
    );
    children.push(
      new Paragraph({
        text: `Initiated name: ${r.user.initiatedName || "—"} | Phone: ${r.user.phone || "—"} | Language: ${r.language} | Submitted: ${r.createdAt ? new Date(r.createdAt).toLocaleDateString() : "—"}`,
      }),
    );
    children.push(
      new Paragraph({
        text: location ? `Location: ${location}` : "Location: —",
      }),
    );

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
