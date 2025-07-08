export interface TableHeaders{
    field: string;
    header: string;
    sortable: boolean;
    width?: number | 'auto';
    alignHeaders?: 'start' | 'center' | 'end';
    alignItems?: 'start' | 'center' | 'end';
}
export interface TableProps<T> {
    headers: TableHeaders[];
    items: T[];
    per_page: number;
    loading?: boolean;
    loadingIcon?: string;
    rowHover?: boolean;
    paginator?: boolean;
    total_pages?: number;
}