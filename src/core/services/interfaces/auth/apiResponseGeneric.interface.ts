import { Pagination } from './pagination.interface';

export interface ApiResponseGeneric<T> {
  data: {
    items: T[];
    pagination: Pagination;
  };
  message: string;
  statusCode: number;
}
