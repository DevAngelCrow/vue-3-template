export interface RouteResponseById {
  id: number;
  name: string;
  description: string;
  active: boolean;
  show: boolean;
  id_parent: number;
  icon: string;
  uri: string;
  order: number;
  title: string;
  parent_route: [] | null;
  permissions: {
    id: number;
    name: string;
    description: string;
    active: boolean;
    //category: number;
  }[];
}
