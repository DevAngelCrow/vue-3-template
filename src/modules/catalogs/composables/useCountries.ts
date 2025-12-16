import { useForm } from 'vee-validate';
import * as yup from 'yup';
import { nextTick, reactive, ref } from 'vue';

import { useAlertStore, useLoaderStore } from '@/core/store';

import { CreateCountry } from '../interfaces/country.create.interface';
import catalogServices from '../Services/catalog.services';
import { UpdateCountry } from '../interfaces/country.update.interface';
import { CountryResponse } from '../interfaces/country.response.interface';
import { sanitizedValueInput } from '@/core/utils/inputTextValidations';

export function useCountries() {
  const alert = useAlertStore();
  const countries = ref<CountryResponse[]>([]);
  const pagination = reactive({
    page: 1,
    per_page: 10,
    total_items: 0,
  });
  const findRegex = /[^a-zA-ZáÁéÉíÍóÓúÚñÑ.0-9 ]/g;
  const filter_name = ref<string | null>(null);


  const { startLoading, finishLoading } = useLoaderStore();

  const getCountries = async () => {
    try {
      startLoading();
      const filter = {
        page: pagination.page || 1,
        per_page: pagination.per_page || 10,
        filter_name: filter_name.value,
      };
      const response = await catalogServices.getAllCountries(filter);
      if (response.statusCode === 200) {
        countries.value = response.data.items;
        pagination.page = response.data.pagination.currentPage || 1;
        pagination.per_page = response.data.pagination.perPage || 10;
        pagination.total_items = response.data.pagination.totalItems || 0;
      }
    } catch (error) {
      console.error('Error al obtener el listado de países', error);
    } finally {
      finishLoading();
    }
  };

  const createCountry = async (data: CreateCountry) => {
    try {
      const response = await catalogServices.createCountries(data);
      if (response.status === 201) {
        const newCountry = response.data;
        // Automáticamente refrescar el listado manteniendo la paginación actual
        await getCountries();
        return newCountry;
      }
    } catch (error) {
      console.error(error);
      alert.showAlert({
        type: 'error',
        title: 'Error en el registro de pais',
        content: 'Ocurrió un error al momento del registro del usuario',
      });
    }
  };

  const updateCountry = async (data: UpdateCountry) => {
    try {
      const response = await catalogServices.updateCountries(data);
      if (response.status === 200) {
        const updatedCountry = response.data;
        // Automáticamente refrescar el listado manteniendo la paginación actual
        await getCountries();
        return updatedCountry;
      }
    } catch (error) {
      console.error(error);
      alert.showAlert({
        type: 'error',
        title: 'Error en la actualización de país',
        content: 'Ocurrió un error al momento de actualizar el país',
      });
    }
  };

  const setCountriesItem = (value: CountryResponse) => {
    setFieldValue('name', value?.name);
    setFieldValue('abbreviation', value?.abbreviation);
    setFieldValue('code', value?.code);
  };

  
  const findCountry = (value: string | null) => {
    if (value) {
      getCountries();
    }
  };

  const deleteCountry = async (id: number) => {
    try {
      startLoading();
      const response = await catalogServices.deleteCountry(id);
      if (response.status === 200) {
        getCountries();
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
    getCountries();
  };

  const { handleSubmit, validateField, defineField, errors, resetForm, setFieldValue } =
    useForm({
      validateOnMount: false,
      initialValues: {
        name: '',
        abbreviation: '',
        code: '',
      },
      validationSchema: yup.object({
        // Validación para los campos del formulario
        name: yup
          .string()
          .required('El nombre es obligatorio')
          .min(3, 'El nombre debe tener al menos 3 caracteres')
          .matches(/^[a-zA-ZáÁéÉíÍóÓúÚñÑ ]*$/, 'No caracteres invalidos')
          .transform(
            value => value?.replace(/[^a-zA-ZáÁéÉíÍóÓúÚñÑ ]/g, '') || '',
          ),
        abbreviation: yup
          .string()
          .required('La abreviación es obligatoria')
          .min(2, 'La abreviación debe tener al menos 2 caracteres')
          .matches(/^[a-zA-ZáÁéÉíÍóÓúÚñÑ ]*$/, 'No caracteres invalidos')
          .transform(
            value => value?.replace(/[^a-zA-ZáÁéÉíÍóÓúÚñÑ ]/g, '') || '',
          ),
        code: yup
          .string()
          .required('El código es obligatorio')
          .min(3, 'El código debe tener al menos 3 caracteres')
          .matches(
            /^[a-zA-ZáÁéÉíÍóÓúÚñÑ0-9 ]*$/,
            'Solo se permiten letras, números y espacios',
          )
          .transform(
            value => value?.replace(/[^a-zA-ZáÁéÉíÍóÓúÚñÑ0-9 ]/g, '') || '',
          ),
      }),
    });
  // Definir los campos del formulario
  const [name, nameAttrs] = defineField('name');
  const [abbreviation, abbreviationAttrs] = defineField('abbreviation');
  const [code, codeAttrs] = defineField('code');

  return {
    getCountries,
    createCountry,
    updateCountry,
    handleSubmit,
    validateField,
    countries,
    pagination,
    // Agregar los campos del formulario
    name,
    nameAttrs,
    abbreviation,
    abbreviationAttrs,
    code,
    codeAttrs,
    errors,
    resetForm,
    setCountriesItem,
    deleteCountry,
    validateAlphaInput,
    filter_name,
    findCountry,
    cleanSearch
  };
}
