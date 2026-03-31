/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

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
    <section className="py-2">
      <div className="flex items-center gap-2 mb-4">
        <span className="text-amber-400">•</span>
        <h3 className="text-xs font-semibold tracking-[0.18em] text-slate-400 uppercase">
          Spiritual Status
        </h3>
      </div>

      <div className="space-y-4">
        <p className="text-sm font-bold mb-0 text-slate-800">
          Are you initiated?
        </p>
        <p className="text-xs text-slate-500">क्या आप दीक्षित हैं?</p>

        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() =>
              handleInputChange({
                target: { name: "initiated", type: "checkbox", checked: true },
              } as any)
            }
            className={`h-11 rounded-xl border text-[14px] font-medium transition-all ${
              formData.initiated
                ? "bg-white border-amber-400/60 text-slate-800 shadow-sm"
                : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
            }`}
          >
            Yes
          </button>

          <button
            type="button"
            onClick={() =>
              handleInputChange({
                target: {
                  name: "initiated",
                  type: "checkbox",
                  checked: false,
                },
              } as any)
            }
            className={`h-11 rounded-xl border text-[14px] font-medium transition-all ${
              !formData.initiated
                ? "bg-white border-amber-400/60 text-slate-800 shadow-sm"
                : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
            }`}
          >
            Not
          </button>
        </div>
      </div>

      {formData.initiated && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6 animate-in slide-in-from-top-4 fade-in duration-500">
          <FormField
            label="Initiated Name"
            subLabel="दीक्षित नाम"
            required
          >
            <Input
              name="initiatedName"
              value={formData.initiatedName}
              onChange={handleInputChange}
              placeholder="Your initiated name"
              className="h-11 px-5 bg-slate-50 border border-slate-200 text-slate-700 placeholder:text-slate-400 rounded-xl text-[15px] focus-visible:ring-amber-400/20"
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
                handleSelectChange("initiationType", val!)
              }
            >
              <SelectTrigger className="h-11 w-full px-5 bg-slate-50 border border-slate-200 text-slate-700 focus:ring-2 focus:ring-amber-400/20 rounded-xl text-[15px] transition-all">
                <SelectValue placeholder="Select type" />
              </SelectTrigger>

              <SelectContent>
                {["Harinam", "Brahman", "Sannyas"].map((item) => (
                  <SelectItem
                    key={item}
                    value={item}
                    className="text-[14px] text-slate-600 p-2.5 hover:bg-slate-50"
                  >
                    {item}
                  </SelectItem>
                ))}
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
              placeholder="e.g. 2015"
              type="number"
              className="h-11 px-5 bg-slate-50 border border-slate-200 text-slate-700 placeholder:text-slate-400 rounded-xl text-[15px] focus-visible:ring-amber-400/20"
            />
          </FormField>
        </div>
      )}
    </section>
  );
}
