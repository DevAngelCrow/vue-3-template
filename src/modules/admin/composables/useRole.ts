import { useForm } from 'vee-validate';
import { nextTick, reactive, ref } from 'vue';
import * as yup from 'yup';

import { TableHeaders } from '@/core/interfaces';
import { useAlertStore, useLoaderStore } from '@/core/store';
import { sanitizedValueInput } from '@/core/utils/inputTextValidations';
import catalogServices from '@/modules/catalogs/Services/catalog.services';

import adminServices from '../services/admin.services';
import { RoleStatus } from '../interfaces/role/role.status.response.interface';
import { RoleResponse } from '../interfaces/role/role.response.interface';
import { RoleForm } from '../interfaces/role/role.form.interface';

export function useRole() {
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
      id: yup.number().typeError('El campo id debe ser de tipo entero'),
      name: yup
        .string()
        .required('El nombre del rol es requerido')
        .min(3, 'El nombre de tener al menos 3 caracteres'),
      description: yup
        .string()
        .min(5, 'La descripción debe tener al menos 5 caracteres')
        .nullable(),
      status: yup
        .mixed<RoleStatus>()
        .required('El campo del estado del rol es requerido'),
      permissions_ids: yup.array(),
    }),
  });

  const headers = ref<TableHeaders[]>([
    {
      field: 'id',
      header: 'No.',
      sortable: false,
      alignHeaders: 'center',
      alignItems: 'center',
    },
    {
      field: 'name',
      header: 'Nombre',
      sortable: false,
      alignHeaders: 'center',
      alignItems: 'center',
    },
    {
      field: 'description',
      header: 'Descripción',
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

  const headerPermissions = ref<TableHeaders[]>([
    {
      field: 'state',
      header: 'Seleccion',
      sortable: false,
      alignHeaders: 'center',
      alignItems: 'center',
      width: 10,
    },
    {
      field: 'name',
      header: 'Nombre',
      sortable: false,
      alignHeaders: 'start',
      alignItems: 'start',
    },
  ]);

  const role = ref<RoleResponse[] | undefined>([]);
  const pagination = reactive({
    page: 1,
    per_page: 10,
    total_items: 0,
  });
  const permissionsPagination = reactive({
    page: 1,
    per_page: 5,
    total_items: 0,
  });
  const permissionsList = ref<
    {
      id: number;
      name: string;
      description: string;
      active: boolean;
    }[]
  >([]);
  const { startLoading, finishLoading } = useLoaderStore();
  const alert = useAlertStore();

  const [id, idAttrs] = defineField('id');
  const [name, nameAttrs] = defineField('name');
  const [description, descriptionAttrs] = defineField('description');
  const [status, statusAttrs] = defineField('status');
  const [permissions_ids, permissionsIdsAttrs] = defineField('permissions_ids');

  const filter_name = ref<string | null>(null);
  const filter_permission_name = ref<string | null>(null);
  const findRegex = /[^a-zA-ZáÁéÉíÍóÓúÚñÑ.0-9- ]/g;
  const globalStatus = ref<RoleStatus[]>([]);

  const getStatus = async () => {
    try {
      startLoading();
      const filter = {
        page: undefined,
        per_page: undefined,
        table_header: 'mnt_role',
      };
      const response = await catalogServices.getGlobalStatus(filter);
      if (response.statusCode === 200) {
        if (Array.isArray(response.data)) {
          globalStatus.value = response.data;
        }
      }
    } catch (error) {
      console.error(error);
    } finally {
      finishLoading();
    }
  };
  const getRole = async () => {
    try {
      startLoading();
      const filter = {
        page: pagination.page,
        per_page: pagination.per_page,
        filter: filter_name.value,
      };
      const response = await adminServices.getRole(filter);
      if (response.statusCode === 200) {
        role.value = response.data.data;
        pagination.page = response.data.current_page;
        pagination.per_page = response.data.per_page;
        pagination.total_items = response.data.total_items;
      }
    } catch (error) {
      console.error(error);
    } finally {
      finishLoading();
    }
  };

  const addRol = async (form: RoleForm) => {
    try {
      startLoading();
      const response = await adminServices.postRole(form);
      if (response.status === 201) {
        getRole();
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

  const editRole = async (form: RoleForm) => {
    try {
      startLoading();
      const response = await adminServices.putRole(form);
      if (response.status === 200) {
        getRole();
        alert.showAlert({
          type: 'success',
          title: `${response.data.message}`,
          show: true,
        });
        return response.data;
      }
    } catch (error) {
      console.log(error);
    } finally {
      finishLoading();
    }
  };

  const deleteRol = async (id: number) => {
    try {
      startLoading();
      const response = await adminServices.deleteRole(id);
      if (response.status === 200) {
        getRole();
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
  const getRolById = async (id: number) => {
    try {
      startLoading();
      permissionsList.value = [];
      permissionsPagination.total_items = 0;
      const response = await adminServices.getRol(id);
      console.log(response, 'response get rol by id');
      if (response.statusCode === 200) {
        permissionsList.value = response.data.permissions
          ? response.data.permissions
          : [];
        permissionsPagination.per_page = 5;
        permissionsPagination.total_items = response.data.permissions.length;
      }
    } catch (error) {
      console.error(error);
    } finally {
      finishLoading();
    }
  };
  const getPermissions = async () => {
    try {
      startLoading();
      const filter = {
        page: permissionsPagination.page,
        per_page: permissionsPagination.per_page,
        filter: filter_permission_name.value
          ? filter_permission_name.value
          : null,
        active: 1,
      };
      const response = await adminServices.getPermissions(filter);
      if (response.statusCode === 200) {
        permissionsList.value = response.data.data;
        permissionsPagination.page = response.data.current_page;
        permissionsPagination.per_page = response.data.per_page;
        permissionsPagination.total_items = response.data.total_items;
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

  const cleanSearch = () => {
    if (!filter_name.value || filter_name.value === '') {
      return;
    }
    filter_name.value = null;
    getRole();
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
  };

  const findRole = (value: string | null) => {
    if (value) {
      getRole();
    }
  };
  const findPermission = (value: string | null) => {
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
    alert,
    filter_name,
    pagination,
    globalStatus,
    role,
    headerPermissions,
    permissionsPagination,
    permissionsList,
    permissions_ids,
    permissionsIdsAttrs,
    filter_permission_name,
    addRol,
    editRole,
    deleteRol,
    findPermission,
    getPermissions,
    getRolById,
  };
}
