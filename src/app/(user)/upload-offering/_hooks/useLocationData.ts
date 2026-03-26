/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import {
  getCountries,
  getStates,
  getCities,
  getTemples,
} from "@/app/(admin)/actions/offering";
import { OfferingFormData } from "../_components/types";

export function useLocationData(
  formData: OfferingFormData,
  setFormData: React.Dispatch<React.SetStateAction<OfferingFormData>>,
) {
  const [countries, setCountries] = useState<any[]>([]);
  const [states, setStates] = useState<any[]>([]);
  const [cities, setCities] = useState<any[]>([]);
  const [temples, setTemples] = useState<any[]>([]);

  // Initial Data Fetch
  useEffect(() => {
    getCountries().then(setCountries);
  }, []);

  // Fetch States when Country changes
  useEffect(() => {
    if (formData.countryId) {
      getStates(formData.countryId).then(setStates);
      setFormData((prev) => ({
        ...prev,
        stateId: "",
        cityId: "",
        templeId: "",
      }));
      setCities([]);
      setTemples([]);
    }
  }, [formData.countryId, setFormData]);

  // Fetch Cities when State changes
  useEffect(() => {
    if (formData.stateId) {
      getCities(formData.stateId).then(setCities);
      setFormData((prev) => ({ ...prev, cityId: "", templeId: "" }));
      setTemples([]);
    }
  }, [formData.stateId, setFormData]);

  // Fetch Temples when City changes
  useEffect(() => {
    if (formData.cityId) {
      getTemples(formData.cityId).then(setTemples);
      setFormData((prev) => ({ ...prev, templeId: "" }));
    }
  }, [formData.cityId, setFormData]);

  return { countries, states, cities, temples };
}
