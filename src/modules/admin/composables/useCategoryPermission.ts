import { computed, nextTick, reactive, ref, watch } from 'vue';
import { useForm } from 'vee-validate';
import * as yup from 'yup';
import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/vue-query';

import { TableHeaders } from '@/core/interfaces';
import { useAlertStore } from '@/core/store';
import { sanitizedValueInput } from '@/core/utils/inputTextValidations';
import { createQueryKeys } from '@/core/utils/queryKeys';

import adminServices from '../services/admin.services';
import { CategoryPermissionsResponse } from '../interfaces/category-permissions/category-permissions-response.interface';
import { CategoryPermissionForm } from '../interfaces/category-permissions/category-permission-form.interface';

export type FilterCategoryPermissionType = {
  filter_name?: string;
  status?: boolean | 'Todos';
};

export const categoryPermissionKeys = createQueryKeys<
  FilterCategoryPermissionType & { page?: number; per_page?: number }
>('admin-category-permissions');

export function useCategoryPermission() {
  const queryClient = useQueryClient();
  const alert = useAlertStore();

  const {
    errors,
    defineField,
    handleSubmit,
    validateField,
    resetForm,
    resetField,
    setFieldError,
    setFieldValue,
  } = useForm({
    validationSchema: yup.object({
      id: yup.string().typeError('El campo id debe ser de tipo string'),
      name: yup
        .string()
        .required('El nombre de la categoría es requerido')
        .min(3, 'El nombre debe tener al menos 3 caracteres')
        .max(255, 'El nombre debe tener como máximo 255 caracteres'),
      description: yup
        .string()
        .min(5, 'La descripción debe tener al menos 5 caracteres')
        .max(255, 'La descripción debe tener como máximo 255 caracteres')
        .nullable(),
      active: yup.boolean(),
    }),
  });

  const headers = ref<TableHeaders[]>([
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

  const [id, idAttrs] = defineField('id');
  const [name, nameAttrs] = defineField('name');
  const [description, descriptionAttrs] = defineField('description');
  const [active, activeAttrs] = defineField('active');

  const filter = reactive<FilterCategoryPermissionType>({
    filter_name: undefined,
    status: undefined,
  });

  const appliedFilter = reactive<FilterCategoryPermissionType>({
    filter_name: undefined,
    status: undefined,
  });

  const findRegex = /[^a-zA-ZáÁéÉíÍóÓúÚñÑ.0-9- ]/g;

  // Query paginada de categorías de permisos
  const {
    data: categoriesQueryResult,
    isPending,
    isFetching,
    refetch: refetchCategories,
  } = useQuery({
    queryKey: computed(() =>
      categoryPermissionKeys.list({
        page: pagination.page,
        per_page: pagination.per_page,
        filter_name: appliedFilter.filter_name || undefined,
        status:
          appliedFilter.status === 'Todos' ? undefined : appliedFilter.status,
      }),
    ),
    queryFn: async () => {
      const params = {
        page: pagination.page,
        per_page: pagination.per_page,
        name: appliedFilter.filter_name || undefined,
        active:
          appliedFilter.status === 'Todos' ? undefined : appliedFilter.status,
      };
      const response = await adminServices.getCategoryPermissions(params);
      if (response.statusCode === 200) {
        return response.data;
      }
      return null;
    },
    placeholderData: keepPreviousData,
  });

  watch(
    () => categoriesQueryResult.value,
    newData => {
      if (newData) {
        pagination.total_items = newData.total_items ?? 0;
      }
    },
    { immediate: true },
  );

  const categories = computed<CategoryPermissionsResponse[]>(
    () => categoriesQueryResult.value?.data ?? [],
  );

  // Mutaciones TanStack Query
  const addMutation = useMutation({
    mutationFn: (form: CategoryPermissionForm) =>
      adminServices.postCategoryPermission({
        ...form,
        active: true,
      }),
    onSuccess: response => {
      if (response.status === 201) {
        queryClient.invalidateQueries({ queryKey: categoryPermissionKeys.all });
        alert.showAlert({
          type: 'success',
          title: `${response.data.message}`,
          show: true,
        });
      }
    },
    onError: error => {
      console.error('Error al agregar categoría de permiso:', error);
    },
  });

  const editMutation = useMutation({
    mutationFn: ({
      id,
      body,
    }: {
      id: string;
      body: Omit<CategoryPermissionForm, 'id'>;
    }) => adminServices.putCategoryPermission(id, body),
    onSuccess: response => {
      if (response.status === 200) {
        queryClient.invalidateQueries({ queryKey: categoryPermissionKeys.all });
        alert.showAlert({
          type: 'success',
          title: `${response.data.message}`,
          show: true,
        });
      }
    },
    onError: error => {
      console.error('Error al editar categoría de permiso:', error);
    },
  });

  const toggleMutation = useMutation({
    mutationFn: (id: string) => adminServices.toggleCategoryPermission(id),
    onSuccess: response => {
      if (response.status === 200) {
        queryClient.invalidateQueries({ queryKey: categoryPermissionKeys.all });
        alert.showAlert({
          type: 'success',
          title: `${response.data.message}`,
          show: true,
        });
      }
    },
    onError: error => {
      console.error('Error al alternar estado de categoría de permiso:', error);
    },
  });

  const addCategoryPermission = async (form: CategoryPermissionForm) => {
    try {
      const response = await addMutation.mutateAsync(form);
      return response.data;
    } catch (error) {
      console.error(error);
      return undefined;
    }
  };

  const editCategoryPermission = async (form: CategoryPermissionForm) => {
    try {
      const { id, ...body } = form;
      const response = await editMutation.mutateAsync({
        id: id!,
        body,
      });
      return response.data;
    } catch (error) {
      console.error(error);
      return undefined;
    }
  };

  const toggleCategoryPermission = async (id: string) => {
    try {
      const response = await toggleMutation.mutateAsync(id);
      return response.data;
    } catch (error) {
      console.error(error);
      return undefined;
    }
  };

  const getCategoryPermissions = async () => {
    const result = await refetchCategories();
    return result.data?.data || [];
  };

  const validateAlphaInput = (
    value: string | undefined,
    regex: RegExp = findRegex,
  ) => {
    if (!value) {
      value = '';
    }
    const sanitizedValue = sanitizedValueInput(value, regex);
    nextTick(() => {
      filter.filter_name = sanitizedValue;
    });
  };

  const cleanSearch = () => {
    if (
      (!filter.filter_name || filter.filter_name === '') &&
      (filter.status === undefined || filter.status === 'Todos')
    ) {
      return;
    }
    filter.filter_name = undefined;
    filter.status = undefined;
    pagination.page = 1;
    appliedFilter.filter_name = undefined;
    appliedFilter.status = undefined;
  };

  const setCategoryPermissionItem = (value: CategoryPermissionsResponse) => {
    setFieldValue('id', value?.id);
    setFieldValue('name', value?.name);
    setFieldValue('description', value?.description);
    setFieldValue('active', value?.active);
  };

  const findCategoryPermission = (value: FilterCategoryPermissionType) => {
    pagination.page = 1;
    appliedFilter.filter_name =
      (value.filter_name ?? filter.filter_name) || undefined;
    appliedFilter.status = value.status ?? filter.status;
  };

  return {
    headers,
    errors,
    defineField,
    handleSubmit,
    validateField,
    resetForm,
    resetField,
    setFieldError,
    setFieldValue,
    getCategoryPermissions,
    validateAlphaInput,
    cleanSearch,
    setCategoryPermissionItem,
    findCategoryPermission,
    id,
    idAttrs,
    name,
    nameAttrs,
    description,
    descriptionAttrs,
    active,
    activeAttrs,
    alert,
    filter,
    appliedFilter,
    pagination,
    categories,
    isPending,
    isFetching,
    addCategoryPermission,
    editCategoryPermission,
    toggleCategoryPermission,
    addMutation,
    editMutation,
    toggleMutation,
  };
}

export default useCategoryPermission;
