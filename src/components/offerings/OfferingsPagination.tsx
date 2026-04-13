"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";

interface OfferingsPaginationProps {
  basePath: string;
  currentPage: number;
  totalPages: number;
}

function buildHref(
  basePath: string,
  searchParams: URLSearchParams,
  page: number,
) {
  const p = new URLSearchParams(searchParams.toString());
  if (page <= 1) {
    p.delete("page");
  } else {
    p.set("page", String(page));
  }
  const q = p.toString();
  return q ? `${basePath}?${q}` : basePath;
}

const navButtonClass =
  "inline-flex h-9 items-center rounded-md border border-input bg-background px-3 text-sm font-medium text-gray-900 shadow-sm transition-colors hover:bg-accent";

const navDisabledClass =
  "inline-flex h-9 cursor-not-allowed items-center rounded-md border border-input bg-muted/60 px-3 text-sm font-medium text-muted-foreground opacity-60";

export function OfferingsPagination({
  basePath,
  currentPage,
  totalPages,
}: OfferingsPaginationProps) {
  const searchParams = useSearchParams();

  if (totalPages < 1) {
    return null;
  }

  const prev = Math.max(1, currentPage - 1);
  const next = Math.min(totalPages, currentPage + 1);
  const canGoPrev = currentPage > 1;
  const canGoNext = currentPage < totalPages;

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 border-t border-gray-200 bg-gray-50/50 px-4 py-3">
      <p className="text-sm text-gray-600">
        Page {currentPage} of {totalPages}
      </p>
      <div className="flex flex-wrap items-center gap-2">
        {canGoPrev ? (
          <Link href={buildHref(basePath, searchParams, prev)} className={navButtonClass}>
            Previous
          </Link>
        ) : (
          <span className={navDisabledClass} aria-disabled="true">
            Previous
          </span>
        )}
        {canGoNext ? (
          <Link href={buildHref(basePath, searchParams, next)} className={navButtonClass}>
            Next
          </Link>
        ) : (
          <span className={navDisabledClass} aria-disabled="true">
            Next
          </span>
        )}
      </div>
    </div>
  );
}
