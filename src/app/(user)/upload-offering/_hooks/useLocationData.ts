/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect, useRef } from "react";
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

  const prevCountryId = useRef<string>("");
  const prevStateId = useRef<string>("");

  // Initial Data Fetch
  useEffect(() => {
    getCountries().then(setCountries);
  }, []);

  // Fetch States when Country changes; only reset child location fields when country actually changes (not on prefill).
  useEffect(() => {
    if (!formData.countryId) {
      prevCountryId.current = "";
      return;
    }
    getStates(formData.countryId).then(setStates);
    const countryChanged =
      prevCountryId.current !== "" &&
      prevCountryId.current !== formData.countryId;
    if (countryChanged) {
      setFormData((prev) => ({
        ...prev,
        stateId: "",
        cityId: "",
        templeId: "",
        otherTempleName: "",
      }));
      queueMicrotask(() => {
        setCities([]);
        setTemples([]);
      });
    }
    prevCountryId.current = formData.countryId;
  }, [formData.countryId, setFormData]);

  // Fetch cities and temples when state changes; only reset city/temple when state actually changes.
  useEffect(() => {
    if (!formData.stateId) {
      prevStateId.current = "";
      return;
    }
    getCities(formData.stateId).then(setCities);
    getTemplesByStateId(formData.stateId).then(setTemples);
    const stateChanged =
      prevStateId.current !== "" && prevStateId.current !== formData.stateId;
    if (stateChanged) {
      setFormData((prev) => ({
        ...prev,
        cityId: "",
        templeId: "",
        otherTempleName: "",
      }));
    }
    prevStateId.current = formData.stateId;
  }, [formData.stateId, setFormData]);

  return { countries, states, cities, temples };
}
