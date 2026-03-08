"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

type LocationItem = { id: string; name: string };

interface OfferingsFilterProps {
  countries: LocationItem[];
  states: LocationItem[];
  cities: LocationItem[];
  temples: LocationItem[];
}

export function OfferingsFilter({
  countries,
  states,
  cities,
  temples,
}: OfferingsFilterProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentCountry = searchParams.get("country") || "";
  const currentState = searchParams.get("state") || "";
  const currentCity = searchParams.get("city") || "";
  const currentTemple = searchParams.get("temple") || "";

  const handleFilterChange = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    router.push(`/admin-dashboard/offerings?${params.toString()}`);
  };

  const handleClear = () => {
    router.push("/admin-dashboard/offerings");
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4 tracking-tight">
        Filter Offerings
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="flex flex-col gap-2">
          <Label htmlFor="country-filter" className="text-sm font-medium">
            Country
          </Label>
          <select
            id="country-filter"
            value={currentCountry}
            onChange={(e) => handleFilterChange("country", e.target.value)}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <option value="">All Countries</option>
            {countries.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="state-filter" className="text-sm font-medium">
            State
          </Label>
          <select
            id="state-filter"
            value={currentState}
            onChange={(e) => handleFilterChange("state", e.target.value)}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <option value="">All States</option>
            {states.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="city-filter" className="text-sm font-medium">
            City
          </Label>
          <select
            id="city-filter"
            value={currentCity}
            onChange={(e) => handleFilterChange("city", e.target.value)}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <option value="">All Cities</option>
            {cities.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="temple-filter" className="text-sm font-medium">
            Temple
          </Label>
          <select
            id="temple-filter"
            value={currentTemple}
            onChange={(e) => handleFilterChange("temple", e.target.value)}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <option value="">All Temples</option>
            {temples.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {(currentCountry || currentState || currentCity || currentTemple) && (
        <div className="mt-4 flex justify-end">
          <Button variant="outline" onClick={handleClear} className="text-sm">
            Clear Filters
          </Button>
        </div>
      )}
    </div>
  );
}
