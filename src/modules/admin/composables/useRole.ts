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
import catalogServices from '@/modules/catalogs/Services/catalog.services';
import { CategoryStatus } from '@/types/global-status.type';

import adminServices from '../services/admin.services';
import { RoleStatus } from '../interfaces/role/role.status.response.interface';
import { RoleResponse } from '../interfaces/role/role.response.interface';
import { RoleForm } from '../interfaces/role/role.form.interface';
import { CategoryPermissionsResponse } from '../interfaces/role/role.category-permisions.response.interface';

export type FilterRoleType = { filter_name?: string; id_status?: string };

export const roleKeys = createQueryKeys<
  FilterRoleType & { page?: number; per_page?: number }
>('admin-roles');

export const roleStatusKeys = createQueryKeys('admin-role-status');

export const roleDetailKeys = createQueryKeys<{ id: string }>(
  'admin-role-detail',
);

export const roleCategoryPermissionsKeys = createQueryKeys<{
  active?: boolean;
}>('admin-category-permissions');

export function useRole() {
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
        .required('El nombre del rol es requerido')
        .min(3, 'El nombre de tener al menos 3 caracteres')
        .max(150, 'El nombre debe tener máximo 150 caracteres'),
      description: yup
        .string()
        .required('La descripción del rol es requerida')
        .min(5, 'La descripción debe tener al menos 5 caracteres')
        .max(255, 'La descripción debe tener máximo 255 caracteres'),
      status: yup
        .mixed<RoleStatus>()
        .required('El campo del estado del rol es requerido'),
      permissions_ids: yup.array(),
      code: yup
        .string()
        .required('El código del rol es requerido')
        .min(3, 'El código debe tener al menos 3 caracteres')
        .max(15, 'El código debe tener máximo 10 caracteres'),
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
      field: 'status.name',
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

  const headerPermissions = ref<TableHeaders[]>([
    {
      field: 'state',
      header: `Seleccion`,
      sortable: false,
      alignHeaders: 'center',
      alignItems: 'center',
      width: 15,
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
      field: 'category.name',
      header: 'Categoría',
      sortable: false,
      alignHeaders: 'start',
      alignItems: 'start',
    },
  ]);

  const pagination = reactive({
    page: 1,
    per_page: 10,
    total_items: 0,
  });

  const permissionsPagination = reactive({
    page: 1,
    per_page: 10,
    total_items: 0,
  });

  const [id, idAttrs] = defineField('id');
  const [name, nameAttrs] = defineField('name');
  const [description, descriptionAttrs] = defineField('description');
  const [status, statusAttrs] = defineField('status');
  const [permissions_ids, permissionsIdsAttrs] = defineField('permissions_ids');
  const [code, codeAttrs] = defineField('code');
  const [id_status, idStatusAttrs] = defineField('id_status');

  const filter = reactive<FilterRoleType>({
    filter_name: undefined,
    id_status: undefined,
  });

  const appliedFilter = reactive<FilterRoleType>({
    filter_name: undefined,
    id_status: undefined,
  });

  const filter_permission = ref<{
    name: string;
    category?: {
      id: string;
      name: string;
      description: string;
    };
  }>({ name: '' });

  const findRegex = /[^a-zA-ZáÁéÉíÍóÓúÚñÑ.0-9- ]/g;

  const permissionsList = ref<
    {
      id: string;
      name: string;
      description: string;
      active: boolean;
    }[]
  >([]);

  // Query de Roles paginada
  const {
    data: roleQueryResult,
    isPending,
    isFetching,
    refetch: refetchRoles,
  } = useQuery({
    queryKey: computed(() =>
      roleKeys.list({
        page: pagination.page,
        per_page: pagination.per_page,
        filter_name: appliedFilter.filter_name || undefined,
        id_status: appliedFilter.id_status || undefined,
      }),
    ),
    queryFn: async () => {
      const params = {
        page: pagination.page,
        per_page: pagination.per_page,
        name: appliedFilter.filter_name || undefined,
        id_status: appliedFilter.id_status,
      };
      const response = await adminServices.getRole(params);
      if (response.statusCode === 200) {
        return response.data;
      }
      return null;
    },
    placeholderData: keepPreviousData,
  });

  watch(
    () => roleQueryResult.value,
    newData => {
      if (newData) {
        pagination.total_items = newData.total_items ?? 0;
      }
    },
    { immediate: true },
  );

  const role = computed<RoleResponse[]>(
    () => roleQueryResult.value?.data ?? [],
  );

  // Query de Estados Globales para roles
  const { data: globalStatusData, refetch: refetchStatus } = useQuery({
    queryKey: computed(() => roleStatusKeys.all),
    queryFn: async () => {
      const filterParams = {
        page: undefined,
        per_page: undefined,
        code_category: CategoryStatus.CODE,
      };
      const response = await catalogServices.getGlobalStatus(filterParams);
      if (response.statusCode === 200) {
        if (Array.isArray(response.data)) {
          return response.data;
        }
        if (response.data && Array.isArray(response.data.data)) {
          return response.data.data;
        }
      }
      return [];
    },
    staleTime: 1000 * 60 * 10,
  });

  const globalStatus = computed<RoleStatus[]>(
    () => globalStatusData.value || [],
  );

  // Query de Categorías de Permisos
  const { data: categoriesData, refetch: refetchCategories } = useQuery({
    queryKey: computed(() => roleCategoryPermissionsKeys.list({ active: true })),
    queryFn: async () => {
      const response = await adminServices.getCategoryPermissions({
        active: true,
      });
      if (response.statusCode === 200 && response.data) {
        return response.data.data;
      }
      return [];
    },
    staleTime: 1000 * 60 * 10,
  });

  const categories = computed<CategoryPermissionsResponse[]>(
    () => categoriesData.value ?? [],
  );

  // Mutaciones TanStack Query
  const addRoleMutation = useMutation({
    mutationFn: (form: RoleForm) => adminServices.postRole(form),
    onSuccess: response => {
      if (response.status === 201) {
        queryClient.invalidateQueries({ queryKey: roleKeys.all });
        alert.showAlert({
          type: 'success',
          title: `${response.data.message}`,
          show: true,
        });
      }
    },
    onError: error => {
      console.error('Error al agregar rol:', error);
    },
  });

  const editRoleMutation = useMutation({
    mutationFn: ({
      id,
      body,
    }: {
      id: string;
      body: Omit<RoleForm, 'id'>;
    }) => adminServices.putRole(id, body),
    onSuccess: response => {
      if (response.status === 200) {
        queryClient.invalidateQueries({ queryKey: roleKeys.all });
        queryClient.invalidateQueries({ queryKey: roleDetailKeys.all });
        alert.showAlert({
          type: 'success',
          title: `${response.data.message}`,
          show: true,
        });
      }
    },
    onError: error => {
      console.error('Error al editar rol:', error);
    },
  });

  const toggleRoleMutation = useMutation({
    mutationFn: (id: string) => adminServices.toggleRole(id),
    onSuccess: response => {
      if (response.status === 200) {
        queryClient.invalidateQueries({ queryKey: roleKeys.all });
        alert.showAlert({
          type: 'success',
          title: `${response.data.message}`,
          show: true,
        });
      }
    },
    onError: error => {
      console.error('Error al alternar estado del rol:', error);
    },
  });

  const addRol = async (form: RoleForm) => {
    try {
      const response = await addRoleMutation.mutateAsync(form);
      return response.data;
    } catch (error) {
      console.error(error);
      return undefined;
    }
  };

  const editRole = async (form: RoleForm) => {
    try {
      const { id, ...body } = form;
      const response = await editRoleMutation.mutateAsync({
        id: id!,
        body,
      });
      return response.data;
    } catch (error) {
      console.error(error);
      return undefined;
    }
  };

  const toggleRole = async (id: string) => {
    try {
      const response = await toggleRoleMutation.mutateAsync(id);
      return response.data;
    } catch (error) {
      console.error(error);
      return undefined;
    }
  };

  const getStatus = async () => {
    const result = await refetchStatus();
    return result.data || [];
  };

  const getRole = async () => {
    const result = await refetchRoles();
    return result.data?.data || [];
  };

  const getRolById = async (id: string) => {
    try {
      permissionsList.value = [];
      permissionsPagination.total_items = 0;
      const response = await adminServices.getRol(id);
      if (response.statusCode === 200) {
        permissionsList.value = response.data.permissions
          ? response.data.permissions
          : [];
        permissionsPagination.per_page = 10;
        permissionsPagination.total_items = response.data.permissions.length;
      }
      return response;
    } catch (error) {
      console.error('Error al obtener rol por ID:', error);
      return null;
    }
  };

  const getPermissions = async () => {
    try {
      const filterParams = {
        page: permissionsPagination.page,
        per_page: permissionsPagination.per_page,
        name: filter_permission.value.name
          ? filter_permission.value.name
          : undefined,
        category_permission_id: filter_permission.value.category?.id,
        active: true,
      };
      const response = await adminServices.getPermissions(filterParams);
      if (response.statusCode === 200) {
        permissionsList.value = response.data.data;
        permissionsPagination.page = response.data.current_page;
        permissionsPagination.per_page = response.data.per_page;
        permissionsPagination.total_items = response.data.total_items;
      }
    } catch (error) {
      console.error('Error al obtener permisos:', error);
    }
  };

  const getCategoryPermissions = async () => {
    const result = await refetchCategories();
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
      filter.id_status === undefined
    ) {
      return;
    }
    filter.filter_name = undefined;
    filter.id_status = undefined;
    pagination.page = 1;
    appliedFilter.filter_name = undefined;
    appliedFilter.id_status = undefined;
  };

  const setRoleItem = (value: RoleResponse) => {
    setFieldValue('id', value?.id);
    setFieldValue('name', value?.name);
    setFieldValue('description', value?.description);
    setFieldValue('status', value?.status);
    setFieldValue(
      'permissions_ids',
      value.permissions?.length
        ? value.permissions.map(permission => permission.id)
        : [],
    );
    setFieldValue('code', value?.code);
    setFieldValue('id_status', value?.status?.id);
  };

  const findRole = (value: FilterRoleType) => {
    pagination.page = 1;
    appliedFilter.filter_name =
      (value.filter_name ?? filter.filter_name) || undefined;
    appliedFilter.id_status = value.id_status ?? filter.id_status;
  };

  const findPermission = (value: {
    name: string;
    category?: {
      id: string;
      name: string;
      description: string;
    };
  }) => {
    if (value) {
      getPermissions();
    }
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
    getStatus,
    validateAlphaInput,
    cleanSearch,
    setRoleItem,
    findRole,
    getRole,
    id,
    idAttrs,
    name,
    nameAttrs,
    description,
    descriptionAttrs,
    status,
    statusAttrs,
    id_status,
    idStatusAttrs,
    code,
    codeAttrs,
    alert,
    filter,
    appliedFilter,
    pagination,
    globalStatus,
    role,
    headerPermissions,
    permissionsPagination,
    permissionsList,
    permissions_ids,
    permissionsIdsAttrs,
    filter_permission,
    addRol,
    editRole,
    toggleRole,
    findPermission,
    getPermissions,
    getRolById,
    getCategoryPermissions,
    categories,
    isPending,
    isFetching,
    addRoleMutation,
    editRoleMutation,
    toggleRoleMutation,
  };
}

export default useRole;
