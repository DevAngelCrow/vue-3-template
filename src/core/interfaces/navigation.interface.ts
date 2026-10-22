export interface NavigationItem {
  id: string;
  label: string;
  title?: string;
  icon?: string;
  uri?: string;
  to?: string;
  name?: string;
  description?: string;
  show?: boolean;
  order?: number;
  active?: boolean;
  required_auth?: boolean;
  parent?: NavigationItem[] | null;
  children?: NavigationItem[];
  items?: NavigationItem[];
  command?: (event?: unknown) => void;
  separator?: boolean;
}
