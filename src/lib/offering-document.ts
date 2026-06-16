/** Shared validation for offering uploads (.doc and .docx). */

export const OFFERING_DOC_ACCEPT = ".doc,.docx";

export const OFFERING_DOC_RETRY_HINT =
  " Please select your .doc or .docx file and try uploading again.";

export type OfferingDocExtension = "doc" | "docx";

export function getOfferingDocExtension(fileName: string): OfferingDocExtension | null {
  const lower = fileName.toLowerCase();
  if (lower.endsWith(".docx")) return "docx";
  if (lower.endsWith(".doc")) return "doc";
  return null;
}

export function isOfferingDocFileName(fileName: string): boolean {
  return getOfferingDocExtension(fileName) !== null;
}

export function offeringDocContentType(ext: OfferingDocExtension): string {
  return ext === "docx"
    ? "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    : "application/msword";
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/** Convert plain text from legacy .doc extraction into simple HTML paragraphs. */
export function plainTextToOfferingHtml(text: string): string {
  const lines = text.replace(/\r\n/g, "\n").split("\n");
  const paragraphs = lines
    .map((line) => line.trim())
    .filter((line) => line.length > 0);

  if (paragraphs.length === 0) {
    return "<p></p>";
  }

  return paragraphs.map((line) => `<p>${escapeHtml(line)}</p>`).join("");
}
