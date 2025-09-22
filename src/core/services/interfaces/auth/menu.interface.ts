export interface Menu {
  menu: MenuItem;
}

interface MenuItem {
  id: number;
  name: string;
  description: string;
  icon: string;
  uri: string;
  show: boolean;
  order: number;
  parent: MenuItem;
}
