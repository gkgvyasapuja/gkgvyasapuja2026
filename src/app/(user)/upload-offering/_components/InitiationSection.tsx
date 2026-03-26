import React from "react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { OfferingFormData } from "./types";
import { FormField } from "./FormField";

interface Props {
  formData: OfferingFormData;
  handleInputChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => void;
  handleSelectChange: (name: string, value: string) => void;
}

export function InitiationSection({
  formData,
  handleInputChange,
  handleSelectChange,
}: Props) {
  return (
    <section className="bg-white/5 -mx-8 md:-mx-14 px-8 md:px-14 py-10 border-y border-white/10">
      <div className="flex items-center gap-4 mb-8">
        <input
          type="checkbox"
          name="initiated"
          id="initiated-checkbox"
          checked={formData.initiated}
          onChange={handleInputChange}
          className="w-4 h-4 rounded border-white/20 bg-white/5 text-[#0a2540] focus:ring-white/20 cursor-pointer transition-colors"
        />
        <label
          htmlFor="initiated-checkbox"
          className="text-2xl font-semibold text-white cursor-pointer select-none"
        >
          Are you initiated? / क्या आप दीक्षित हैं?
        </label>
      </div>

      {formData.initiated && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-8 animate-in slide-in-from-top-4 fade-in duration-500">
          <FormField label="Initiated Name" subLabel="दीक्षित नाम" required>
            <Input
              name="initiatedName"
              value={formData.initiatedName}
              onChange={handleInputChange}
              placeholder="Das/Dasi"
              className="h-12 bg-white border-gray-200 text-gray-900 focus:ring-[#0a2540]/20 rounded-xl text-xl transition-colors shadow-sm"
            />
          </FormField>
          <FormField
            label="Initiation Type"
            subLabel="दीक्षा का प्रकार"
            required
          >
            <Select
              value={formData.initiationType}
              onValueChange={(val) =>
                handleSelectChange("initiationType", val as string)
              }
            >
              <SelectTrigger className="h-12 py-6 px-4 bg-white border-gray-200 text-gray-900 focus:ring-[#0a2540]/20 rounded-xl text-xl transition-colors shadow-sm">
                <SelectValue placeholder="Select Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem
                  value="Harinam"
                  className="text-lg p-3 hover:bg-gray-50 cursor-pointer"
                >
                  Harinam
                </SelectItem>
                <SelectItem
                  value="Brahman"
                  className="text-lg p-3 hover:bg-gray-50 cursor-pointer"
                >
                  Brahman
                </SelectItem>
                <SelectItem
                  value="Sannyas"
                  className="text-lg p-3 hover:bg-gray-50 cursor-pointer"
                >
                  Sannyas
                </SelectItem>
              </SelectContent>
            </Select>
          </FormField>
          <FormField
            label="Year of Initiation"
            subLabel="दीक्षा का वर्ष"
            required
          >
            <Input
              name="initiationYear"
              value={formData.initiationYear}
              onChange={handleInputChange}
              placeholder="YYYY"
              className="h-12 bg-white border-gray-200 text-gray-900 focus:ring-[#0a2540]/20 rounded-xl text-xl transition-colors shadow-sm"
            />
          </FormField>
        </div>
      )}
    </section>
  );
}
