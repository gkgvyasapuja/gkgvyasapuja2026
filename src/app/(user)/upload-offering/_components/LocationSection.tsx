import React from "react";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { OfferingFormData, LocationItem } from "./types";
import { FormField } from "./FormField";

interface Props {
  formData: OfferingFormData;
  handleSelectChange: (name: string, value: string) => void;
  countries: LocationItem[];
  states: LocationItem[];
  cities: LocationItem[];
  temples: LocationItem[];
}

export function LocationSection({
  formData,
  handleSelectChange,
  countries,
  states,
  cities,
  temples,
}: Props) {
  return (
    <section>
      <h3 className="text-2xl font-semibold text-black mb-8 border-b border-white/10 pb-4">
        Location Details / स्थान का विवरण
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-8">
        <FormField
          label="Country"
          subLabel="देश"
          required
        >
          <Select
            value={formData.countryId}
            onValueChange={(val) =>
              handleSelectChange("countryId", val as string)
            }
          >
            <SelectTrigger className="h-16 w-full py-6 px-4 bg-gray-50 border-gray-200 text-gray-900 focus:ring-[#0a2540]/20 rounded-xl text-md transition-colors">
              <SelectValue placeholder="Select Country">
                {countries.find((c) => c.id === formData.countryId)?.name ||
                  "Select Country"}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {countries.map((c) => (
                <SelectItem
                  key={c.id}
                  value={c.id}
                  className="text-lg py-3 hover:bg-gray-50 cursor-pointer"
                >
                  {c.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </FormField>

        <FormField
          label="State / Province"
          subLabel="राज्य / प्रान्त"
          required
        >
          <Select
            value={formData.stateId}
            onValueChange={(val) =>
              handleSelectChange("stateId", val as string)
            }
            disabled={!formData.countryId}
          >
            <SelectTrigger className="h-16 w-full py-6 px-4 bg-gray-50 border-gray-200 text-gray-900 focus:ring-[#0a2540]/20 rounded-xl text-md transition-colors disabled:opacity-50 disabled:bg-gray-100">
              <SelectValue placeholder="Select State">
                {states.find((s) => s.id === formData.stateId)?.name ||
                  "Select State"}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {states.map((s) => (
                <SelectItem
                  key={s.id}
                  value={s.id}
                  className="text-lg py-3 hover:bg-gray-50 cursor-pointer"
                >
                  {s.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </FormField>

        <FormField
          label="City"
          subLabel="शहर"
          required
        >
          <Select
            value={formData.cityId}
            onValueChange={(val) => handleSelectChange("cityId", val as string)}
            disabled={!formData.stateId}
          >
            <SelectTrigger className="h-16 w-full py-6 px-4 bg-gray-50 border-gray-200 text-gray-900 focus:ring-[#0a2540]/20 rounded-xl text-md transition-colors disabled:opacity-50 disabled:bg-gray-100">
              <SelectValue placeholder="Select City">
                {cities.find((c) => c.id === formData.cityId)?.name ||
                  "Select City"}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {cities.map((c) => (
                <SelectItem
                  key={c.id}
                  value={c.id}
                  className="text-lg py-3 hover:bg-gray-50 cursor-pointer"
                >
                  {c.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </FormField>

        <FormField
          label="Temple / Center"
          subLabel="मंदिर / केंद्र"
          required
        >
          <Select
            value={formData.templeId}
            onValueChange={(val) =>
              handleSelectChange("templeId", val as string)
            }
            disabled={!formData.cityId}
          >
            <SelectTrigger className="h-16 w-full py-6 px-4 bg-gray-50 border-gray-200 text-gray-900 focus:ring-[#0a2540]/20 rounded-xl text-md transition-colors disabled:opacity-50 disabled:bg-gray-100">
              <SelectValue placeholder="Select Temple">
                {temples.find((t) => t.id === formData.templeId)?.name ||
                  "Select Temple"}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {temples.map((t) => (
                <SelectItem
                  key={t.id}
                  value={t.id}
                  className="text-lg py-3 hover:bg-gray-50 cursor-pointer"
                >
                  {t.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </FormField>
      </div>
    </section>
  );
}
