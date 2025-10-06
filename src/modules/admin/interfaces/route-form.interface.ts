export interface RouteForm {
  name: string;
  uri: string;
  description: string;
  order: number;
  icon: string;
  child_route: boolean;
  show: boolean;
  parent_route?: string;
  title: string;
}
