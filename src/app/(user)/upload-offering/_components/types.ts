/* eslint-disable @typescript-eslint/no-explicit-any */
export interface OfferingFormData {
  firstName: string;
  lastName: string;
  gender: string;
  email: string;
  phone: string;
  initiated: boolean;
  initiatedName: string;
  initiationType: string;
  initiationYear: string;
  countryId: string;
  stateId: string;
  cityId: string;
  /** A real temple UUID, or the sentinel "0" when the devotee chose "Other". */
  templeId: string;
  /** Free-text temple name supplied when `templeId === "0"`. */
  otherTempleName: string;
  language: string;
}

export interface LocationItem {
  id: string;
  name: string;
  [key: string]: any;
}
