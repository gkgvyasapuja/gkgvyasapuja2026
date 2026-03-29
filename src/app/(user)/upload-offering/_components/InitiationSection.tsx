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
    <section className="bg-white/95 border border-[#dce6f6] rounded-2xl p-5 md:p-6 shadow-sm">
      <h3 className="text-2xl font-semibold text-[#0a2540] mb-2">
        Initiation Details / दीक्षा विवरण
      </h3>
      <p className="text-sm text-[#5a718f] mb-4">
        Choose whether you are initiated. Additional fields appear when
        selected.
      </p>
      <div className="flex items-start gap-3 mb-5">
        <input
          type="checkbox"
          name="initiated"
          id="initiated-checkbox"
          checked={formData.initiated}
          onChange={handleInputChange}
          className="w-5 h-5 rounded border-[#dce6f6] bg-white text-[#0a2540] focus:ring-[#0a2540]/30 cursor-pointer transition-colors"
        />
        <label
          htmlFor="initiated-checkbox"
          className="text-lg font-semibold text-[#0a2540] cursor-pointer select-none"
        >
          Are you initiated? / क्या आप दीक्षित हैं?
        </label>
      </div>

      {formData.initiated && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-8 animate-in slide-in-from-top-4 fade-in duration-500">
          <FormField
            label="Initiated Name"
            subLabel="दीक्षित नाम"
            required
          >
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
              <SelectTrigger className="h-12 w-full py-6 px-4 bg-white border-gray-200 text-gray-900 focus:ring-[#0a2540]/20 rounded-xl text-md transition-colors shadow-sm">
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
