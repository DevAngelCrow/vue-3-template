import { useForm } from 'vee-validate';
import * as yup from 'yup';
import { nextTick, ref } from 'vue';

import adminServices from '@/core/services/index.services';
import { useAlertStore, useLoaderStore } from '@/core/store';
import { sanitizedValueInput } from '@/core/utils/inputTextValidations';

import { RouteForm } from '../interfaces/route-form.interface';
import { RouteParentAutocomplete } from '../interfaces/route-parent-autocomplete-obj.interface';
import { RoutesResponse } from '../interfaces/routes.response.interface';

export function useAdmin() {
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
      name: yup
        .string()
        .required('El nombre de la ruta es requerido')
        .min(4, 'El nombre debe tener al menos 3 caracteres'),
      title: yup
        .string()
        .required('El título de la ruta es requerido')
        .min(3, 'El título debe tener al menos 3 caracteres'),
      uri: yup
        .string()
        .required('El campo uri es requerido')
        .min(4, 'El campo uri debe tener al menos 3 caracteres')
        .test(
          'valid_uri',
          'El nombre de la uri no es del formato valido',
          value => {
            if (routeValidRegex.test(value)) {
              return true;
            }
            return false;
          },
        ),
      description: yup.string(),
      order: yup
        .number()
        .typeError('El campo debe ser de tipo entero')
        .required('El campo es requerido'),
      icon: yup.string().min(2),
      child_route: yup.boolean(),
      show: yup.boolean(),
      parent_route: yup.mixed<RouteParentAutocomplete>().when('child_route', {
        is: true,
        then: schema => schema.required('El campo de ruta padre es requerido'),
        otherwise: schema => schema.nullable().notRequired(),
      }),
    }),
  });

  const parentRoutes = ref<
    { title: string; id: number; uri: string; name: string }[]
  >([]);

  const page = ref<number>(1);
  const per_page = ref<number>(10);
  const total_items = ref<number>(0);
  const items = ref<RoutesResponse[] | undefined>([]);

  const { startLoading, finishLoading } = useLoaderStore();
  const alert = useAlertStore();

  const [name, nameAttrs] = defineField('name');
  const [title, titleAttrs] = defineField('title');
  const [uri, uriAttrs] = defineField('uri');
  const [description, descriptionAttrs] = defineField('description');
  const [order, orderAttrs] = defineField('order');
  const [icon, iconAttrs] = defineField('icon');
  const [child_route, child_routeAttrs] = defineField('child_route');
  const [show, showAttrs] = defineField('show');
  const [parent_route, parent_routeAttrs] = defineField('parent_route');

  const filter_name = ref<string | null>(null);
  const invalidRouteRegex = /[^A-Za-z0-9\-/]/g;
  const routeValidRegex =
    /^(?:\/|\/[A-Za-z0-9]+(?:-[A-Za-z0-9]+)*(?:\/[A-Za-z0-9]+(?:-[A-Za-z0-9]+)*)*)$/;

  const findRegex = /[^a-zA-ZáÁéÉíÍóÓúÚñÑ.0-9 ]/g;
  const getRoutes = async () => {
    try {
      startLoading();
      let filter = {
        page: page.value,
        per_page: per_page.value,
        filter_name: filter_name.value,
      };
      const response = await adminServices.getAllRoutes(filter);
      const secondResponse = await adminServices.getAllRoutesWithOutPaginate();
      if (secondResponse.statusCode === 200) {
        parentRoutes.value = secondResponse.data
          .filter(
            item =>
              item.parent_route === null || item.parent_route === undefined,
          )
          .map(item => ({
            title: item.title,
            id: item.id,
            uri: item.uri,
            name: item.name,
          }));
      }
      if (response.statusCode === 200) {
        page.value = response.data.pagination.currentPage;
        per_page.value = response.data.pagination.perPage;
        total_items.value = response.data.pagination.totalItems;
        items.value = response.data.items;
      }
      return [];
    } catch (error) {
      console.error('Error al obtener el listado de rutas', error);
    } finally {
      finishLoading();
    }
  };

  const addRoute = async (form: RouteForm) => {
    try {
      const response = await adminServices.addRoute(form);
      if (response.status === 201) {
        getRoutes();
        alert.showAlert({
          type: 'success',
          title: `${response.data.message}`,
          show: true,
        });
        return response.data;
      }
    } catch (error) {
      console.error(error);
    }
  };

  const validateInputUri = (
    value: string,
    input: string,
    regex: RegExp = invalidRouteRegex,
  ) => {
    const sanitizedValue = sanitizedValueInput(value, regex);

    if (!routeValidRegex.test(sanitizedValue)) {
      console.error('Ruta invalida', sanitizedValue);
    }
    nextTick(() => {
      setFieldValue(input, sanitizedValue);
    });
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
    getRoutes();
  };

  const viewRoute = (value: RoutesResponse) => {
    name.value = value?.name;
    title.value = value?.title;
    uri.value = value?.uri;
    description.value = value?.description;
    order.value = value?.order.toString();
    icon.value = value?.icon;
    parent_route.value = value?.parent_route;
    child_route.value = parent_route.value ? true : false;
    show.value = value?.show;
  };

  const setEditRoute = (value: RoutesResponse) => {
    name.value = value?.name;
    title.value = value?.title;
    uri.value = value?.uri;
    description.value = value?.description;
    order.value = value?.order.toString();
    icon.value = value?.icon;
    parent_route.value = value?.parent_route;
    child_route.value = parent_route.value ? true : false;
    show.value = value?.show;
  };

  return {
    getRoutes,
    addRoute,
    name,
    nameAttrs,
    title,
    titleAttrs,
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
    resetForm,
    resetField,
    setFieldError,
    page,
    per_page,
    total_items,
    items,
    validateInputUri,
    filter_name,
    validateAlphaInput,
    cleanSearch,
    viewRoute,
    setEditRoute,
  };
}
