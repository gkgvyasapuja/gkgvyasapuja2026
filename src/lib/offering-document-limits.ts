/** Max .docx size for offering upload (matches UI copy). */
export const MAX_OFFERING_DOC_BYTES = 2 * 1024 * 1024;

/** Client-side cap while waiting for parseDocx server action (slow mobile networks). */
export const PARSE_DOCX_TIMEOUT_MS = 90_000;

export function isOfferingDocTooLarge(sizeBytes: number): boolean {
  return sizeBytes > MAX_OFFERING_DOC_BYTES;
}
