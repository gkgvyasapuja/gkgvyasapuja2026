import { useState } from "react";
import { OfferingFormData } from "../_components/types";

export function useOfferingForm() {
  const [formData, setFormData] = useState<OfferingFormData>({
    firstName: "",
    lastName: "",
    gender: "",
    email: "",
    phone: "",
    initiated: false,
    initiatedName: "",
    initiationType: "",
    initiationYear: "",
    countryId: "",
    stateId: "",
    cityId: "",
    templeId: "",
    language: "English",
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value, type } = e.target;
    const checked = e.target.checked;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSelectChange = (name: string, value: string | null) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value || "",
    }));
  };

  return { formData, setFormData, handleInputChange, handleSelectChange };
}
