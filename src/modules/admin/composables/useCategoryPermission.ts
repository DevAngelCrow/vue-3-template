import { useForm } from 'vee-validate';
import { nextTick, reactive, ref } from 'vue';
import * as yup from 'yup';

import { TableHeaders } from '@/core/interfaces';
import { useAlertStore, useLoaderStore } from '@/core/store';
import { sanitizedValueInput } from '@/core/utils/inputTextValidations';

import adminServices from '../services/admin.services';
import { CategoryPermissionsResponse } from '../interfaces/category-permissions/category-permissions-response.interface';
import { CategoryPermissionForm } from '../interfaces/category-permissions/category-permission-form.interface';

export function useCategoryPermission() {
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
        .required('El nombre de la categoría es requerido')
        .min(3, 'El nombre de tener al menos 3 caracteres'),
      description: yup
        .string()
        .min(5, 'La descripción debe tener al menos 5 caracteres')
        .nullable(),
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

  const categories = ref<CategoryPermissionsResponse[] | undefined>([]);
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
  const [active, activeAttrs] = defineField('active');

  const filter_name = ref<string | null>(null);
  const findRegex = /[^a-zA-ZáÁéÉíÍóÓúÚñÑ.0-9- ]/g;

  const getCategoryPermissions = async () => {
    try {
      startLoading();
      const filter = {
        page: pagination.page,
        per_page: pagination.per_page,
        filter_name: filter_name.value,
      };
      const response = await adminServices.getCategoryPermissions(filter);
      if (response.statusCode === 200) {
        categories.value = response.data.items;
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

  const addCategoryPermission = async (form: CategoryPermissionForm) => {
    try {
      startLoading();
      const response = await adminServices.postCategoryPermission(form);
      if (response.status === 201) {
        getCategoryPermissions();
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

  const editCategoryPermission = async (form: CategoryPermissionForm) => {
    try {
      startLoading();
      const response = await adminServices.putCategoryPermission(form);
      if (response.status === 200) {
        getCategoryPermissions();
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

  const deleteCategoryPermission = async (id: number) => {
    try {
      startLoading();
      const response = await adminServices.deleteCategoryPermission(id);
      if (response.status === 200) {
        getCategoryPermissions();
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
    getCategoryPermissions();
  };

  const setCategoryPermissionItem = (value: CategoryPermissionsResponse) => {
    console.log(value, 'values');
    setFieldValue('id', value?.id);
    setFieldValue('name', value?.name);
    setFieldValue('description', value?.description);
    setFieldValue('active', value?.active);
  };

  const findCategoryPermission = (value: string | null) => {
    if (value) {
      getCategoryPermissions();
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
    filter_name,
    pagination,
    addCategoryPermission,
    editCategoryPermission,
    deleteCategoryPermission,
    categories,
  };
}
