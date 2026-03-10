export interface RoleForm {
  id?: number;
  name: string;
  description: string;
  id_status: number;
  code: string;
  permissions_id: number[];
}
