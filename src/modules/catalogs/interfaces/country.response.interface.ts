export interface CountryResponse {
  id: string;
  name: string;
  abbreviation: string;
  code: string;
  iso2: string;
  phone_code: string;
  phone_mask?: string | null;
  active: boolean;
}
