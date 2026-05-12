import { Suspense } from "react";
import type { getAdminOfferings } from "@/app/(admin)/actions/admin";
import { OfferingsFilter } from "@/app/(admin)/admin-dashboard/offerings/_components/OfferingsFilter";
import type { OfferingsFilterInitialSelections } from "@/app/(admin)/admin-dashboard/offerings/_components/OfferingsFilter";
import { ViewEditOfferingModal } from "@/app/(admin)/admin-dashboard/offerings/_components/ViewEditOfferingModal";
import { OfferingsExportButtons } from "@/components/offerings/OfferingsExportButtons";
import { OfferingsPageViewModal } from "@/components/offerings/OfferingsPageViewModal";
import { OfferingsPagination } from "@/components/offerings/OfferingsPagination";
import {
  hasStaffEdit,
  staffEditorLabel,
} from "@/lib/offering-staff-edit";
import { cn } from "@/lib/utils";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { FileDown } from "lucide-react";

type OfferingRow = Awaited<
  ReturnType<typeof getAdminOfferings>
>["items"][number];

function templeDisplayName(item: OfferingRow) {
  if (item.templeName) return item.templeName;
  if (item.user.otherTempleName) return `Other (${item.user.otherTempleName})`;
  return "—";
}

export interface OfferingsListPageProps {
  offerings: OfferingRow[];
  total: number;
  page: number;
  totalPages: number;
  initialSelections: OfferingsFilterInitialSelections;
  basePath: string;
}

export function OfferingsListPage({
  offerings,
  total,
  page,
  totalPages,
  initialSelections,
  basePath,
}: OfferingsListPageProps) {
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap justify-between items-center gap-3">
        <div className="flex flex-wrap items-baseline gap-3 min-w-0">
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
            Offerings
          </h1>
          {total > 0 && (
            <p className="text-sm text-gray-500">
              {total} result{total === 1 ? "" : "s"}
            </p>
          )}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Suspense fallback={null}>
            <OfferingsExportButtons />
          </Suspense>
          <OfferingsPageViewModal offerings={offerings} />
        </div>
      </div>

      <Suspense
        fallback={
          <div className="h-[120px] bg-gray-100 rounded-lg border border-gray-200 animate-pulse mb-6"></div>
        }
      >
        <OfferingsFilter
          initialSelections={initialSelections}
          basePath={basePath}
        />
      </Suspense>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-gray-50/50">
              <TableRow>
                <TableHead>Devotee</TableHead>
                <TableHead>Initiated Name</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Year</TableHead>
                <TableHead>Country</TableHead>
                <TableHead>State</TableHead>
                <TableHead>City</TableHead>
                <TableHead>Temple</TableHead>
                <TableHead>Language</TableHead>
                <TableHead className="whitespace-nowrap">Staff edited</TableHead>
                <TableHead className="min-w-[200px]">Offering</TableHead>
                <TableHead className="whitespace-nowrap">Document</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {offerings.map((item) => {
                const edited = hasStaffEdit(item);
                const editor = staffEditorLabel(item);
                return (
                <TableRow
                  key={item.id}
                  className={cn(
                    edited
                      ? "bg-emerald-50/90 hover:bg-emerald-50 data-[state=selected]:bg-emerald-50"
                      : "bg-red-50/80 hover:bg-red-50/90 data-[state=selected]:bg-red-50/80",
                  )}
                >
                  <TableCell className="font-medium text-gray-900 whitespace-nowrap">
                    {item.user.firstName} {item.user.lastName}
                  </TableCell>
                  <TableCell className="whitespace-nowrap">
                    {item.user.initiatedName || "-"}
                  </TableCell>
                  <TableCell className="whitespace-nowrap text-sm text-gray-800">
                    {item.user.phone || "—"}
                  </TableCell>
                  <TableCell className="whitespace-nowrap">{item.year}</TableCell>
                  <TableCell className="text-sm text-gray-700 max-w-[140px] truncate">
                    {item.countryName ?? "—"}
                  </TableCell>
                  <TableCell className="text-sm text-gray-700 max-w-[140px] truncate">
                    {item.stateName ?? "—"}
                  </TableCell>
                  <TableCell className="text-sm text-gray-700 max-w-[140px] truncate">
                    {item.cityName ?? "—"}
                  </TableCell>
                  <TableCell className="text-sm text-gray-700 max-w-[160px] truncate">
                    {templeDisplayName(item)}
                  </TableCell>
                  <TableCell className="whitespace-nowrap">
                    {item.language}
                  </TableCell>
                  <TableCell className="text-sm align-top">
                    <div className="flex flex-col gap-0.5">
                      <span
                        className={cn(
                          "font-medium",
                          edited ? "text-emerald-800" : "text-red-800",
                        )}
                      >
                        {edited ? "Yes" : "No"}
                      </span>
                      {editor ? (
                        <span className="text-xs text-gray-600 max-w-[140px]">
                          {editor}
                        </span>
                      ) : null}
                    </div>
                  </TableCell>
                  <TableCell>
                    <ViewEditOfferingModal
                      offering={{
                        id: item.id,
                        offering: item.offering,
                        language: item.language,
                        documentUrl: item.documentUrl,
                        userParams: `${item.user.firstName} ${item.user.lastName} - ${item.year}`,
                      }}
                    />
                  </TableCell>
                  <TableCell className="whitespace-nowrap">
                    {item.documentUrl ? (
                      <a
                        href={item.documentUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-indigo-600 hover:text-indigo-800 hover:underline text-sm"
                        title="Download original .docx"
                      >
                        <FileDown className="h-3.5 w-3.5" aria-hidden />
                        Download
                      </a>
                    ) : (
                      <span className="text-sm text-gray-400">—</span>
                    )}
                  </TableCell>
                  <TableCell className="text-sm whitespace-nowrap">
                    {item.createdAt
                      ? new Date(item.createdAt).toLocaleDateString()
                      : "-"}
                  </TableCell>
                </TableRow>
                );
              })}
              {offerings.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={13}
                    className="h-24 text-center text-gray-500"
                  >
                    No offerings found for the selected filters.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        <Suspense fallback={null}>
          <OfferingsPagination
            basePath={basePath}
            currentPage={page}
            totalPages={totalPages}
          />
        </Suspense>
      </div>
    </div>
  );
}
