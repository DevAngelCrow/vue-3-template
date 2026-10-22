import type { NavigationItem } from './navigation.interface';

export interface MenuBar extends NavigationItem {
  isUser?: boolean;
  is_open?: boolean;
}

export interface SubMenu {
  label: string;
  icon?: string;
  items?: SubMenu[];
  url: string;
}
