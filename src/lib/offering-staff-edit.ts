/** Rows from getAdminOfferings / export with staff-edit columns. */

export function hasStaffEdit(row: { markedEditedAt: Date | string | null }) {
  return row.markedEditedAt != null;
}

export function staffMarkerLabel(row: {
  markedEditedAt: Date | string | null;
  markedEditedByRole: "admin" | "maintainer" | null;
  markedEditorLabel: string | null;
  markedEditorLoginId: string | null;
}): string | null {
  if (!row.markedEditedAt) return null;
  if (row.markedEditedByRole === "admin") return "Admin";
  return (
    row.markedEditorLabel?.trim() || row.markedEditorLoginId || "Maintainer"
  );
}

export function contentEditorLabel(row: {
  lastEditedAt: Date | string | null;
  lastEditedByRole: "admin" | "maintainer" | null;
  lastEditorLabel: string | null;
  lastEditorLoginId: string | null;
}): string | null {
  if (!row.lastEditedAt) return null;
  if (row.lastEditedByRole === "admin") return "Admin";
  return (
    row.lastEditorLabel?.trim() || row.lastEditorLoginId || "Maintainer"
  );
}

/** @deprecated Use staffMarkerLabel or contentEditorLabel. */
export function staffEditorLabel(row: {
  markedEditedAt: Date | string | null;
  markedEditedByRole: "admin" | "maintainer" | null;
  markedEditorLabel: string | null;
  markedEditorLoginId: string | null;
}): string | null {
  return staffMarkerLabel(row);
}

export function formatStaffEditedAt(
  value: Date | string | null | undefined,
): string {
  if (!value) return "—";
  const d = value instanceof Date ? value : new Date(value);
  return Number.isNaN(d.getTime()) ? "—" : d.toLocaleString();
}

/** True when the saved offering HTML contains embedded image markup.
 * Mammoth inlines images as `<img src="data:...">`, so a tag match is reliable. */
export function offeringHasImages(html: string | null | undefined): boolean {
  if (!html) return false;
  return /<img\b/i.test(html);
}
