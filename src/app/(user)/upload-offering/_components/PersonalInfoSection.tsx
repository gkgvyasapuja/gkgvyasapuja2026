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
    <section className="bg-white/95 border border-[#dce6f6] rounded-2xl p-5 md:p-6 shadow-sm">
      <h3 className="text-2xl font-semibold text-[#0a2540] mb-4">
        Personal Information / व्यक्तिगत जानकारी
      </h3>
      <p className="text-sm text-[#5a718f] mb-6">
        Add your basic details to identify your offering request.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
        <FormField
          label="First Name"
          subLabel="पहला नाम"
          required
        >
          <Input
            name="firstName"
            value={formData.firstName}
            onChange={handleInputChange}
            placeholder="John"
            className="h-12 px-5 bg-gray-50 border-gray-200 text-gray-900 focus:ring-[#0a2540]/20 rounded-xl text-2xl transition-colors"
          />
        </FormField>
        <FormField
          label="Last Name"
          subLabel="अंतिम नाम"
          required
        >
          <Input
            name="lastName"
            value={formData.lastName}
            onChange={handleInputChange}
            placeholder="Doe"
            className="h-12 px-5 bg-gray-50 border-gray-200 text-gray-900 focus:ring-[#0a2540]/20 rounded-xl text-xl transition-colors"
          />
        </FormField>
        <FormField
          label="Email"
          subLabel="ईमेल"
          required
        >
          <Input
            name="email"
            type="email"
            value={formData.email}
            onChange={handleInputChange}
            placeholder="john@example.com"
            className="h-12 px-5 bg-gray-50 border-gray-200 text-gray-900 focus:ring-[#0a2540]/20 rounded-xl text-xl transition-colors"
          />
        </FormField>
        <FormField
          label="Phone"
          subLabel="फ़ोन नंबर"
          required
        >
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
            <SelectTrigger className="h-12 w-full py-6 px-4 bg-gray-50 border-gray-200 text-gray-900 focus:ring-[#0a2540]/20 rounded-xl text-md transition-colors">
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
