import { paginateParams } from '@/core/services/interfaces/params.paginate.interface';

export interface StorageFileResponse {
  id: string;
  filename: string;
  mime_type: string;
  size: number;
  path: string;
  active: boolean;
  id_provider: string;
  id_user: string | null;
  created_at: string | null;
}

export interface StorageFilesQueryParams extends paginateParams {
  id_provider?: string;
}

export interface UploadStorageFileParams {
  provider_code?: string;
  folder?: string;
}
