import { useForm } from 'vee-validate';
import { nextTick, reactive, ref } from 'vue';
import * as yup from 'yup';

import { TableHeaders } from '@/core/interfaces';
import { useAlertStore, useLoaderStore } from '@/core/store';
import { sanitizedValueInput } from '@/core/utils/inputTextValidations';

import { CategoryStatusResponse } from '../interfaces/category-status/category-status.response.interface';
import { CategoryStatusForm } from '../interfaces/category-status/category-status.form.interface';
import catalogServices from '../Services/catalog.services';

export function useCategoryStatus() {
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
        .required('El nombre de la categoría de estado es requerido')
        .min(3, 'El nombre debe tener al menos 3 caracteres'),
      code: yup
        .string()
        .required('El código es requerido')
        .min(2, 'El código debe tener al menos 2 caracteres')
        .max(10, 'El código no puede tener más de 10 caracteres'),
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
      field: 'code',
      header: 'Código',
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

  const categoryStatuses = ref<CategoryStatusResponse[] | undefined>([]);
  const pagination = reactive({
    page: 1,
    per_page: 10,
    total_items: 0,
  });
  const { startLoading, finishLoading } = useLoaderStore();
  const alert = useAlertStore();

  const [id, idAttrs] = defineField('id');
  const [name, nameAttrs] = defineField('name');
  const [code, codeAttrs] = defineField('code');
  const [description, descriptionAttrs] = defineField('description');
  const [active, activeAttrs] = defineField('active');

  const filter_name = ref<string | null>(null);
  const findRegex = /[^a-zA-ZáÁéÉíÍóÓúÚñÑ.0-9 ]/g;

  const getCategoryStatuses = async () => {
    try {
      startLoading();
      const filter = {
        page: pagination.page,
        per_page: pagination.per_page,
        filter: filter_name.value,
      };
      const response = await catalogServices.getAllCategoryStatuses(filter);

      if (response.statusCode === 200) {
        categoryStatuses.value = response.data.data;
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

  const addCategoryStatus = async (form: CategoryStatusForm) => {
    try {
      startLoading();
      const response = await catalogServices.postCategoryStatus({
        ...form,
        active: true,
      });
      if (response.status === 201) {
        getCategoryStatuses();
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

  const editCategoryStatus = async (form: CategoryStatusForm) => {
    try {
      startLoading();
      const { id, ...body } = form;
      const response = await catalogServices.putCategoryStatus(id!, body);
      if (response.status === 200) {
        getCategoryStatuses();
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

  const deleteCategoryStatus = async (id: number) => {
    try {
      startLoading();
      const response = await catalogServices.deleteCategoryStatus(id);
      if (response.status === 200) {
        getCategoryStatuses();
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
    getCategoryStatuses();
  };

  const setCategoryStatusItem = (value: CategoryStatusResponse) => {
    setFieldValue('id', value?.id);
    setFieldValue('name', value?.name);
    setFieldValue('code', value?.code);
    setFieldValue('description', value?.description);
    setFieldValue('active', value?.active);
  };

  const findCategoryStatus = (value: string | null) => {
    if (value) {
      getCategoryStatuses();
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
    getCategoryStatuses,
    validateAlphaInput,
    cleanSearch,
    setCategoryStatusItem,
    findCategoryStatus,
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
    alert,
    filter_name,
    pagination,
    categoryStatuses,
    addCategoryStatus,
    editCategoryStatus,
    deleteCategoryStatus,
  };
}
