import { Municipality } from './districts.municipality.interface';

export interface DistrictResponse {
  id: number;
  name: string;
  description: string;
  active: string;
  municipality: Municipality;
}
