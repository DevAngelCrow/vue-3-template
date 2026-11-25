import { computed, reactive, ref, watch } from 'vue';
import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/vue-query';
import { useForm } from 'vee-validate';
import * as yup from 'yup';

import { API_BASE_URL } from '@/core/config/axios';
import { TableHeaders } from '@/core/interfaces';
import { useAlertStore } from '@/core/store';
import { FormatDate } from '@/core/utils/dates';
import { debounce } from '@/core/utils/debounceFunction';
import { createQueryKeys } from '@/core/utils/queryKeys';
import { PrimeVueFile } from '@/types/PrimeVueFile';

import { ProviderStorageResponse } from '../interfaces/storage/provider-storage.interface';
import { StorageFileResponse } from '../interfaces/storage/storage-file.interface';
import adminServices from '../services/admin.services';

export type FilterStorageFilesType = {
  id_provider?: string;
};

export interface StorageFileUploadForm {
  files: PrimeVueFile[];
  provider_code?: string;
  folder?: string;
}

export const storageFilesKeys = createQueryKeys<
  FilterStorageFilesType & { page?: number; per_page?: number }
>('admin-storage-files');

export const storageProvidersCatalogKeys = createQueryKeys(
  'admin-storage-providers-catalog',
);

const ALLOWED_IMAGE_MIMES = [
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp',
];
const MAX_UPLOAD_SIZE_BYTES = 5 * 1024 * 1024;
const SAFE_FOLDER_REGEX = /^[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+)*$/;

export function useStorageFiles() {
  const queryClient = useQueryClient();
  const alert = useAlertStore();

  const { errors, defineField, handleSubmit, resetForm } =
    useForm<StorageFileUploadForm>({
      initialValues: {
        files: [],
        provider_code: undefined,
        folder: '',
      },
      validationSchema: yup.object({
        files: yup
          .array<PrimeVueFile>()
          .min(1, 'Debes seleccionar una imagen para subir')
          .required('Debes seleccionar una imagen para subir')
          .test('fileSize', 'El tamaño máximo permitido es 5 MB', value => {
            if (!value || value.length === 0) return true;
            return value.every(file => file.size <= MAX_UPLOAD_SIZE_BYTES);
          })
          .test(
            'fileType',
            'Solo se permiten imágenes JPEG, PNG, GIF o WEBP',
            value => {
              if (!value || value.length === 0) return true;
              return value.every(file =>
                ALLOWED_IMAGE_MIMES.includes(file.type),
              );
            },
          ),
        provider_code: yup.string().optional(),
        folder: yup
          .string()
          .optional()
          .max(80, 'La carpeta debe tener máximo 80 caracteres')
          .test(
            'safe-folder',
            'Solo se permiten letras, números, _, - y segmentos separados por /',
            value => {
              if (!value || value.trim().length === 0) return true;
              const normalized = value.trim().replace(/^\/+|\/+$/g, '');
              return SAFE_FOLDER_REGEX.test(normalized);
            },
          ),
      }),
    });

  const [files, filesAttrs] = defineField('files');
  const [providerCode, providerCodeAttrs] = defineField('provider_code');
  const [folder, folderAttrs] = defineField('folder');

  const headers = ref<TableHeaders[]>([
    {
      field: 'filename',
      header: 'Archivo',
      sortable: false,
      alignHeaders: 'start',
      alignItems: 'start',
    },
    {
      field: 'mime_type',
      header: 'Tipo MIME',
      sortable: false,
      alignHeaders: 'start',
      alignItems: 'start',
    },
    {
      field: 'size',
      header: 'Tamaño',
      sortable: false,
      alignHeaders: 'end',
      alignItems: 'end',
    },
    {
      field: 'id_provider',
      header: 'Proveedor',
      sortable: false,
      alignHeaders: 'start',
      alignItems: 'start',
    },
    {
      field: 'active',
      header: 'Estado',
      sortable: false,
      alignHeaders: 'center',
      alignItems: 'center',
    },
    {
      field: 'created_at',
      header: 'Fecha',
      sortable: false,
      alignHeaders: 'start',
      alignItems: 'start',
    },
    {
      field: 'acciones',
      header: 'Acciones',
      sortable: false,
      alignHeaders: 'center',
      alignItems: 'center',
    },
  ]);

  const pagination = reactive({
    page: 1,
    per_page: 10,
    total_items: 0,
  });

  const filter = reactive<FilterStorageFilesType>({
    id_provider: undefined,
  });

  const appliedFilter = reactive<FilterStorageFilesType>({
    id_provider: undefined,
  });

  const { data: providersCatalogData } = useQuery({
    queryKey: storageProvidersCatalogKeys.all,
    queryFn: async () => {
      const response = await adminServices.getProviderStorages({
        page: 1,
        per_page: 100,
      });
      if (response.statusCode === 200) {
        return response.data.data;
      }
      return [];
    },
  });

  const providerOptions = computed<ProviderStorageResponse[]>(
    () => providersCatalogData.value ?? [],
  );

  const activeProviderOptions = computed<ProviderStorageResponse[]>(() =>
    providerOptions.value.filter(provider => provider.active),
  );

  const providerNameById = computed(() => {
    const map = new Map<string, string>();
    for (const provider of providerOptions.value) {
      if (provider.id) {
        map.set(provider.id, `${provider.name} (${provider.code})`);
      }
    }
    return map;
  });

  const {
    data: filesQueryResult,
    isPending,
    isFetching,
    refetch: refetchStorageFiles,
  } = useQuery({
    queryKey: computed(() =>
      storageFilesKeys.list({
        page: pagination.page,
        per_page: pagination.per_page,
        id_provider: appliedFilter.id_provider || undefined,
      }),
    ),
    queryFn: async () => {
      const response = await adminServices.getStorageFiles({
        page: pagination.page,
        per_page: pagination.per_page,
        id_provider: appliedFilter.id_provider || undefined,
      });
      if (response.statusCode === 200) {
        return response.data;
      }
      return null;
    },
    placeholderData: keepPreviousData,
  });

  watch(
    () => filesQueryResult.value,
    newData => {
      if (newData) {
        pagination.total_items = newData.total_items ?? 0;
      }
    },
    { immediate: true },
  );

  const storageFiles = computed<StorageFileResponse[]>(
    () => filesQueryResult.value?.data ?? [],
  );

  const uploadMutation = useMutation({
    mutationFn: async (form: StorageFileUploadForm) => {
      const selectedFile = form.files?.[0];
      if (!selectedFile) {
        throw new Error('File is required');
      }
      return adminServices.uploadStorageFile(selectedFile, {
        provider_code: form.provider_code || undefined,
        folder: form.folder?.trim() || undefined,
      });
    },
    onSuccess: response => {
      queryClient.invalidateQueries({ queryKey: storageFilesKeys.all });
      alert.showAlert({
        type: 'success',
        title: response.data?.message || 'Archivo subido exitosamente',
        show: true,
      });
    },
  });

  const findStorageFiles = () => {
    pagination.page = 1;
    appliedFilter.id_provider = filter.id_provider || undefined;
  };

  const cleanSearch = () => {
    filter.id_provider = undefined;
    appliedFilter.id_provider = undefined;
    pagination.page = 1;
  };

  const debouncedFindStorageFiles = debounce(findStorageFiles, 400);
  const debouncedCleanSearch = debounce(cleanSearch, 400);

  const formatFileSize = (bytes: number): string => {
    if (!Number.isFinite(bytes) || bytes <= 0) return '0 B';
    const units = ['B', 'KB', 'MB', 'GB'];
    const exponent = Math.min(
      Math.floor(Math.log(bytes) / Math.log(1024)),
      units.length - 1,
    );
    const value = bytes / Math.pow(1024, exponent);
    return `${value.toFixed(exponent === 0 ? 0 : 2)} ${units[exponent]}`;
  };

  const formatFileDate = (value: string | null | undefined): string =>
    FormatDate(value, 'DD/MM/YYYY HH:mm:ss') ?? '—';

  const resolveFileUrl = (path: string): string => {
    if (!path) return '';
    if (/^https?:\/\//i.test(path)) return path;
    const apiOrigin = API_BASE_URL.replace(/\/api\/v1\/?$/, '');
    const normalizedPath = path.startsWith('/') ? path : `/${path}`;
    return `${apiOrigin}${normalizedPath}`;
  };

  return {
    files,
    filesAttrs,
    providerCode,
    providerCodeAttrs,
    folder,
    folderAttrs,
    errors,
    handleSubmit,
    resetForm,
    headers,
    pagination,
    filter,
    storageFiles,
    providerOptions,
    activeProviderOptions,
    providerNameById,
    isPending,
    isFetching,
    refetchStorageFiles,
    uploadMutation,
    debouncedFindStorageFiles,
    debouncedCleanSearch,
    formatFileSize,
    formatFileDate,
    resolveFileUrl,
    maxUploadSizeBytes: MAX_UPLOAD_SIZE_BYTES,
  };
}
