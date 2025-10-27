import { RoleStatus } from './role.status.response.interface';

export interface RoleResponse {
  id: number;
  name: string;
  description: string;
  status: RoleStatus;
  active: boolean;
  permissionsId: number[];
}
