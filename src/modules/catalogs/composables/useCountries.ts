import { useAlertStore } from "@/core/store";

import { CreateCountry } from "../interfaces/country.create.interface";
import catalogServices from "../Services/catalog.services";
import { useForm } from "vee-validate";
import * as yup from 'yup';


export function useCountries() {
    const alert = useAlertStore();
    const getCountries = async () => {
        try {
            const response = await catalogServices.getAllCountries();
            console.log(response);
            if (response.statusCode === 200) {
                return response.data.items;
            }
        } catch (error) {
            console.error('Error al obtener el listado de países', error); 
        }
    }

    const createCountry = async (data: CreateCountry) => {
        try {
          const response = await catalogServices.createCountries(data);
          console.log(response, 'response');
          if(response.status === 201) {
            const newCountry = response.data;
            return newCountry;
          }
        } catch (error) {
            console.error(error);
            alert.showAlert({
                type: 'error',
                title: 'Error en el registro de pais',
                content: 'Ocurrió un error al momento del registro del usuario'
            });
        }
    };

    const { handleSubmit, validateField, defineField } = useForm({
        validationSchema: yup.object({
            // Validación para los campos del formulario
            nombre: yup
              .string()
              .required('El nombre es obligatorio')
              .min(3, 'El nombre debe tener al menos 3 caracteres')
              .matches(/^[a-zA-ZáÁéÉíÍóÓúÚñÑ ]*$/, 'No caracteres invalidos')
              .transform(
                value => value?.replace(/[^a-zA-ZáÁéÉíÍóÓúÚñÑ ]/g, '') || '',
              ),
            abreviación: yup
            .string().required('La abreviación es obligatoria')
            .min(2, 'La abreviación debe tener al menos 2 caracteres')
            .matches(/^[a-zA-ZáÁéÉíÍóÓúÚñÑ ]*$/, 'No caracteres invalidos')
            .transform(
                value => value?.replace(/[^a-zA-ZáÁéÉíÍóÓúÚñÑ ]/g, '') || '',
            ),
            code: yup
            .string().required('El código es obligatorio')
            .required('El código es obligatorio')
            .min(2, 'El código debe tener al menos 2 caracteres')
            .matches(/^[a-zA-ZáÁéÉíÍóÓúÚñÑ ]*$/, 'No caracteres invalidos')
            .transform(
              value => value?.replace(/[^a-zA-ZáÁéÉíÍóÓúÚñÑ ]/g, '') || '',
            )
        }),
    });
  // Definir los campos del formulario
    const [name, nameAttrs] = defineField('nombre');
    const [abbreviation, abbreviationAttrs] = defineField('abreviación');
    const [code, codeAttrs] = defineField('código');

    return {
        getCountries,
        createCountry,
        handleSubmit,
        validateField,
        // Agregar los campos del formulario
        name,
        nameAttrs,
        abbreviation,
        abbreviationAttrs,
        code,
        codeAttrs,
    }
    

}