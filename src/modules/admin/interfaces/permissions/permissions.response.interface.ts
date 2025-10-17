import { PermissionsCategory } from './permission.category.interface';

export interface PermissionsResponse {
  id: number;
  name: string;
  description: string;
  active: boolean;
  permissions_category: PermissionsCategory;
}
