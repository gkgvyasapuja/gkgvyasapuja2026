"use client";

import { useCallback, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  searchCountries,
  searchStates,
  searchCities,
  searchTemples,
} from "@/app/(admin)/actions/admin";
import {
  AsyncSearchCombobox,
  type ComboboxItem,
} from "@/app/(admin)/admin-dashboard/cities/_components/AsyncSearchCombobox";

export interface OfferingsFilterInitialSelections {
  country: ComboboxItem | null;
  state: ComboboxItem | null;
  city: ComboboxItem | null;
  temple: ComboboxItem | null;
}

interface OfferingsFilterProps {
  basePath?: string;
  initialSelections: OfferingsFilterInitialSelections;
}

export function OfferingsFilter({
  basePath = "/admin-dashboard/offerings",
  initialSelections,
}: OfferingsFilterProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentLanguage = searchParams.get("language") || "";
  const dateFrom = searchParams.get("dateFrom") || "";
  const dateTo = searchParams.get("dateTo") || "";

  const pushWithParams = useCallback(
    (mutate: (p: URLSearchParams) => void) => {
      const next = new URLSearchParams(searchParams.toString());
      next.delete("page");
      mutate(next);
      const q = next.toString();
      router.push(q ? `${basePath}?${q}` : basePath);
    },
    [basePath, router, searchParams],
  );

  const searchCountriesCb = useCallback(
    (q: string) => searchCountries(q),
    [],
  );

  const searchStatesCb = useCallback(
    (q: string) =>
      searchStates(q, {
        countryId: initialSelections.country?.id,
      }),
    [initialSelections.country?.id],
  );

  const searchCitiesCb = useCallback(
    (q: string) =>
      searchCities(q, {
        stateId: initialSelections.state?.id,
        countryId: initialSelections.country?.id,
      }),
    [initialSelections.country?.id, initialSelections.state?.id],
  );

  const searchTemplesCb = useCallback(
    (q: string) =>
      searchTemples(q, {
        cityId: initialSelections.city?.id,
        stateId: initialSelections.state?.id,
      }),
    [initialSelections.city?.id, initialSelections.state?.id],
  );

  const hasActiveFilters = useMemo(() => {
    return (
      !!initialSelections.country ||
      !!initialSelections.state ||
      !!initialSelections.city ||
      !!initialSelections.temple ||
      !!currentLanguage ||
      !!dateFrom ||
      !!dateTo
    );
  }, [
    initialSelections,
    currentLanguage,
    dateFrom,
    dateTo,
  ]);

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4 tracking-tight">
        Filter Offerings
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        <AsyncSearchCombobox
          id="offerings-country"
          label="Country"
          placeholder="Search country…"
          search={searchCountriesCb}
          value={initialSelections.country}
          emptyMessage="No countries found"
          onChange={(item) => {
            pushWithParams((p) => {
              if (item) p.set("country", item.id);
              else p.delete("country");
              p.delete("state");
              p.delete("city");
              p.delete("temple");
            });
          }}
        />

        <AsyncSearchCombobox
          id="offerings-state"
          label="State"
          placeholder={
            initialSelections.country || initialSelections.state
              ? "Search state…"
              : "Select a country first"
          }
          search={searchStatesCb}
          value={initialSelections.state}
          disabled={
            !initialSelections.country && !initialSelections.state
          }
          emptyMessage="No states found"
          onChange={(item) => {
            pushWithParams((p) => {
              if (item) p.set("state", item.id);
              else p.delete("state");
              p.delete("city");
              p.delete("temple");
            });
          }}
        />

        <AsyncSearchCombobox
          id="offerings-city"
          label="City"
          placeholder={
            initialSelections.state || initialSelections.country
              ? "Search city…"
              : "Select country or state first"
          }
          search={searchCitiesCb}
          value={initialSelections.city}
          disabled={
            !initialSelections.state && !initialSelections.country
          }
          emptyMessage="No cities found"
          onChange={(item) => {
            pushWithParams((p) => {
              if (item) p.set("city", item.id);
              else p.delete("city");
              p.delete("temple");
            });
          }}
        />

        <AsyncSearchCombobox
          id="offerings-temple"
          label="Temple"
          placeholder={
            initialSelections.state || initialSelections.city
              ? "Search temple…"
              : "Select state or city first"
          }
          search={searchTemplesCb}
          value={initialSelections.temple}
          disabled={
            !initialSelections.state &&
            !initialSelections.city &&
            !initialSelections.temple
          }
          emptyMessage="No temples found"
          onChange={(item) => {
            pushWithParams((p) => {
              if (item) p.set("temple", item.id);
              else p.delete("temple");
            });
          }}
        />

        <div className="flex flex-col gap-2">
          <Label htmlFor="language-filter" className="text-sm font-medium">
            Language
          </Label>
          <select
            id="language-filter"
            value={currentLanguage}
            onChange={(e) => {
              const v = e.target.value;
              pushWithParams((p) => {
                if (v) p.set("language", v);
                else p.delete("language");
              });
            }}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            <option value="">All Languages</option>
            <option value="English">English</option>
            <option value="Hindi">Hindi</option>
          </select>
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="date-from" className="text-sm font-medium">
            Date from
          </Label>
          <Input
            id="date-from"
            type="date"
            value={dateFrom}
            onChange={(e) => {
              const v = e.target.value;
              pushWithParams((p) => {
                if (v) p.set("dateFrom", v);
                else p.delete("dateFrom");
              });
            }}
            className="h-10"
          />
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="date-to" className="text-sm font-medium">
            Date to
          </Label>
          <Input
            id="date-to"
            type="date"
            value={dateTo}
            onChange={(e) => {
              const v = e.target.value;
              pushWithParams((p) => {
                if (v) p.set("dateTo", v);
                else p.delete("dateTo");
              });
            }}
            className="h-10"
          />
        </div>
      </div>

      {hasActiveFilters && (
        <div className="mt-4 flex justify-end">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push(basePath)}
            className="text-sm"
          >
            Clear filters
          </Button>
        </div>
      )}
    </div>
  );
}
