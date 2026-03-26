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

export function PersonalInfoSection({
  formData,
  handleInputChange,
  handleSelectChange,
}: Props) {
  return (
    <section>
      <h3 className="text-2xl font-semibold text-white mb-8 border-b border-white/10 pb-4">
        Personal Information / व्यक्तिगत जानकारी
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-8">
        <FormField label="First Name" subLabel="पहला नाम" required>
          <Input
            name="firstName"
            value={formData.firstName}
            onChange={handleInputChange}
            placeholder="John"
            className="h-12 px-5 bg-gray-50 border-gray-200 text-gray-900 focus:ring-[#0a2540]/20 rounded-xl text-2xl transition-colors"
          />
        </FormField>
        <FormField label="Last Name" subLabel="अंतिम नाम" required>
          <Input
            name="lastName"
            value={formData.lastName}
            onChange={handleInputChange}
            placeholder="Doe"
            className="h-12 px-5 bg-gray-50 border-gray-200 text-gray-900 focus:ring-[#0a2540]/20 rounded-xl text-xl transition-colors"
          />
        </FormField>
        <FormField label="Email" subLabel="ईमेल" required>
          <Input
            name="email"
            type="email"
            value={formData.email}
            onChange={handleInputChange}
            placeholder="john@example.com"
            className="h-12 px-5 bg-gray-50 border-gray-200 text-gray-900 focus:ring-[#0a2540]/20 rounded-xl text-xl transition-colors"
          />
        </FormField>
        <FormField label="Phone" subLabel="फ़ोन नंबर" required>
          <Input
            name="phone"
            value={formData.phone}
            onChange={handleInputChange}
            placeholder="+1 234 567 890"
            className="h-12 px-5 bg-gray-50 border-gray-200 text-gray-900 focus:ring-[#0a2540]/20 rounded-xl text-xl transition-colors"
          />
        </FormField>
        <FormField
          label="Gender"
          subLabel="लिंग"
          required
          className="space-y-3 md:col-span-2 lg:col-span-1"
        >
          <Select
            value={formData.gender}
            onValueChange={(val) => handleSelectChange("gender", val as string)}
          >
            <SelectTrigger className="h-12 py-6 px-4 bg-gray-50 border-gray-200 text-gray-900 focus:ring-[#0a2540]/20 rounded-xl text-lg transition-colors">
              <SelectValue placeholder="Select Gender" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="male">Male</SelectItem>
              <SelectItem value="female">Female</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
        </FormField>
      </div>
    </section>
  );
}
