import { paginateParams } from '@/core/services/interfaces/params.paginate.interface';

export interface ProviderStorageResponse {
  id?: string;
  name: string;
  code: string;
  description: string;
  active: boolean;
}

export interface ProviderStorageForm {
  id?: string;
  name: string;
  code: string;
  description: string;
  active?: boolean;
}

export interface ProviderStorageQueryParams extends paginateParams {
  filter?: string;
}
