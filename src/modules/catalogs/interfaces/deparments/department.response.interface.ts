import { Country } from './deparment.country.interface';

export interface DepartmentResponse {
  id: number;
  name: string;
  description: string;
  active: string;
  country: Country;
}
