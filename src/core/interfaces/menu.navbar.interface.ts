export interface MenuNavBar {
  label: string;
  icon?: string;
  items?: SubMenu[];
  isUser?: boolean;
  url: string;
}

export interface SubMenu {
  label: string;
  icon?: string;
  items?: SubMenu[];
  url: string;
}
