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
import { debounce } from '@/core/utils/debounceFunction';
import { sanitizedValueInput } from '@/core/utils/inputTextValidations';
import { createQueryKeys } from '@/core/utils/queryKeys';

import adminServices from '../services/admin.services';
import { PermissionsResponse } from '../interfaces/permissions/permissions.response.interface';
import { PermissionsCategory } from '../interfaces/permissions/permission.category.interface';
import { CategoryPermissionsResponse } from '../interfaces/category-permissions/category-permissions-response.interface';
import { PermissionForm } from '../interfaces/permissions/permission.form.interface';

export type FilterPermissionType = {
  filter_name?: string;
  active?: boolean | 'Todos';
  category_permission_id?: string;
};

export const permissionKeys = createQueryKeys<
  FilterPermissionType & { page?: number; per_page?: number }
>('admin-permissions');

export const permissionCategoriesKeys = createQueryKeys(
  'admin-permission-categories',
);

export function usePermission() {
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
        .required('El nombre del permiso es requerido')
        .min(3, 'El nombre debe tener al menos 3 caracteres')
        .max(150, 'El nombre debe tener máximo 150 caracteres'),
      description: yup
        .string()
        .min(5, 'La descripción debe tener al menos 5 caracteres')
        .max(150, 'La descripción debe tener máximo 150 caracteres')
        .nullable(),
      category: yup
        .mixed<PermissionsCategory>()
        .required('El campo de la categoría del permiso es requerido'),
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
      field: 'category.name',
      header: 'Categoria',
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
  const [category, categoryAttrs] = defineField('category');
  const [active, activeAttrs] = defineField('active');

  const filter = reactive<FilterPermissionType>({
    filter_name: undefined,
    active: undefined,
    category_permission_id: undefined,
  });

  const appliedFilter = reactive<FilterPermissionType>({
    filter_name: undefined,
    active: undefined,
    category_permission_id: undefined,
  });

  const findRegex = /[^a-zA-ZáÁéÉíÍóÓúÚñÑ.0-9- ]/g;

  // Query de permisos paginada
  const {
    data: permissionsQueryResult,
    isPending,
    isFetching,
    refetch: refetchPermissions,
  } = useQuery({
    queryKey: computed(() =>
      permissionKeys.list({
        page: pagination.page,
        per_page: pagination.per_page,
        filter_name: appliedFilter.filter_name || undefined,
        active:
          appliedFilter.active === 'Todos' ? undefined : appliedFilter.active,
        category_permission_id:
          appliedFilter.category_permission_id || undefined,
      }),
    ),
    queryFn: async () => {
      const params = {
        page: pagination.page,
        per_page: pagination.per_page,
        name: appliedFilter.filter_name || undefined,
        active:
          appliedFilter.active === 'Todos' ? undefined : appliedFilter.active,
        category_permission_id: appliedFilter.category_permission_id,
      };
      const response = await adminServices.getPermissions(params);
      if (response.statusCode === 200) {
        return response.data;
      }
      return null;
    },
    placeholderData: keepPreviousData,
  });

  watch(
    () => permissionsQueryResult.value,
    newData => {
      if (newData) {
        pagination.total_items = newData.total_items ?? 0;
      }
    },
    { immediate: true },
  );

  const permissions = computed<PermissionsResponse[]>(
    () => permissionsQueryResult.value?.data ?? [],
  );

  // Query de categorías de permisos para combo/filtro
  const { data: categoryPermissionsData, refetch: refetchCategoryPermissions } =
    useQuery({
      queryKey: computed(() => permissionCategoriesKeys.all),
      queryFn: async () => {
        const response = await adminServices.getCategoryPermissions();
        if (response.statusCode === 200 && response.data) {
          return response.data.data;
        }
        return [];
      },
      staleTime: 1000 * 60 * 10,
    });

  const categoryPermissions = computed<CategoryPermissionsResponse[]>(
    () => categoryPermissionsData.value ?? [],
  );

  // Mutaciones TanStack Query
  const addMutation = useMutation({
    mutationFn: (form: PermissionForm) =>
      adminServices.postPermission({
        ...form,
        active: true,
      }),
    onSuccess: response => {
      if (response.status === 201) {
        queryClient.invalidateQueries({ queryKey: permissionKeys.all });
        alert.showAlert({
          type: 'success',
          title: `${response.data.message}`,
          show: true,
        });
      }
    },
    onError: error => {
      console.error('Error al agregar permiso:', error);
    },
  });

  const editMutation = useMutation({
    mutationFn: ({
      id,
      body,
    }: {
      id: string;
      body: Omit<PermissionForm, 'id'>;
    }) => adminServices.putPermission(id, body),
    onSuccess: response => {
      if (response.status === 200) {
        queryClient.invalidateQueries({ queryKey: permissionKeys.all });
        alert.showAlert({
          type: 'success',
          title: `${response.data.message}`,
          show: true,
        });
      }
    },
    onError: error => {
      console.error('Error al editar permiso:', error);
    },
  });

  const toggleMutation = useMutation({
    mutationFn: (id: string) => adminServices.togglePermission(id),
    onSuccess: response => {
      if (response.status === 200) {
        queryClient.invalidateQueries({ queryKey: permissionKeys.all });
        alert.showAlert({
          type: 'success',
          title: `${response.data.message}`,
          show: true,
        });
      }
    },
    onError: error => {
      console.error('Error al alternar estado de permiso:', error);
    },
  });

  const addPermission = async (form: PermissionForm) => {
    try {
      const response = await addMutation.mutateAsync(form);
      return response.data;
    } catch (error) {
      console.error(error);
      return undefined;
    }
  };

  const editPermission = async (form: PermissionForm) => {
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

  const togglePermission = async (id: string) => {
    try {
      const response = await toggleMutation.mutateAsync(id);
      return response.data;
    } catch (error) {
      console.error(error);
      return undefined;
    }
  };

  const getPermissions = async () => {
    const result = await refetchPermissions();
    return result.data?.data || [];
  };

  const getCategoryPermissions = async () => {
    const result = await refetchCategoryPermissions();
    return result.data || [];
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
      filter.active === undefined &&
      filter.category_permission_id === undefined
    ) {
      return;
    }
    filter.filter_name = undefined;
    filter.active = undefined;
    filter.category_permission_id = undefined;
    pagination.page = 1;
    appliedFilter.filter_name = undefined;
    appliedFilter.active = undefined;
    appliedFilter.category_permission_id = undefined;
  };

  const setPermissionItem = (value: PermissionsResponse) => {
    setFieldValue('id', value?.id);
    setFieldValue('name', value?.name);
    setFieldValue('description', value?.description);
    setFieldValue('active', value?.active);
    setFieldValue('category', value?.category);
  };

  const findPermission = (value?: FilterPermissionType) => {
    pagination.page = 1;
    const target = value && typeof value === 'object' && !('target' in value) ? value : filter;
    appliedFilter.filter_name =
      (target?.filter_name ?? filter.filter_name) || undefined;
    appliedFilter.active = target?.active ?? filter.active;
    appliedFilter.category_permission_id =
      target?.category_permission_id ?? filter.category_permission_id;
  };

  const debouncedFindPermission = debounce(() => {
    findPermission();
  }, 700);
  const debouncedCleanSearch = debounce(() => {
    cleanSearch();
  }, 700);

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
    debouncedCleanSearch,
    setPermissionItem,
    findPermission,
    debouncedFindPermission,
    getPermissions,
    id,
    idAttrs,
    name,
    nameAttrs,
    description,
    descriptionAttrs,
    active,
    activeAttrs,
    category,
    categoryAttrs,
    alert,
    filter,
    appliedFilter,
    pagination,
    categoryPermissions,
    permissions,
    isPending,
    isFetching,
    addPermission,
    editPermission,
    togglePermission,
    addMutation,
    editMutation,
    toggleMutation,
  };
}

export default usePermission;
