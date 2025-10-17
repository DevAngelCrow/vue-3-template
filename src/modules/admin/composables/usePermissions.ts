import { useForm } from 'vee-validate';
import { nextTick, reactive, ref } from 'vue';
import * as yup from 'yup';

import { TableHeaders } from '@/core/interfaces';
import { useAlertStore, useLoaderStore } from '@/core/store';
import { sanitizedValueInput } from '@/core/utils/inputTextValidations';

import adminServices from '../services/admin.services';
import { PermissionsResponse } from '../interfaces/permissions/permissions.response.interface';
import { PermissionsCategory } from '../interfaces/permissions/permission.category.interface';
import { PermissionsCategoryResponse } from '../interfaces/permissions/permission.category.response.interface';
import { PermissionForm } from '../interfaces/permissions/permission.form.interface';

export function usePermission() {
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
        .required('El nombre del permiso es requerido')
        .min(3, 'El nombre de tener al menos 3 caracteres'),
      description: yup
        .string()
        .min(5, 'La descripción debe tener al menos 5 caracteres')
        .nullable(),
      permissions_category: yup
        .mixed<PermissionsCategory>()
        .required('El campo de la categoría del permiso es requerido'),
      active: yup.boolean(),
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
      field: 'permissions_category.name',
      header: 'Categoria',
      sortable: false,
      alignHeaders: 'center',
      alignItems: 'center',
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

  const permissions = ref<PermissionsResponse[] | undefined>([]);
  const pagination = reactive({
    page: 1,
    per_page: 10,
    total_items: 0,
  });
  const { startLoading, finishLoading } = useLoaderStore();
  const alert = useAlertStore();

  const [id, idAttrs] = defineField('id');
  const [name, nameAttrs] = defineField('name');
  const [description, descriptionAttrs] = defineField('description');
  const [permission_category, permissionCategoryAttrs] = defineField(
    'permissions_category',
  );
  const [active, activeAttrs] = defineField('active');

  const filter_name = ref<string | null>(null);
  const findRegex = /[^a-zA-ZáÁéÉíÍóÓúÚñÑ.0-9- ]/g;
  const categoryPermissions = ref<PermissionsCategoryResponse[]>([]);

  const getCategoryPermissions = async () => {
    try {
      startLoading();
      const response = await adminServices.getCategoryPermissions();
      if (response.statusCode === 200) {
        if (Array.isArray(response.data)) {
          categoryPermissions.value = response.data;
        }
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
        page: pagination.page,
        per_page: pagination.per_page,
        filter_name: filter_name.value,
      };
      const response = await adminServices.getPermissions(filter);

      if (response.statusCode === 200) {
        permissions.value = response.data.items;
        pagination.page = response.data.pagination.currentPage;
        pagination.per_page = response.data.pagination.perPage;
        pagination.total_items = response.data.pagination.totalItems;
      }
    } catch (error) {
      console.error(error);
    } finally {
      finishLoading();
    }
  };

  const addPermission = async (form: PermissionForm) => {
    try {
      startLoading();
      const response = await adminServices.postPermission(form);
      if (response.status === 201) {
        getPermissions();
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

  const editPermission = async (form: PermissionForm) => {
    try {
      startLoading();
      const response = await adminServices.putPermission(form);
      if (response.status === 200) {
        getPermissions();
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

  const deletePermission = async (id: number) => {
    try {
      startLoading();
      const response = await adminServices.deletePermission(id);
      if (response.status === 200) {
        getPermissions();
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

  const cleanSearch = () => {
    if (!filter_name.value || filter_name.value === '') {
      return;
    }
    filter_name.value = null;
    getPermissions();
  };

  const setPermissionItem = (value: PermissionsResponse) => {
    setFieldValue('id', value?.id);
    setFieldValue('name', value?.name);
    setFieldValue('description', value?.description);
    setFieldValue('active', value?.active);
    setFieldValue('permissions_category', value?.permissions_category);
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
    getCategoryPermissions,
    validateAlphaInput,
    cleanSearch,
    setPermissionItem,
    findPermission,
    getPermissions,
    id,
    idAttrs,
    name,
    nameAttrs,
    description,
    descriptionAttrs,
    active,
    activeAttrs,
    permission_category,
    permissionCategoryAttrs,
    alert,
    filter_name,
    pagination,
    categoryPermissions,
    permissions,
    addPermission,
    editPermission,
    deletePermission,
  };
}
