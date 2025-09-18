import { useForm } from 'vee-validate';
import * as yup from 'yup';

import adminServices from '@/core/services/index.services';

import { RouteForm } from '../interfaces/route-form.interface';

export function useAdmin() {
  const { errors, defineField, handleSubmit, validateField } = useForm({
    validationSchema: yup.object({
      name: yup
        .string()
        .required('El nombre de la ruta es requerido')
        .min(4, 'El nombre debe tener al menos 3 caracteres'),
      uri: yup
        .string()
        .required('El campo uri es requerido')
        .min(4, 'El campo uri debe tener al menos 3 caracteres'),
      description: yup.string(),
      order: yup.number(),
      icon: yup.string().min(2),
      child_route: yup.boolean(),
      show: yup.boolean(),
      parent_route: yup.number(),
    }),
  });

  const [name, nameAttrs] = defineField('name');
  const [uri, uriAttrs] = defineField('uri');
  const [description, descriptionAttrs] = defineField('description');
  const [order, orderAttrs] = defineField('order');
  const [icon, iconAttrs] = defineField('icon');
  const [child_route, child_routeAttrs] = defineField('child_route');
  const [show, showAttrs] = defineField('show');
  const [parent_route, parent_routeAttrs] = defineField('parent_route');

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

  const addRoute = async (form: RouteForm) => {
    console.log(form);
  };

  return {
    getRoutes,
    addRoute,
    name,
    nameAttrs,
    uri,
    uriAttrs,
    description,
    descriptionAttrs,
    order,
    orderAttrs,
    icon,
    iconAttrs,
    child_route,
    child_routeAttrs,
    show,
    showAttrs,
    parent_route,
    parent_routeAttrs,
    errors,
    handleSubmit,
    validateField,
  };
}
