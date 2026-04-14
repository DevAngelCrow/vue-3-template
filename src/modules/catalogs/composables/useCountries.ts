import { useForm } from 'vee-validate';
import * as yup from 'yup';

import { useAlertStore, useLoaderStore } from '@/core/store';

import { CreateCountry } from '../interfaces/country.create.interface';
import catalogServices from '../Services/catalog.services';
import { UpdateCountry } from '../interfaces/country.update.interface';
import { nextTick, reactive } from 'vue';
import { sanitizedValueInput } from '@/core/utils/inputTextValidations';

type filterType = { filter_name: string | null; status: boolean | null };

export function useCountries() {
  const alert = useAlertStore();
  const { startLoading, finishLoading } = useLoaderStore();
  const getCountries = async () => {
    try {
      const params: {
        page?: number;
        per_page?: number;
        filter_name?: string | null;
        status?: boolean | null;
      } = {
        page: pagination.page,
        per_page: pagination.per_page,
        filter_name: filter.filter_name,
        status: filter.status,
      };
      const response = await catalogServices.getAllCountries({...params});
      if (response.statusCode === 200) {
        pagination.page = response.data.current_page;
        pagination.per_page = response.data.per_page;
        pagination.total_items = response.data.total_items;
        return response.data.data;
      }
    } catch (error) {
      console.error('Error al obtener el listado de países', error);
    }
  };

  const createCountry = async (data: CreateCountry) => {
    try {
      const response = await catalogServices.createCountries(data);
      if (response.status === 201) {
        const newCountry = response.data;
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

  const updateCountry = async (id: number, data: UpdateCountry) => {
    try {
      const response = await catalogServices.updateCountries(id, data);
      if (response.status === 200) {
        const updatedCountry = response.data;
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
  const changeStatusCountry = async (id: number) => {
    try {
      const response = await catalogServices.changeStatusCountry(id);
      if (response.status === 200) {
        const updatedCountry = response.data;
        return updatedCountry;
      }
    } catch (error) {
      console.error(error);
      alert.showAlert({
        type: 'error',
        title: 'Error en el cambio de estado del país',
        content: 'Ocurrió un error al momento de cambiar el estado del país',
      });
    }
  }
  const findCountries = async (value: filterType) => {
    if (value.filter_name || value.status !== null) {
      startLoading();
      const items = await getCountries();
      finishLoading();
      return items;
    }
  }
  const { handleSubmit, validateField, defineField, errors, resetForm } =
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
          .max(150, 'El nombre no puede tener más de 150 caracteres')
          .matches(/^[a-zA-ZáÁéÉíÍóÓúÚñÑ ]*$/, 'No caracteres invalidos')
          .transform(
            value => value?.replace(/[^a-zA-ZáÁéÉíÍóÓúÚñÑ ]/g, '') || '',
          ),
        abbreviation: yup
          .string()
          .required('La abreviación es obligatoria')
          .min(2, 'La abreviación debe tener al menos 2 caracteres')
          .max(150, 'La abreviación no puede tener más de 150 caracteres')
          .matches(/^[a-zA-ZáÁéÉíÍóÓúÚñÑ ]*$/, 'No caracteres invalidos')
          .transform(
            value => value?.replace(/[^a-zA-ZáÁéÉíÍóÓúÚñÑ ]/g, '') || '',
          ),
        code: yup
          .string()
          .required('El código es obligatorio')
          .min(3, 'El código debe tener al menos 3 caracteres')
          .max(150, 'El código no puede tener más de 150 caracteres')
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
  const filter = reactive<filterType>({
    filter_name: null,
    status: null,
  });
  const pagination = reactive({
    page: 1,
    per_page: 10,
    total_items: 0,
  });
  const findRegex = /[^a-zA-ZáÁéÉíÍóÓúÚñÑ.0-9 ]/g;
  const validateAlphaInput = (
    value: string | null | undefined,
    regex: RegExp = findRegex,
  ) => {
    if (!value) {
      value = '';
    }
    const sanitizedValue = sanitizedValueInput(value, regex);
    nextTick(() => {
      filter.filter_name = sanitizedValue;
    });
  };

  const cleanSearch = () => {
    if ((!filter.filter_name || filter.filter_name === '') && filter.status === null) {
      return;
    }
    filter.filter_name = null;
    filter.status = null;
    return getCountries();
  };
  return {
    getCountries,
    createCountry,
    updateCountry,
    changeStatusCountry,
    handleSubmit,
    validateField,
    findCountries,
    validateAlphaInput,
    cleanSearch,
    // Agregar los campos del formulario
    name,
    nameAttrs,
    abbreviation,
    abbreviationAttrs,
    code,
    codeAttrs,
    errors,
    resetForm,
    filter,
    pagination,
  };
}
