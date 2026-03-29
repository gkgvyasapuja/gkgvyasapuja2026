"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";

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

export function OfferingsPagination({
  basePath,
  currentPage,
  totalPages,
}: OfferingsPaginationProps) {
  const searchParams = useSearchParams();

  if (totalPages <= 1) {
    return null;
  }

  const prev = Math.max(1, currentPage - 1);
  const next = Math.min(totalPages, currentPage + 1);

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 border-t border-gray-200 bg-gray-50/50 px-4 py-3">
      <p className="text-sm text-gray-600">
        Page {currentPage} of {totalPages}
      </p>
      <div className="flex flex-wrap items-center gap-2">
        <Link
          href={buildHref(basePath, searchParams, prev)}
          aria-disabled={currentPage <= 1}
          className={cn(
            "inline-flex h-9 items-center rounded-md border border-input bg-background px-3 text-sm font-medium text-gray-900 shadow-sm transition-colors hover:bg-accent",
            currentPage <= 1 && "pointer-events-none opacity-50",
          )}
        >
          Previous
        </Link>
        <Link
          href={buildHref(basePath, searchParams, next)}
          aria-disabled={currentPage >= totalPages}
          className={cn(
            "inline-flex h-9 items-center rounded-md border border-input bg-background px-3 text-sm font-medium text-gray-900 shadow-sm transition-colors hover:bg-accent",
            currentPage >= totalPages && "pointer-events-none opacity-50",
          )}
        >
          Next
        </Link>
      </div>
    </div>
  );
}
