import { nextTick, reactive, ref } from 'vue';

import { TableHeaders } from '@/core/interfaces';
import { useAlertStore, useLoaderStore } from '@/core/store';
import { sanitizedValueInput } from '@/core/utils/inputTextValidations';

import { UsersResponse } from '../interfaces/user-role/users.response.interface';
import { UserRoleByIdRoleItem } from '../interfaces/user-role/user-role-by-id.response.interface';
import { UserRoleUpdateForm } from '../interfaces/user-role/user-role-update.form.interface';
import { RoleResponse } from '../interfaces/role/role.response.interface';
import adminServices from '../services/admin.services';

export function useUserRole() {
  const { startLoading, finishLoading } = useLoaderStore();
  const alert = useAlertStore();

  const headers = ref<TableHeaders[]>([
    {
      field: 'id',
      header: 'No.',
      sortable: false,
      alignHeaders: 'center',
      alignItems: 'center',
    },
    {
      field: 'user_name',
      header: 'Nombre de usuario',
      sortable: false,
      alignHeaders: 'center',
      alignItems: 'center',
    },
    {
      field: 'email',
      header: 'Correo Electrónico',
      sortable: false,
      alignHeaders: 'center',
      alignItems: 'center',
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

  const users = ref<UsersResponse[]>([]);
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
  const roles_ids = ref<number[]>([]);

  const filter_name = ref<string | null>(null);
  const filter_role_name = ref<string | null>(null);

  const findRegex = /[^a-zA-ZáÁéÉíÍóÓúÚñÑ.0-9-@ ]/g;

  const getUsers = async () => {
    try {
      startLoading();
      const response = await adminServices.getUsers();
      if (response.statusCode === 200 && Array.isArray(response.data)) {
        users.value = response.data;
        pagination.total_items = response.data.length;
      }
    } catch (error) {
      console.error(error);
    } finally {
      finishLoading();
    }
  };

  const getUserRoleById = async (id: number) => {
    try {
      startLoading();
      userAssignedRoles.value = [];
      roles_ids.value = [];
      const response = await adminServices.getUserRoleById(id);
      if (response.statusCode === 200) {
        userAssignedRoles.value = response.data.role ?? [];
        roles_ids.value = response.data.role?.map(r => r.id) ?? [];
      }
      return response;
    } catch (error) {
      console.error(error);
    } finally {
      finishLoading();
    }
  };

  const getRoles = async () => {
    try {
      startLoading();
      const filter = {
        page: rolesPagination.page,
        per_page: rolesPagination.per_page,
      };
      const response = await adminServices.getRole(filter);
      if (response.statusCode === 200) {
        rolesList.value = response.data.data;
        rolesPagination.page = response.data.current_page;
        rolesPagination.per_page = response.data.per_page;
        rolesPagination.total_items = response.data.total_items;
      }
    } catch (error) {
      console.error(error);
    } finally {
      finishLoading();
    }
  };

  const updateUserRole = async (id: number, form: UserRoleUpdateForm) => {
    try {
      startLoading();
      const response = await adminServices.putUserRole(id, form);
      if (response.status === 200) {
        alert.showAlert({
          type: 'success',
          title: `${response.data.message}`,
          show: true,
        });
        return response.data;
      }
    } catch (error) {
      console.error(error);
    } finally {
      finishLoading();
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
    filter_role_name,
    getUsers,
    getUserRoleById,
    getRoles,
    updateUserRole,
    validateAlphaInput,
  };
}
