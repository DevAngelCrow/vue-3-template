import { computed, nextTick, reactive, ref, watch } from 'vue';
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

import { UsersResponse } from '../interfaces/user-role/users.response.interface';
import { UserRoleByIdRoleItem } from '../interfaces/user-role/user-role-by-id.response.interface';
import { UserRoleUpdateForm } from '../interfaces/user-role/user-role-update.form.interface';
import { RoleResponse } from '../interfaces/role/role.response.interface';
import adminServices from '../services/admin.services';

export type FilterUserRoleType = {
  filter_name?: string | null;
  id_status?: string | null;
};

export const usersKeys = createQueryKeys<
  FilterUserRoleType & { page?: number; per_page?: number }
>('admin-users');

export const userRolesKeys = createQueryKeys<{ id: string }>(
  'admin-user-roles',
);

export const userRoleAdminRolesKeys = createQueryKeys<{
  page?: number;
  per_page?: number;
}>('admin-user-roles-list');

export function useUserRole() {
  const queryClient = useQueryClient();
  const alert = useAlertStore();

  const headers = ref<TableHeaders[]>([
    {
      field: 'user_name',
      header: 'Nombre de usuario',
      sortable: false,
      alignHeaders: 'start',
      alignItems: 'start',
    },
    {
      field: 'email',
      header: 'Correo Electrónico',
      sortable: false,
      alignHeaders: 'start',
      alignItems: 'start',
    },
    {
      field: 'is_validated',
      header: 'Validado',
      sortable: false,
      alignHeaders: 'center',
      alignItems: 'center',
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

  const headersRole = ref<TableHeaders[]>([
    {
      field: 'state',
      header: 'Seleccion',
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
      field: 'code',
      header: 'Código',
      sortable: false,
      alignHeaders: 'start',
      alignItems: 'start',
    },
  ]);

  const filter = reactive<FilterUserRoleType>({
    filter_name: undefined,
    id_status: undefined,
  });

  const pagination = reactive({
    page: 1,
    per_page: 10,
    total_items: 0,
  });

  const rolesPagination = reactive({
    page: 1,
    per_page: 10,
    total_items: 0,
  });

  const rolesList = ref<RoleResponse[]>([]);
  const userAssignedRoles = ref<UserRoleByIdRoleItem[]>([]);
  const roles_ids = ref<string[]>([]);

  const filter_name = ref<string | null>(null);
  const applied_filter_name = ref<string | null>(null);
  const filter_role_name = ref<string | null>(null);

  const findRegex = /[^a-zA-ZáÁéÉíÍóÓúÚñÑ.0-9-@ ]/g;

  // Query paginada de usuarios
  const {
    data: usersQueryResult,
    isPending,
    isFetching,
    refetch: refetchUsers,
  } = useQuery({
    queryKey: computed(() =>
      usersKeys.list({
        page: pagination.page,
        per_page: pagination.per_page,
        filter_name: applied_filter_name.value || undefined,
        id_status: filter.id_status || undefined,
      }),
    ),
    queryFn: async () => {
      const params = {
        page: pagination.page,
        per_page: pagination.per_page,
        filter_name: applied_filter_name.value,
        id_status: filter.id_status,
      };
      const response = await adminServices.getUsers(params);
      if (response.statusCode === 200) {
        return response.data;
      }
      return null;
    },
    placeholderData: keepPreviousData,
  });

  watch(
    () => usersQueryResult.value,
    newData => {
      if (newData) {
        pagination.total_items = newData.total_items ?? 0;
      }
    },
    { immediate: true },
  );

  const users = computed<UsersResponse[]>(
    () => usersQueryResult.value?.data ?? [],
  );

  // Mutación de actualización de roles de usuario
  const updateMutation = useMutation({
    mutationFn: ({ id, form }: { id: string; form: UserRoleUpdateForm }) =>
      adminServices.putUserRole(id, form),
    onSuccess: response => {
      if (response.status === 200) {
        queryClient.invalidateQueries({ queryKey: usersKeys.all });
        queryClient.invalidateQueries({ queryKey: userRolesKeys.all });
        alert.showAlert({
          type: 'success',
          title: `${response.data.message}`,
          show: true,
        });
      }
    },
    onError: error => {
      console.error('Error al actualizar roles de usuario:', error);
    },
  });

  const getUsers = async () => {
    const result = await refetchUsers();
    return result.data?.data || [];
  };

  const getUserRoleById = async (id: string) => {
    try {
      userAssignedRoles.value = [];
      roles_ids.value = [];
      const response = await adminServices.getUserRoleById(id);
      if (response.statusCode === 200) {
        userAssignedRoles.value = response.data.role ?? [];
        roles_ids.value = response.data.role?.map(r => r.id) ?? [];
      }
      return response;
    } catch (error) {
      console.error('Error al obtener rol de usuario por ID:', error);
      return null;
    }
  };

  const getRoles = async () => {
    try {
      const filterParams = {
        page: rolesPagination.page,
        per_page: rolesPagination.per_page,
      };
      const response = await adminServices.getRole(filterParams);
      if (response.statusCode === 200) {
        rolesList.value = response.data.data;
        rolesPagination.page = response.data.current_page;
        rolesPagination.per_page = response.data.per_page;
        rolesPagination.total_items = response.data.total_items;
      }
    } catch (error) {
      console.error('Error al obtener lista de roles:', error);
    }
  };

  const updateUserRole = async (id: string, form: UserRoleUpdateForm) => {
    try {
      const response = await updateMutation.mutateAsync({ id, form });
      return response.data;
    } catch (error) {
      console.error(error);
      return undefined;
    }
  };

  const validateAlphaInput = (
    value: string | null,
    regex: RegExp = findRegex,
  ) => {
    if (!value) {
      value = '';
    }
    const sanitizedValue = sanitizedValueInput(value, regex);
    nextTick(() => {
      filter_name.value = sanitizedValue;
    });
  };

  const findUser = (value?: string | null) => {
    pagination.page = 1;
    const target = typeof value === 'string' ? value : filter_name.value;
    applied_filter_name.value = target || null;
  };

  const cleanSearch = () => {
    filter_name.value = null;
    applied_filter_name.value = null;
    pagination.page = 1;
  };

  const debouncedFindUser = debounce(() => {
    findUser();
  }, 700);
  const debouncedCleanSearch = debounce(() => {
    cleanSearch();
  }, 700);

  return {
    headers,
    headersRole,
    users,
    pagination,
    rolesPagination,
    rolesList,
    userAssignedRoles,
    roles_ids,
    filter_name,
    applied_filter_name,
    filter_role_name,
    isPending,
    isFetching,
    getUsers,
    getUserRoleById,
    getRoles,
    updateUserRole,
    validateAlphaInput,
    findUser,
    debouncedFindUser,
    cleanSearch,
    debouncedCleanSearch,
  };
}

export default useUserRole;
