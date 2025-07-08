export interface TableItems<T>{
    items: T
}

export interface TableHeaders{
    field: string;
    key: string;
    sortable: boolean
}

export interface TablePerPage{
    per_page: number
}

export interface TableProps<T> {
    headers: TableHeaders[];
    items: TableItems<T>[];
    per_page: TablePerPage
}