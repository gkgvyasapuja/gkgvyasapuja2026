import { redirect } from "next/navigation";
import { getTempleRequests } from "@/app/(admin)/actions/temple-requests";
import { TempleRequestsListPage } from "@/components/temple-requests/TempleRequestsListPage";

const BASE = "/admin-dashboard/temple-requests";

export default async function AdminTempleRequestsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const sp = await searchParams;
  const statusRaw = typeof sp.status === "string" ? sp.status : undefined;
  const pageRaw = typeof sp.page === "string" ? sp.page : undefined;
  const parsedPage = pageRaw ? parseInt(pageRaw, 10) : Number.NaN;
  const page =
    Number.isFinite(parsedPage) && parsedPage >= 1 ? parsedPage : 1;

  const result = await getTempleRequests({ status: statusRaw, page });

  if (result.totalPages > 0 && page > result.totalPages) {
    const sp = new URLSearchParams();
    if (result.status !== "pending") sp.set("status", result.status);
    if (result.totalPages > 1) sp.set("page", String(result.totalPages));
    const qs = sp.toString();
    redirect(qs ? `${BASE}?${qs}` : BASE);
  }

  return (
    <TempleRequestsListPage
      items={result.items}
      total={result.total}
      page={result.page}
      totalPages={result.totalPages}
      pendingTotal={result.pendingTotal}
      status={result.status}
      basePath={BASE}
    />
  );
}
