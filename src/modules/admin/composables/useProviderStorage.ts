import { computed, reactive, ref, watch } from 'vue';
import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/vue-query';
import { useForm } from 'vee-validate';
import * as yup from 'yup';

import { TableHeaders } from '@/core/interfaces';
import { useAlertStore } from '@/core/store';
import { debounce } from '@/core/utils/debounceFunction';
import { createQueryKeys } from '@/core/utils/queryKeys';

import {
  ProviderStorageForm,
  ProviderStorageResponse,
} from '../interfaces/storage/provider-storage.interface';
import adminServices from '../services/admin.services';

export type FilterProviderStorageType = {
  filter?: string;
};

export const providerStorageKeys = createQueryKeys<
  FilterProviderStorageType & { page?: number; per_page?: number }
>('admin-provider-storages');

export function useProviderStorage() {
  const queryClient = useQueryClient();
  const alert = useAlertStore();

  const { errors, defineField, handleSubmit, resetForm, setValues } =
    useForm<ProviderStorageForm>({
      initialValues: {
        id: undefined,
        name: '',
        code: '',
        description: '',
        active: true,
      },
      validationSchema: yup.object({
        id: yup.string().optional(),
        name: yup
          .string()
          .required('El nombre es requerido')
          .max(150, 'El nombre debe tener como máximo 150 caracteres'),
        code: yup
          .string()
          .required('El código es requerido')
          .max(6, 'El código debe tener como máximo 6 caracteres'),
        description: yup
          .string()
          .required('La descripción es requerida')
          .max(150, 'La descripción debe tener como máximo 150 caracteres'),
        active: yup.boolean().default(true),
      }),
    });

  const [id, idAttrs] = defineField('id');
  const [name, nameAttrs] = defineField('name');
  const [code, codeAttrs] = defineField('code');
  const [description, descriptionAttrs] = defineField('description');
  const [active, activeAttrs] = defineField('active');

  const headers = ref<TableHeaders[]>([
    {
      field: 'code',
      header: 'Código',
      sortable: false,
      alignHeaders: 'start',
      alignItems: 'start',
    },
    {
      field: 'name',
      header: 'Nombre',
      sortable: false,
      alignHeaders: 'start',
      alignItems: 'start',
    },
    {
      field: 'description',
      header: 'Descripción',
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

  const filter = reactive<FilterProviderStorageType>({
    filter: undefined,
  });

  const appliedFilter = reactive<FilterProviderStorageType>({
    filter: undefined,
  });

  const {
    data: providersQueryResult,
    isPending,
    isFetching,
    refetch: refetchProviders,
  } = useQuery({
    queryKey: computed(() =>
      providerStorageKeys.list({
        page: pagination.page,
        per_page: pagination.per_page,
        filter: appliedFilter.filter || undefined,
      }),
    ),
    queryFn: async () => {
      const response = await adminServices.getProviderStorages({
        page: pagination.page,
        per_page: pagination.per_page,
        filter: appliedFilter.filter?.trim() || undefined,
      });
      if (response.statusCode === 200) {
        return response.data;
      }
      return null;
    },
    placeholderData: keepPreviousData,
  });

  watch(
    () => providersQueryResult.value,
    newData => {
      if (newData) {
        pagination.total_items = newData.total_items ?? 0;
      }
    },
    { immediate: true },
  );

  const providers = computed<ProviderStorageResponse[]>(
    () => providersQueryResult.value?.data ?? [],
  );

  const addMutation = useMutation({
    mutationFn: async (form: ProviderStorageForm) => {
      return adminServices.postProviderStorage({
        name: form.name,
        code: form.code,
        description: form.description,
        active: form.active ?? true,
      });
    },
    onSuccess: response => {
      queryClient.invalidateQueries({ queryKey: providerStorageKeys.all });
      alert.showAlert({
        type: 'success',
        title: response.data?.message || 'Proveedor creado con éxito',
        show: true,
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (form: ProviderStorageForm) => {
      if (!form.id) {
        throw new Error('Provider ID is required for update');
      }
      return adminServices.putProviderStorage(form.id, {
        name: form.name,
        code: form.code,
        description: form.description,
        active: form.active ?? true,
      });
    },
    onSuccess: response => {
      queryClient.invalidateQueries({ queryKey: providerStorageKeys.all });
      alert.showAlert({
        type: 'success',
        title: response.data?.message || 'Proveedor actualizado con éxito',
        show: true,
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (providerId: string) =>
      adminServices.deleteProviderStorage(providerId),
    onSuccess: response => {
      queryClient.invalidateQueries({ queryKey: providerStorageKeys.all });
      alert.showAlert({
        type: 'success',
        title: response.data?.message || 'Proveedor eliminado con éxito',
        show: true,
      });
    },
  });

  const setProviderStorageItem = (item: ProviderStorageResponse) => {
    setValues({
      id: item.id,
      name: item.name,
      code: item.code,
      description: item.description,
      active: item.active,
    });
  };

  const findProviderStorage = () => {
    pagination.page = 1;
    appliedFilter.filter = filter.filter?.trim() || undefined;
  };

  const cleanSearch = () => {
    filter.filter = undefined;
    appliedFilter.filter = undefined;
    pagination.page = 1;
  };

  const debouncedFindProviderStorage = debounce(findProviderStorage, 500);
  const debouncedCleanSearch = debounce(cleanSearch, 500);

  return {
    id,
    idAttrs,
    name,
    nameAttrs,
    code,
    codeAttrs,
    description,
    descriptionAttrs,
    active,
    activeAttrs,
    errors,
    handleSubmit,
    resetForm,
    setProviderStorageItem,
    headers,
    pagination,
    filter,
    providers,
    isPending,
    isFetching,
    refetchProviders,
    addMutation,
    updateMutation,
    deleteMutation,
    debouncedFindProviderStorage,
    debouncedCleanSearch,
  };
}
