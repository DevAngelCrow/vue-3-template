import adminServices from '@/core/services/index.services';
// import { useForm } from 'vee-validate';
// import * as yup from "yup";

export function useAdmin() {
  // const { errors, defineField, handleSubmit, validateField } = useForm({
  //   validationSchema: yup.object({

  //   })
  // });

  const getRoutes = async () => {
    try {
      const response = await adminServices.getAllRoutes();
      console.log(response);
      if (response.statusCode === 200) {
        return response.data.items;
      }
      return [];
    } catch (error) {
      console.error('Error al obtener el listado de rutas', error);
    }
  };

  return {
    getRoutes,
  };
}
