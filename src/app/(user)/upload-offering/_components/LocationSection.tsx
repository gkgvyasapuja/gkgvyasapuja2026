import React from "react";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { OfferingFormData, LocationItem } from "./types";
import { FormField } from "./FormField";

interface Props {
  formData: OfferingFormData;
  handleInputChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => void;
  handleSelectChange: (name: string, value: string) => void;
  countries: LocationItem[];
  states: LocationItem[];
  cities: LocationItem[];
  temples: LocationItem[];
}

export function LocationSection({
  formData,
  handleInputChange,
  handleSelectChange,
  countries,
  states,
  cities,
  temples,
}: Props) {
  const isOtherTemple = formData.templeId === "0";

  return (
    <section>
      <div className="flex items-center gap-2 mb-6">
        <span className="text-amber-500">•</span>
        <h3 className="text-xs font-extrabold tracking-[0.22em] text-slate-500 uppercase">
          Location Details
        </h3>
      </div>
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
            <SelectTrigger className="h-11 w-full px-5 bg-slate-50 border border-slate-200 text-slate-700 focus:ring-2 focus:ring-amber-400/20 rounded-xl text-[15px] transition-all">
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
                  className="text-sm py-3 hover:bg-gray-50 cursor-pointer"
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
            <SelectTrigger className="h-11 w-full px-5 bg-slate-50 border border-slate-200 text-slate-700 focus:ring-2 focus:ring-amber-400/20 rounded-xl text-[15px] transition-all">
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
                  className="text-sm py-3 hover:bg-gray-50 cursor-pointer"
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
            <SelectTrigger className="h-11 w-full px-5 bg-slate-50 border border-slate-200 text-slate-700 focus:ring-2 focus:ring-amber-400/20 rounded-xl text-[15px] transition-all">
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
                  className="text-sm py-3 hover:bg-gray-50 cursor-pointer"
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
            disabled={!formData.stateId}
          >
            <SelectTrigger className="h-11 w-full px-5 bg-slate-50 border border-slate-200 text-slate-700 focus:ring-2 focus:ring-amber-400/20 rounded-xl text-[15px] transition-all">
              <SelectValue placeholder="Select Temple">
                {temples.find((t) => t.id === formData.templeId)?.name ||
                  (formData.templeId === "0" && "Other") ||
                  "Select Temple"}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {temples.map((t) => (
                <SelectItem
                  key={t.id}
                  value={t.id}
                  className="text-sm py-3 hover:bg-gray-50 cursor-pointer"
                >
                  {t.name}
                </SelectItem>
              ))}
              <SelectItem
                className="text-sm py-3 hover:bg-gray-50 cursor-pointer"
                value="0"
              >
                Other
              </SelectItem>
            </SelectContent>
          </Select>
        </FormField>

        {isOtherTemple && (
          <FormField
            label="Temple / Center Name"
            subLabel="मंदिर / केंद्र का नाम"
            required
            className="space-y-3 md:col-span-2"
          >
            <Input
              name="otherTempleName"
              value={formData.otherTempleName}
              onChange={handleInputChange}
              placeholder="Enter the temple or center name"
              maxLength={255}
              className="h-11 px-5 bg-slate-50 border border-slate-200 text-slate-700 placeholder:text-slate-400 focus-visible:ring-2 focus-visible:ring-amber-400/20 rounded-xl text-[15px] transition-all"
            />
            <p className="text-xs text-slate-500">
              We&apos;ll send this to our team for review. Once approved, your
              profile will be linked to the new temple automatically.
            </p>
          </FormField>
        )}
      </div>
    </section>
  );
}
