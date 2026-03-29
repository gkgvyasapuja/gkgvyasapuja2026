/** Build offerings list URL preserving filters and page. */
export function buildOfferingsListUrl(
  basePath: string,
  sp: Record<string, string | string[] | undefined>,
  page: number,
) {
  const p = new URLSearchParams();
  const set = (key: string, val: string | undefined) => {
    if (val) p.set(key, val);
  };
  set("country", sp.country as string | undefined);
  set("state", sp.state as string | undefined);
  set("city", sp.city as string | undefined);
  set("temple", sp.temple as string | undefined);
  set("language", sp.language as string | undefined);
  set("dateFrom", sp.dateFrom as string | undefined);
  set("dateTo", sp.dateTo as string | undefined);
  if (page > 1) p.set("page", String(page));
  const q = p.toString();
  return q ? `${basePath}?${q}` : basePath;
}
