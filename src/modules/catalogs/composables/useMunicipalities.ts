import { useForm } from 'vee-validate';
import { nextTick, reactive, ref } from 'vue';
import * as yup from 'yup';

import { TableHeaders } from '@/core/interfaces';
import { useAlertStore, useLoaderStore } from '@/core/store';
import { sanitizedValueInput } from '@/core/utils/inputTextValidations';

import catalogServices from '../Services/catalog.services';
import { CountryResponse } from '../interfaces/country.response.interface';
import { MunicipalityResponse } from '../interfaces/municipalities/municipality.response.interface';
import { MunicipalityForm } from '../interfaces/municipalities/municipality.form.interface';
import { Department } from '../interfaces/municipalities/municipality.department.interface';
export function useMunicipality() {
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
      department: yup
        .mixed<Department>()
        .required('El campo de departamento es requerido'),
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
      field: 'department.name',
      header: 'Departamento',
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

  const municipalities = ref<MunicipalityResponse[] | undefined>([]);
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
  const [department, departmentAttrs] = defineField('department');
  const [active, activeAttrs] = defineField('active');

  const filter_name = ref<string | null>(null);
  const findRegex = /[^a-zA-ZáÁéÉíÍóÓúÚñÑ.0-9 ]/g;
  const departments = ref<CountryResponse[]>([]);

  const getDepartments = async () => {
    try {
      startLoading();
      const response = await catalogServices.getAllDepartments();
      if (response.statusCode === 200) {
        if (Array.isArray(response.data)) {
          departments.value = response.data;
        }
      }
    } catch (error) {
      console.error(error);
    } finally {
      finishLoading();
    }
  };
  const getMunicipalities = async () => {
    try {
      startLoading();
      const filter = {
        page: pagination.page,
        per_page: pagination.per_page,
        filter: filter_name.value,
      };
      const response = await catalogServices.getMunicipalities(filter);

      if (response.statusCode === 200) {
        municipalities.value = response.data.data;
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

  const addMunicipality = async (form: MunicipalityForm) => {
    try {
      startLoading();
      const response = await catalogServices.postMunicipality({
        ...form,
        active: true,
      });
      if (response.status === 201) {
        getMunicipalities();
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

  const editMunicipality = async (form: MunicipalityForm) => {
    try {
      startLoading();
      const { id, ...body } = form;
      const response = await catalogServices.putMunicipality(id!, body);
      if (response.status === 200) {
        getMunicipalities();
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

  const deleteMunicipality = async (id: number) => {
    try {
      startLoading();
      const response = await catalogServices.deleteMunicipality(id);
      if (response.status === 200) {
        getMunicipalities();
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
    getMunicipalities();
  };

  const setMunicipalityItem = (value: MunicipalityResponse) => {
    setFieldValue('id', value?.id);
    setFieldValue('name', value?.name);
    setFieldValue('description', value?.description);
    setFieldValue('active', value?.active);
    setFieldValue('department', value?.department);
  };

  const findMunicipality = (value: string | null) => {
    if (value) {
      getMunicipalities();
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
    setMunicipalityItem,
    findMunicipality,
    id,
    idAttrs,
    name,
    nameAttrs,
    description,
    descriptionAttrs,
    active,
    activeAttrs,
    department,
    departmentAttrs,
    alert,
    filter_name,
    pagination,
    departments,
    municipalities,
    getMunicipalities,
    addMunicipality,
    editMunicipality,
    deleteMunicipality,
  };
}
