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
  templeId: string;
  language: string;
}

export interface LocationItem {
  id: string;
  name: string;
  [key: string]: any;
}
