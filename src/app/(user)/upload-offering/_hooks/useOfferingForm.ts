import { useState } from "react";
import { OfferingFormData } from "../_components/types";

export function useOfferingForm() {
  const [formData, setFormData] = useState<OfferingFormData>({
    firstName: "",
    lastName: "",
    gender: "",
    email: "",
    phone: "",
    initiated: true,
    initiatedName: "",
    initiationType: "",
    initiationYear: "",
    countryId: "",
    stateId: "",
    cityId: "",
    templeId: "",
    otherTempleName: "",
    language: "English",
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const t = e.target;
    const { name } = t;
    const type = (t as unknown as { type?: string }).type;
    const isCheckbox = type === "checkbox";

    const value = (t as HTMLInputElement).value;
    const checked = (t as unknown as { checked?: boolean }).checked ?? false;
    setFormData((prev) => ({
      ...prev,
      [name]: isCheckbox ? checked : value,
    }));
  };

  const handleSelectChange = (name: string, value: string | null) => {
    setFormData((prev) => {
      const next = { ...prev, [name]: value || "" };
      // Clear the free-text temple name whenever the user picks an actual temple (not "Other").
      if (name === "templeId" && value !== "0") {
        next.otherTempleName = "";
      }
      return next;
    });
  };

  return { formData, setFormData, handleInputChange, handleSelectChange };
}
