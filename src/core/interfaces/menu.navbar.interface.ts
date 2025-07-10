export interface Menu {
    label: string;
    icon?: string;
    items?: SubMenu[]
    isUser?: boolean;
}

export interface SubMenu {
    label: string;
    icon?: string;
    items?: SubMenu[];
}


