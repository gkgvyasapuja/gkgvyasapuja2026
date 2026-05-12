import Link from "next/link";
import { Suspense } from "react";
import type { TempleRequestRow } from "@/app/(admin)/actions/temple-requests";
import { TempleRequestActions } from "./TempleRequestActions";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";

const TABS: { value: "pending" | "approved" | "rejected"; label: string }[] = [
  { value: "pending", label: "Pending" },
  { value: "approved", label: "Approved" },
  { value: "rejected", label: "Rejected" },
];

function statusBadgeClass(status: string) {
  switch (status) {
    case "approved":
      return "bg-emerald-50 text-emerald-700 border-emerald-200";
    case "rejected":
      return "bg-red-50 text-red-700 border-red-200";
    default:
      return "bg-amber-50 text-amber-700 border-amber-200";
  }
}

function reviewerSummary(row: TempleRequestRow) {
  if (!row.reviewedAt) return "—";
  if (row.reviewerRole === "admin") return "Admin";
  if (row.reviewerLabel) return row.reviewerLabel;
  if (row.reviewerLoginId) return row.reviewerLoginId;
  return "Maintainer";
}

function buildHref(
  basePath: string,
  opts: { status?: string; page?: number },
) {
  const p = new URLSearchParams();
  if (opts.status && opts.status !== "pending") p.set("status", opts.status);
  if (opts.page && opts.page > 1) p.set("page", String(opts.page));
  const qs = p.toString();
  return qs ? `${basePath}?${qs}` : basePath;
}

export interface TempleRequestsListPageProps {
  items: TempleRequestRow[];
  total: number;
  page: number;
  totalPages: number;
  pendingTotal: number;
  status: "pending" | "approved" | "rejected";
  basePath: string;
}

export function TempleRequestsListPage({
  items,
  total,
  page,
  totalPages,
  pendingTotal,
  status,
  basePath,
}: TempleRequestsListPageProps) {
  const showActions = status === "pending";

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap justify-between items-center gap-3">
        <div className="flex flex-wrap items-baseline gap-3 min-w-0">
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
            Temple Requests
          </h1>
          <p className="text-sm text-gray-500">
            {pendingTotal} pending {pendingTotal === 1 ? "review" : "reviews"}
          </p>
        </div>
      </div>

      <div className="inline-flex items-center rounded-lg border border-gray-200 bg-white p-1">
        {TABS.map((tab) => {
          const isActive = tab.value === status;
          return (
            <Link
              key={tab.value}
              href={buildHref(basePath, { status: tab.value })}
              className={cn(
                "px-3 py-1.5 rounded-md text-sm font-medium transition-colors",
                isActive
                  ? "bg-indigo-600 text-white"
                  : "text-gray-600 hover:bg-gray-100",
              )}
            >
              {tab.label}
            </Link>
          );
        })}
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-gray-50/50">
              <TableRow>
                <TableHead>Devotee</TableHead>
                <TableHead>Proposed Temple</TableHead>
                <TableHead>Country</TableHead>
                <TableHead>State</TableHead>
                <TableHead>City</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Submitted</TableHead>
                {status !== "pending" && (
                  <>
                    <TableHead>Reviewed</TableHead>
                    <TableHead>Reviewer</TableHead>
                  </>
                )}
                {status === "approved" && (
                  <TableHead>Linked temple</TableHead>
                )}
                {showActions && (
                  <TableHead className="text-right min-w-[180px]">
                    Actions
                  </TableHead>
                )}
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((row) => (
                <TableRow key={row.id}>
                  <TableCell className="font-medium text-gray-900 whitespace-nowrap">
                    <div className="flex flex-col">
                      <span>
                        {row.user.firstName} {row.user.lastName}
                      </span>
                      <span className="text-xs text-gray-500">
                        {row.user.email}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm text-gray-800 max-w-[260px]">
                    {row.name}
                  </TableCell>
                  <TableCell className="text-sm text-gray-700">
                    {row.countryName ?? "—"}
                  </TableCell>
                  <TableCell className="text-sm text-gray-700">
                    {row.stateName ?? "—"}
                  </TableCell>
                  <TableCell className="text-sm text-gray-700">
                    {row.cityName ?? "—"}
                  </TableCell>
                  <TableCell>
                    <span
                      className={cn(
                        "inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium capitalize",
                        statusBadgeClass(row.status),
                      )}
                    >
                      {row.status}
                    </span>
                  </TableCell>
                  <TableCell className="text-sm whitespace-nowrap text-gray-600">
                    {row.createdAt
                      ? new Date(row.createdAt).toLocaleDateString()
                      : "—"}
                  </TableCell>
                  {status !== "pending" && (
                    <>
                      <TableCell className="text-sm whitespace-nowrap text-gray-600">
                        {row.reviewedAt
                          ? new Date(row.reviewedAt).toLocaleDateString()
                          : "—"}
                      </TableCell>
                      <TableCell className="text-sm text-gray-700">
                        {reviewerSummary(row)}
                      </TableCell>
                    </>
                  )}
                  {status === "approved" && (
                    <TableCell className="text-sm text-gray-700">
                      {row.approvedTempleName ?? "—"}
                    </TableCell>
                  )}
                  {showActions && (
                    <TableCell className="text-right">
                      <Suspense fallback={null}>
                        <TempleRequestActions
                          requestId={row.id}
                          proposedName={row.name}
                          devoteeName={`${row.user.firstName} ${row.user.lastName}`.trim()}
                        />
                      </Suspense>
                    </TableCell>
                  )}
                </TableRow>
              ))}
              {items.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={11}
                    className="h-24 text-center text-gray-500"
                  >
                    No {status} temple requests.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {total > 0 && totalPages > 1 && (
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 text-sm text-gray-600">
          <p>
            Page <span className="font-medium text-gray-900">{page}</span> of{" "}
            <span className="font-medium text-gray-900">{totalPages}</span> —{" "}
            <span className="font-medium text-gray-900">{total}</span> total
          </p>
          <div className="flex items-center gap-2">
            {page > 1 ? (
              <Link
                href={buildHref(basePath, { status, page: page - 1 })}
                className="inline-flex items-center justify-center rounded-md border border-input bg-background px-3 py-1.5 text-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground"
              >
                Previous
              </Link>
            ) : (
              <span className="inline-flex items-center justify-center rounded-md border border-transparent px-3 py-1.5 text-sm text-gray-400 cursor-not-allowed">
                Previous
              </span>
            )}
            {page < totalPages ? (
              <Link
                href={buildHref(basePath, { status, page: page + 1 })}
                className="inline-flex items-center justify-center rounded-md border border-input bg-background px-3 py-1.5 text-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground"
              >
                Next
              </Link>
            ) : (
              <span className="inline-flex items-center justify-center rounded-md border border-transparent px-3 py-1.5 text-sm text-gray-400 cursor-not-allowed">
                Next
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
