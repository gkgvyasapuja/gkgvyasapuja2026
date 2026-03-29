/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import {
  getCountries,
  getStates,
  getCities,
  getTemplesByStateId,
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

  // Fetch cities and temples when state changes (cities filtered by state; temples same state)
  useEffect(() => {
    if (formData.stateId) {
      setTemples([]);
      getCities(formData.stateId).then(setCities);
      getTemplesByStateId(formData.stateId).then(setTemples);
      setFormData((prev) => ({ ...prev, cityId: "", templeId: "" }));
    }
  }, [formData.stateId, setFormData]);

  return { countries, states, cities, temples };
}
