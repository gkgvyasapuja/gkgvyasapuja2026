import { FileDown } from "lucide-react";
import { cn } from "@/lib/utils";

const linkClass =
  "inline-flex items-center justify-center gap-1.5 text-indigo-600 hover:text-indigo-800 hover:underline text-sm";

const compactLinkClass =
  "inline-flex items-center gap-1.5 rounded-md border border-input bg-background px-2.5 py-1.5 text-xs font-medium text-indigo-600 hover:bg-muted hover:text-indigo-700 transition-colors";

export function OfferingDocumentLinks({
  offeringId,
  documentUrl,
  variant = "table",
}: {
  offeringId: string;
  documentUrl: string | null;
  variant?: "table" | "compact";
}) {
  const editedHref = `/api/offerings/${offeringId}/edited-docx`;
  const className = variant === "compact" ? compactLinkClass : linkClass;

  return (
    <div
      className={cn(
        "flex flex-col items-center gap-1",
        variant === "compact" && "items-stretch sm:items-end",
      )}
    >
      {documentUrl ? (
        <a
          href={documentUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={className}
          title="Download original uploaded document from S3"
        >
          <FileDown className="h-3.5 w-3.5" aria-hidden />
          Original
        </a>
      ) : null}
      <a
        href={editedHref}
        className={className}
        title="Download current offering content as .docx (includes staff edits)"
      >
        <FileDown className="h-3.5 w-3.5" aria-hidden />
        Edited .docx
      </a>
    </div>
  );
}
