export interface RouteForm {
  id?: number;
  name: string;
  uri: string;
  description: string;
  order: number;
  icon: string;
  child_route: boolean;
  show: boolean;
  parent?: string;
  title: string;
  active?: boolean;
  permissions_id: number[];
  id_parent?: number;
  required_auth: boolean;
}
