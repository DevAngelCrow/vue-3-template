import { useForm } from 'vee-validate';
import { nextTick, reactive, ref } from 'vue';
import * as yup from 'yup';

import { TableHeaders } from '@/core/interfaces';
import { useAlertStore, useLoaderStore } from '@/core/store';
import { sanitizedValueInput } from '@/core/utils/inputTextValidations';

import catalogServices from '../Services/catalog.services';
import { GlobalStatusResponse } from '../interfaces/global-status/global-status.response.interface';
import { GlobalStatusForm } from '../interfaces/global-status/global-status.form.interface';
export function useGlobalStatus() {
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
      table_header: yup
        .string()
        .required('El campo de cabecera es obligatorio'),
      name: yup
        .string()
        .required('El nombre del departamento es requerido')
        .min(3, 'El nombre de tener al menos 3 caracteres'),
      description: yup
        .string()
        .min(5, 'La descripción debe tener al menos 5 caracteres')
        .nullable(),
      state_color: yup.string().required('El color del estado es obligatorio'),
      text_color: yup
        .string()
        .required('El color del texto del estado es obligatorio'),
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
      field: 'table_header',
      header: 'Cabecera de tabla',
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
      field: 'state_color',
      header: 'Color del estado',
      sortable: false,
      alignHeaders: 'center',
      alignItems: 'center',
    },
    {
      field: 'text_color',
      header: 'Color del texto del estado',
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

  const globalStatus = ref<GlobalStatusResponse[] | undefined>([]);
  const pagination = reactive({
    page: 1,
    per_page: 10,
    total_items: 0,
  });
  const { startLoading, finishLoading } = useLoaderStore();
  const alert = useAlertStore();

  const [id, idAttrs] = defineField('id');
  const [table_header, tableHeaderAttrs] = defineField('table_header');
  const [name, nameAttrs] = defineField('name');
  const [description, descriptionAttrs] = defineField('description');
  //const [active, activeAttrs] = defineField('active');
  const [state_color, stateColorAttrs] = defineField('state_color');
  const [text_color, textColorAttrs] = defineField('text_color');

  const filter_name = ref<string | null>(null);
  const findRegex = /[^a-zA-ZáÁéÉíÍóÓúÚñÑ.0-9_ ]/g;

  const getGlobalStatus = async () => {
    try {
      startLoading();
      const filter = {
        page: pagination.page,
        per_page: pagination.per_page,
        filter: filter_name.value,
      };
      const response = await catalogServices.getGlobalStatus(filter);

      if (response.statusCode === 200) {
        globalStatus.value = response.data.data;
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

  const addGlobalStatus = async (form: GlobalStatusForm) => {
    try {
      startLoading();
      const response = await catalogServices.postGlobalStatus({
        ...form,
        active: true,
      });
      if (response.status === 201) {
        getGlobalStatus();
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

  const editGlobalStatus = async (form: GlobalStatusForm) => {
    try {
      startLoading();
      const { id, ...body } = form;
      console.log('body', body);
      const response = await catalogServices.putGlobalStatus(id!, body);
      if (response.status === 200) {
        getGlobalStatus();
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

  const deleteGlobalStatus = async (id: number) => {
    try {
      startLoading();
      const response = await catalogServices.deleteGlobalStatus(id);
      if (response.status === 200) {
        getGlobalStatus();
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
    getGlobalStatus();
  };

  const setGlobalStatusItem = (value: GlobalStatusResponse) => {
    setFieldValue('table_header', value?.table_header);
    setFieldValue('id', value?.id);
    setFieldValue('name', value?.name);
    setFieldValue('description', value?.description);
    setFieldValue('active', value?.active);
    setFieldValue('state_color', value?.state_color);
    setFieldValue('text_color', value?.text_color);
  };

  const findGlobalStatus = (value: string | null) => {
    if (value) {
      getGlobalStatus();
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
    validateAlphaInput,
    cleanSearch,
    setGlobalStatusItem,
    findGlobalStatus,
    id,
    idAttrs,
    name,
    nameAttrs,
    description,
    descriptionAttrs,
    table_header,
    tableHeaderAttrs,
    state_color,
    stateColorAttrs,
    text_color,
    textColorAttrs,
    alert,
    filter_name,
    pagination,
    globalStatus,
    getGlobalStatus,
    addGlobalStatus,
    editGlobalStatus,
    deleteGlobalStatus,
  };
}
