import { Suspense } from "react";
import type { getAdminOfferings } from "@/app/(admin)/actions/admin";
import { OfferingsFilter } from "@/app/(admin)/admin-dashboard/offerings/_components/OfferingsFilter";
import type { OfferingsFilterInitialSelections } from "@/app/(admin)/admin-dashboard/offerings/_components/OfferingsFilter";
import { ViewEditOfferingModal } from "@/app/(admin)/admin-dashboard/offerings/_components/ViewEditOfferingModal";
import { OfferingsExportButtons } from "@/components/offerings/OfferingsExportButtons";
import { OfferingsPagination } from "@/components/offerings/OfferingsPagination";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type OfferingRow = Awaited<
  ReturnType<typeof getAdminOfferings>
>["items"][number];

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
        <Suspense fallback={null}>
          <OfferingsExportButtons />
        </Suspense>
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
                <TableHead className="min-w-[200px]">Offering</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {offerings.map((item) => (
                <TableRow key={item.id}>
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
                    {item.templeName ?? "—"}
                  </TableCell>
                  <TableCell className="whitespace-nowrap">
                    {item.language}
                  </TableCell>
                  <TableCell>
                    <ViewEditOfferingModal
                      offering={{
                        id: item.id,
                        offering: item.offering,
                        language: item.language,
                        userParams: `${item.user.firstName} ${item.user.lastName} - ${item.year}`,
                      }}
                    />
                  </TableCell>
                  <TableCell className="text-sm whitespace-nowrap">
                    {item.createdAt
                      ? new Date(item.createdAt).toLocaleDateString()
                      : "-"}
                  </TableCell>
                </TableRow>
              ))}
              {offerings.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={11}
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
