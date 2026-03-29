"use client";

import { useSearchParams } from "next/navigation";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { FileSpreadsheet, FileText } from "lucide-react";

function exportHref(searchParams: URLSearchParams, format: "xlsx" | "docx") {
  const p = new URLSearchParams(searchParams.toString());
  p.set("format", format);
  return `/api/offerings/export?${p.toString()}`;
}

export function OfferingsExportButtons() {
  const searchParams = useSearchParams();

  const linkClass = cn(
    buttonVariants({ variant: "outline", size: "sm" }),
    "no-underline",
  );

  return (
    <div className="flex flex-wrap items-center gap-2">
      <a href={exportHref(searchParams, "xlsx")} className={linkClass}>
        <FileSpreadsheet className="h-4 w-4 mr-1.5" aria-hidden />
        Export Excel
      </a>
      <a href={exportHref(searchParams, "docx")} className={linkClass}>
        <FileText className="h-4 w-4 mr-1.5" aria-hidden />
        Export Word (combined)
      </a>
    </div>
  );
}
