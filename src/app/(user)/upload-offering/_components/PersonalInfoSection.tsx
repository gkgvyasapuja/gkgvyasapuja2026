"use client";

import React from "react";
import { Loader2 } from "lucide-react";
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
  onEmailChange?: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => void;
  onEmailBlur?: () => void;
  isCheckingEmail?: boolean;
}

export function PersonalInfoSection({
  formData,
  handleInputChange,
  handleSelectChange,
  onEmailChange,
  onEmailBlur,
  isCheckingEmail,
}: Props) {
  return (
    <section>
      {/* Section Heading */}
      <div className="flex items-center gap-2 mb-5">
        <span className="text-amber-400">•</span>
        <h3 className="text-xs font-semibold tracking-[0.18em] text-slate-400 uppercase">
          Core Details
        </h3>
      </div>

      {/* Form Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-6">
        <FormField label="First Name" subLabel="पहला नाम" required>
          <Input
            name="firstName"
            value={formData.firstName}
            onChange={handleInputChange}
            placeholder="Your first name"
            className="h-11 px-5 bg-slate-50 border border-slate-200 text-slate-700 placeholder:text-slate-400 focus-visible:ring-2 focus-visible:ring-amber-400/20 rounded-xl text-[15px] transition-all"
          />
        </FormField>

        <FormField label="Last Name" subLabel="अंतिम नाम" required>
          <Input
            name="lastName"
            value={formData.lastName}
            onChange={handleInputChange}
            placeholder="Your last name"
            className="h-11 px-5 bg-slate-50 border border-slate-200 text-slate-700 placeholder:text-slate-400 focus-visible:ring-2 focus-visible:ring-amber-400/20 rounded-xl text-[15px] transition-all"
          />
        </FormField>

        <FormField label="Email" subLabel="ईमेल" required>
          <div className="relative">
            <Input
              name="email"
              type="email"
              value={formData.email}
              onChange={onEmailChange ?? handleInputChange}
              onBlur={onEmailBlur}
              placeholder="yourname@example.com"
              disabled={isCheckingEmail}
              className="h-11 px-5 bg-slate-50 border border-slate-200 text-slate-700 placeholder:text-slate-400 focus-visible:ring-2 focus-visible:ring-amber-400/20 rounded-xl text-[15px] transition-all pr-10 disabled:opacity-70"
            />
            {isCheckingEmail && (
              <Loader2
                className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 animate-spin text-slate-400"
                aria-hidden
              />
            )}
          </div>
        </FormField>

        <FormField label="Phone" subLabel="फ़ोन नंबर" required>
          <Input
            name="phone"
            value={formData.phone}
            type="number"
            onChange={handleInputChange}
            placeholder="Enter your contact number"
            className="h-11 px-5 bg-slate-50 border border-slate-200 text-slate-700 placeholder:text-slate-400 focus-visible:ring-2 focus-visible:ring-amber-400/20 rounded-xl text-[15px] transition-all"
          />
        </FormField>

        <FormField
          label="Gender"
          subLabel="लिंग"
          required
          className="space-y-2 md:col-span-2 lg:col-span-1"
        >
          <Select
            value={formData.gender}
            onValueChange={(val) => handleSelectChange("gender", val!)}
          >
            <SelectTrigger className="h-11 w-full px-5 bg-slate-50 border border-slate-200 text-slate-700 focus:ring-2 focus:ring-amber-400/20 rounded-xl text-[15px] transition-all">
              <SelectValue placeholder="Select gender" />
            </SelectTrigger>

            <SelectContent>
              <SelectItem
                className="text-[14px] text-slate-600 p-2.5 hover:bg-slate-50"
                value="male"
              >
                Male
              </SelectItem>
              <SelectItem
                className="text-[14px] text-slate-600 p-2.5 hover:bg-slate-50"
                value="female"
              >
                Female
              </SelectItem>
              <SelectItem
                className="text-[14px] text-slate-600 p-2.5 hover:bg-slate-50"
                value="other"
              >
                Other
              </SelectItem>
            </SelectContent>
          </Select>
        </FormField>
      </div>
    </section>
  );
}