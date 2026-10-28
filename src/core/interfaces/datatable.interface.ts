export interface TableHeaders {
  field: string;
  header: string;
  sortable: boolean;
  width?: number | 'auto';
  alignHeaders?: 'start' | 'center' | 'end';
  alignItems?: 'start' | 'center' | 'end';
}
export interface BaseTableProps<T> {
  headers?: TableHeaders[];
  items?: T[];
  loading?: boolean;
  loadingIcon?: string;
  rowHover?: boolean;
}

export interface TableProps<T> extends BaseTableProps<T> {
  paginator?: boolean;
  perPage?: number;
  per_page?: number;
  totalItems?: number;
  total_items?: number;
  page?: number;
  showPerPageOptions?: boolean;
  perPageOptions?: number[];
}

