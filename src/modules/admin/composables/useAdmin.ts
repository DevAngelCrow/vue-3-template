import { useForm } from 'vee-validate';
import * as yup from 'yup';
import { ref } from 'vue';

import adminServices from '@/core/services/index.services';

import { RouteForm } from '../interfaces/route-form.interface';
import { RouteParentAutocomplete } from '../interfaces/route-parent-autocomplete-obj.interface';

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
      parent_route: yup.mixed<RouteParentAutocomplete>().when('child_route', {
        is: true,
        then: schema => schema.required('El campo de ruta padre es requerido'),
        otherwise: schema => schema.notRequired(),
      }),
    }),
  });

  const parentRoutes = ref<
    { title: string; id: number; uri: string; name: string }[]
  >([]);

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
      let filter = {
        page: 1,
        per_page: 10,
      };
      const response = await adminServices.getAllRoutes(filter);
      const secondResponse = await adminServices.getAllRoutesWithOutPaginate();
      if (secondResponse.statusCode === 200) {
        console.log(secondResponse, 'lista para autocomplete');
        parentRoutes.value = secondResponse.data
          .filter(
            item =>
              item.parent_route === null || item.parent_route === undefined,
          )
          .map(item => ({
            title: item.title, // O 'title' si la propiedad es 'title'
            id: item.id,
            uri: item.uri,
            name: item.name,
          }));
        console.log(parentRoutes.value, 'parentRoutes arreglados');
      }
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
    parentRoutes,
  };
}
