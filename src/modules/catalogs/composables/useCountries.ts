import { useForm } from 'vee-validate';
import * as yup from 'yup';

import { useAlertStore } from '@/core/store';

import { CreateCountry } from '../interfaces/country.create.interface';
import catalogServices from '../Services/catalog.services';
import { UpdateCountry } from '../interfaces/country.update.interface';

export function useCountries() {
  const alert = useAlertStore();
  const getCountries = async () => {
    try {
      const response = await catalogServices.getAllCountries();
      if (response.statusCode === 200) {
        return response.data;
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
    // Agregar los campos del formulario
    name,
    nameAttrs,
    abbreviation,
    abbreviationAttrs,
    code,
    codeAttrs,
    errors,
    resetForm,
  };
}
