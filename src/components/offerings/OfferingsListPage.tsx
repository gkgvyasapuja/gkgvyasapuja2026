import { Suspense } from "react";
import type { getAdminOfferings } from "@/app/(admin)/actions/admin";
import { OfferingsFilter } from "@/app/(admin)/admin-dashboard/offerings/_components/OfferingsFilter";
import type { OfferingsFilterInitialSelections } from "@/app/(admin)/admin-dashboard/offerings/_components/OfferingsFilter";
import { ViewEditOfferingModal } from "@/app/(admin)/admin-dashboard/offerings/_components/ViewEditOfferingModal";
import { OfferingsExportButtons } from "@/components/offerings/OfferingsExportButtons";
import { OfferingsPageViewModal } from "@/components/offerings/OfferingsPageViewModal";
import { OfferingsPagination } from "@/components/offerings/OfferingsPagination";
import { OfferingNoteCell } from "@/components/offerings/OfferingNoteCell";
import {
  hasStaffEdit,
  offeringHasImages,
  staffMarkerLabel,
  contentEditorLabel,
} from "@/lib/offering-staff-edit";
import { OfferingMarkEditedControls } from "@/components/offerings/OfferingMarkEditedControls";
import { cn } from "@/lib/utils";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { FileDown, ImageIcon } from "lucide-react";

type OfferingRow = Awaited<
  ReturnType<typeof getAdminOfferings>
>["items"][number];

function templeDisplayName(item: OfferingRow) {
  if (item.templeName) return item.templeName;
  if (item.user.otherTempleName) return `Other (${item.user.otherTempleName})`;
  return "—";
}

const thClass = "text-center align-middle";
const tdClass = "text-center align-middle";

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
                <TableHead className={thClass}>Devotee</TableHead>
                <TableHead className={thClass}>Initiated Name</TableHead>
                <TableHead className={thClass}>Phone</TableHead>
                <TableHead className={thClass}>Year</TableHead>
                <TableHead className={thClass}>Country</TableHead>
                <TableHead className={thClass}>State</TableHead>
                <TableHead className={thClass}>City</TableHead>
                <TableHead className={thClass}>Temple</TableHead>
                <TableHead className={thClass}>Language</TableHead>
                <TableHead className={cn(thClass, "whitespace-nowrap")}>
                  Staff edited
                </TableHead>
                <TableHead className={cn(thClass, "whitespace-nowrap")}>
                  Images
                </TableHead>
                <TableHead className={cn(thClass, "min-w-[200px]")}>
                  Offering
                </TableHead>
                <TableHead className={cn(thClass, "min-w-[200px]")}>Note</TableHead>
                <TableHead className={cn(thClass, "whitespace-nowrap")}>
                  Document
                </TableHead>
                <TableHead className={thClass}>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {offerings.map((item) => {
                const edited = hasStaffEdit(item);
                const marker = staffMarkerLabel(item);
                const contentEditor = contentEditorLabel(item);
                const withImages = offeringHasImages(item.offering);
                return (
                <TableRow
                  key={item.id}
                  className={cn(
                    edited
                      ? "bg-emerald-50/90 hover:bg-emerald-50 data-[state=selected]:bg-emerald-50"
                      : "bg-red-50/80 hover:bg-red-50/90 data-[state=selected]:bg-red-50/80",
                  )}
                >
                  <TableCell className={cn(tdClass, "font-medium text-gray-900 whitespace-nowrap")}>
                    {item.user.firstName} {item.user.lastName}
                  </TableCell>
                  <TableCell className={cn(tdClass, "whitespace-nowrap")}>
                    {item.user.initiatedName || "-"}
                  </TableCell>
                  <TableCell className={cn(tdClass, "whitespace-nowrap text-sm text-gray-800")}>
                    {item.user.phone || "—"}
                  </TableCell>
                  <TableCell className={cn(tdClass, "whitespace-nowrap")}>{item.year}</TableCell>
                  <TableCell className={cn(tdClass, "text-sm text-gray-700 max-w-[140px] truncate")}>
                    {item.countryName ?? "—"}
                  </TableCell>
                  <TableCell className={cn(tdClass, "text-sm text-gray-700 max-w-[140px] truncate")}>
                    {item.stateName ?? "—"}
                  </TableCell>
                  <TableCell className={cn(tdClass, "text-sm text-gray-700 max-w-[140px] truncate")}>
                    {item.cityName ?? "—"}
                  </TableCell>
                  <TableCell className={cn(tdClass, "text-sm text-gray-700 max-w-[160px] truncate")}>
                    {templeDisplayName(item)}
                  </TableCell>
                  <TableCell className={cn(tdClass, "whitespace-nowrap")}>
                    {item.language}
                  </TableCell>
                  <TableCell className={cn(tdClass, "text-sm whitespace-normal")}>
                    <div className="flex flex-col items-center justify-center gap-1 mx-auto max-w-[160px]">
                      <span
                        className={cn(
                          "font-medium",
                          edited ? "text-emerald-800" : "text-red-800",
                        )}
                      >
                        {edited ? "Yes" : "No"}
                      </span>
                      {marker ? (
                        <span className="text-xs text-gray-600 text-center">
                          Marked by {marker}
                        </span>
                      ) : contentEditor ? (
                        <span className="text-xs text-gray-500 text-center">
                          Last edit: {contentEditor}
                        </span>
                      ) : null}
                      <OfferingMarkEditedControls
                        offeringId={item.id}
                        marked={edited}
                      />
                    </div>
                  </TableCell>
                  <TableCell className={cn(tdClass, "whitespace-nowrap")}>
                    {withImages ? (
                      <span
                        className="inline-flex items-center gap-1 rounded-full border border-amber-200 bg-amber-50 px-2 py-0.5 text-xs font-medium text-amber-800"
                        title="This offering contains embedded images"
                      >
                        <ImageIcon className="h-3 w-3" aria-hidden />
                        Yes
                      </span>
                    ) : (
                      <span className="text-xs text-gray-500">No</span>
                    )}
                  </TableCell>
                  <TableCell className={cn(tdClass)}>
                    <div className="flex justify-center">
                      <ViewEditOfferingModal
                      offering={{
                        id: item.id,
                        offering: item.offering,
                        language: item.language,
                        documentUrl: item.documentUrl,
                        userParams: `${item.user.firstName} ${item.user.lastName} - ${item.year}`,
                      }}
                    />
                    </div>
                  </TableCell>
                  <TableCell className={cn(tdClass, "whitespace-normal")}>
                    <OfferingNoteCell
                      offeringId={item.id}
                      initialNote={item.note}
                    />
                  </TableCell>
                  <TableCell className={cn(tdClass, "whitespace-nowrap")}>
                    {item.documentUrl ? (
                      <a
                        href={item.documentUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center gap-1.5 text-indigo-600 hover:text-indigo-800 hover:underline text-sm"
                        title="Download original .docx"
                      >
                        <FileDown className="h-3.5 w-3.5" aria-hidden />
                        Download
                      </a>
                    ) : (
                      <span className="text-sm text-gray-400">—</span>
                    )}
                  </TableCell>
                  <TableCell className={cn(tdClass, "text-sm whitespace-nowrap")}>
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
                    colSpan={15}
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
