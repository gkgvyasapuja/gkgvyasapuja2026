import { redirect } from "next/navigation";
import {
  getAdminOfferings,
  resolveOfferingFilterSelections,
} from "@/app/(admin)/actions/admin";
import { OfferingsListPage } from "@/components/offerings/OfferingsListPage";
import { buildOfferingsListUrl } from "@/lib/build-offerings-list-url";

const BASE = "/admin-dashboard/offerings";

export default async function OfferingsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const sp = await searchParams;
  const { filter, initialSelections } = await resolveOfferingFilterSelections({
    country: sp.country as string | undefined,
    state: sp.state as string | undefined,
    city: sp.city as string | undefined,
    temple: sp.temple as string | undefined,
  });

  const pageRaw = sp.page;
  const parsedPage =
    typeof pageRaw === "string" ? parseInt(pageRaw, 10) : Number.NaN;
  const page =
    Number.isFinite(parsedPage) && parsedPage >= 1 ? parsedPage : 1;

  const language = sp.language as string | undefined;
  const dateFrom = sp.dateFrom as string | undefined;
  const dateTo = sp.dateTo as string | undefined;

  const result = await getAdminOfferings({
    ...filter,
    language,
    dateFrom,
    dateTo,
    page,
  });

  if (result.totalPages > 0 && page > result.totalPages) {
    redirect(buildOfferingsListUrl(BASE, sp, result.totalPages));
  }

  return (
    <OfferingsListPage
      offerings={result.items}
      total={result.total}
      page={result.page}
      totalPages={result.totalPages}
      initialSelections={initialSelections}
      basePath={BASE}
    />
  );
}
