export interface CreateCountry {
  name: string;
  abbreviation: string;
  code: string;
  iso2: string;
  phone_code: string;
  phone_mask?: string;
  active: boolean;
}
