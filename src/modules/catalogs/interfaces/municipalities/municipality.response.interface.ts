import { Department } from './municipality.department.interface';

export interface MunicipalityResponse {
  id: number;
  name: string;
  description: string;
  active: string;
  department: Department;
}
