import { useForm } from 'vee-validate';
import { nextTick, reactive, ref } from 'vue';
import * as yup from 'yup';

import { TableHeaders } from '@/core/interfaces';
import { useAlertStore, useLoaderStore } from '@/core/store';
import { sanitizedValueInput } from '@/core/utils/inputTextValidations';

import { Country } from '../interfaces/deparments/deparment.country.interface';
import { DepartmentResponse } from '../interfaces/deparments/department.response.interface';
import catalogServices from '../Services/catalog.services';
import { CountryResponse } from '../interfaces/country.response.interface';
import { DepartmentForm } from '../interfaces/deparments/deparment.form.interface';
export function useDepartment() {
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
        .required('El nombre del departamento es requerido')
        .min(3, 'El nombre de tener al menos 3 caracteres'),
      description: yup
        .string()
        .min(5, 'La descripción debe tener al menos 5 caracteres')
        .nullable(),
      country: yup.mixed<Country>().required('El campo del país es requerido'),
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
      field: 'country.name',
      header: 'País',
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

  const deparments = ref<DepartmentResponse[] | undefined>([]);
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
  const [country, countryAttrs] = defineField('country');
  const [active, activeAttrs] = defineField('active');

  const filter_name = ref<string | null>(null);
  const findRegex = /[^a-zA-ZáÁéÉíÍóÓúÚñÑ.0-9 ]/g;
  const countries = ref<CountryResponse[]>([]);

  const getCountries = async () => {
    try {
      startLoading();
      const response = await catalogServices.getAllCountries();
      if (response.statusCode === 200) {
        if (Array.isArray(response.data)) {
          countries.value = response.data;
        }
      }
    } catch (error) {
      console.error(error);
    } finally {
      finishLoading();
    }
  };
  const getDepartments = async () => {
    try {
      startLoading();
      const filter = {
        page: pagination.page,
        per_page: pagination.per_page,
        filter_name: filter_name.value,
      };
      const response = await catalogServices.getAllDepartments(filter);

      if (response.statusCode === 200) {
        deparments.value = response.data.items;
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

  const addDepartment = async (form: DepartmentForm) => {
    try {
      startLoading();
      const response = await catalogServices.postDepartment(form);
      if (response.status === 201) {
        getDepartments();
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

  const editDepartment = async (form: DepartmentForm) => {
    try {
      startLoading();
      const response = await catalogServices.putDepartment(form);
      if (response.status === 200) {
        getDepartments();
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

  const deleteDepartment = async (id: number) => {
    try {
      startLoading();
      const response = await catalogServices.deleteDepartment(id);
      if (response.status === 200) {
        getDepartments();
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
    getDepartments();
  };

  const setDepartmenItem = (value: DepartmentResponse) => {
    setFieldValue('id', value?.id);
    setFieldValue('name', value?.name);
    setFieldValue('description', value?.description);
    setFieldValue('active', value?.active);
    setFieldValue('country', value?.country);
  };

  const findDepartment = (value: string | null) => {
    if (value) {
      getDepartments();
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
    getDepartments,
    validateAlphaInput,
    cleanSearch,
    setDepartmenItem,
    findDepartment,
    getCountries,
    id,
    idAttrs,
    name,
    nameAttrs,
    description,
    descriptionAttrs,
    active,
    activeAttrs,
    country,
    countryAttrs,
    alert,
    filter_name,
    pagination,
    countries,
    deparments,
    addDepartment,
    editDepartment,
    deleteDepartment,
  };
}
