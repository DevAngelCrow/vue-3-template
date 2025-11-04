import { useForm } from 'vee-validate';
import * as yup from 'yup';
import { nextTick, reactive, ref } from 'vue';

import adminServices from '@/core/services/index.services';
import { useAlertStore, useLoaderStore } from '@/core/store';
import { sanitizedValueInput } from '@/core/utils/inputTextValidations';
import { TableHeaders } from '@/core/interfaces';

import { RouteForm } from '../interfaces/routes/route-form.interface';
import { RouteParentAutocomplete } from '../interfaces/routes/route-parent-autocomplete-obj.interface';
import { RoutesResponse } from '../interfaces/routes/routes.response.interface';

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
      id: yup.number().typeError('El campo id debe ser de tipo entero'),
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
      active: yup.boolean(),
      parent_route: yup.mixed<RouteParentAutocomplete>().when('child_route', {
        is: true,
        then: schema => schema.required('El campo de ruta padre es requerido'),
        otherwise: schema => schema.nullable().notRequired(),
      }),
      permissions_ids: yup.array(),
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
      field: 'icon',
      header: 'Ícono',
      sortable: false,
      alignHeaders: 'center',
      alignItems: 'center',
    },
    {
      field: 'uri',
      header: 'Uri',
      sortable: false,
      alignHeaders: 'center',
      alignItems: 'center',
    },
    {
      field: 'show',
      header: 'Mostrar en menú',
      sortable: false,
      alignHeaders: 'center',
      alignItems: 'center',
    },
    {
      field: 'order',
      header: 'Orden',
      sortable: false,
      alignHeaders: 'center',
      alignItems: 'center',
    },
    {
      field: 'parent_route.uri',
      header: 'Ruta padre',
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

  const headerPermissions = ref<TableHeaders[]>([
    {
      field: 'state',
      header: 'Seleccion',
      sortable: false,
      alignHeaders: 'center',
      alignItems: 'center',
      width: 10,
    },
    {
      field: 'name',
      header: 'Nombre',
      sortable: false,
      alignHeaders: 'start',
      alignItems: 'start',
    },
  ]);

  const parentRoutes = ref<
    { title: string; id: number; uri: string; name: string }[]
  >([]);

  const items = ref<RoutesResponse[] | undefined>([]);
  const pagination = reactive({
    page: 1,
    per_page: 10,
    total_items: 0,
  });
  const permissionsPagination = reactive({
    page: 1,
    per_page: 5,
    total_items: 0,
  });
  const { startLoading, finishLoading } = useLoaderStore();
  const alert = useAlertStore();

  const [id, idAttrs] = defineField('id');
  const [name, nameAttrs] = defineField('name');
  const [title, titleAttrs] = defineField('title');
  const [uri, uriAttrs] = defineField('uri');
  const [description, descriptionAttrs] = defineField('description');
  const [order, orderAttrs] = defineField('order');
  const [icon, iconAttrs] = defineField('icon');
  const [child_route, child_routeAttrs] = defineField('child_route');
  const [show, showAttrs] = defineField('show');
  const [active, activeAttrs] = defineField('active');
  const [parent_route, parent_routeAttrs] = defineField('parent_route');
  const [permissions_ids, permissions_idsAttrs] =
    defineField('permissions_ids');

  const filter_name = ref<string | null>(null);
  const filter_permission_name = ref<string | null>(null);
  const invalidRouteRegex = /[^A-Za-z0-9\-/]/g;
  const routeValidRegex =
    /^(?:\/|\/[A-Za-z0-9]+(?:-[A-Za-z0-9]+)*(?:\/[A-Za-z0-9]+(?:-[A-Za-z0-9]+)*)*)$/;

  const findRegex = /[^a-zA-ZáÁéÉíÍóÓúÚñÑ.0-9 ]/g;

  const permissionsList = ref<
    {
      id: number;
      name: string;
      description: string;
      active: boolean;
    }[]
  >([]);

  const getRoutes = async () => {
    try {
      startLoading();
      const filter = {
        page: pagination.page,
        per_page: pagination.per_page,
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
        pagination.page = response.data.pagination.currentPage;
        pagination.per_page = response.data.pagination.perPage;
        pagination.total_items = response.data.pagination.totalItems;
        items.value = response.data.items;
      }
      return [];
    } catch (error) {
      console.error('Error al obtener el listado de rutas', error);
    } finally {
      finishLoading();
    }
  };
  const getRouteById = async (id: number) => {
    try {
      startLoading();
      permissionsList.value = [];
      permissionsPagination.per_page = 0;
      permissionsPagination.total_items = 0;
      const response = await adminServices.getRoute(id);
      if (response.statusCode === 200) {
        permissionsList.value = response.data.permissions
          ? response.data.permissions
          : [];
        permissionsPagination.per_page = 5;
        permissionsPagination.total_items = response.data.permissions.length;
      }
    } catch (error) {
      console.error(error);
    } finally {
      finishLoading();
    }
  };
  const addRoute = async (form: RouteForm) => {
    try {
      startLoading();
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
    } finally {
      finishLoading();
    }
  };
  const editRoute = async (form: RouteForm) => {
    try {
      startLoading();
      const response = await adminServices.editRoute(form);
      if (response.status === 200) {
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
    } finally {
      finishLoading();
    }
  };

  const deleteRoute = async (id: number) => {
    try {
      startLoading();
      const response = await adminServices.deleteRoute(id);
      if (response.status === 200) {
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
    } finally {
      finishLoading();
    }
  };

  const findPermission = (value: string | null) => {
    if (value) {
      getPermissions();
    }
  };
  const getPermissions = async () => {
    try {
      startLoading();
      const filter = {
        page: permissionsPagination.page,
        per_page: permissionsPagination.per_page,
        filter_name: filter_permission_name.value
          ? filter_permission_name.value
          : null,
        active: 1,
      };
      const response = await adminServices.getPermissions(filter);
      if (response.statusCode === 200) {
        permissionsList.value = response.data.items;
        permissionsPagination.page = response.data.pagination.currentPage;
        permissionsPagination.per_page = response.data.pagination.perPage;
        permissionsPagination.total_items = response.data.pagination.totalItems;
      }
    } catch (error) {
      console.error(error);
    } finally {
      finishLoading();
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

  const setRouteItem = (value: RoutesResponse) => {
    setFieldValue('id', value?.id);
    setFieldValue('name', value?.name);
    setFieldValue('title', value?.title);
    setFieldValue('uri', value?.uri);
    setFieldValue('description', value?.description);
    setFieldValue('order', value?.order);
    setFieldValue('icon', value?.icon);
    setFieldValue('parent_route', value?.parent_route);
    setFieldValue('child_route', parent_route.value ? true : false);
    setFieldValue('show', value?.show);
    setFieldValue('active', value.active);
    setFieldValue(
      'permissions_ids',
      value.permissions?.length
        ? value.permissions.map(permission => permission.id)
        : [],
    );
  };

  const findRoute = (value: string | null) => {
    if (value) {
      getRoutes();
    }
  };
  return {
    getRoutes,
    addRoute,
    editRoute,
    deleteRoute,
    getRouteById,
    id,
    idAttrs,
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
    active,
    activeAttrs,
    parent_route,
    parent_routeAttrs,
    permissions_ids,
    permissions_idsAttrs,
    errors,
    handleSubmit,
    validateField,
    parentRoutes,
    resetForm,
    resetField,
    setFieldError,
    items,
    validateInputUri,
    filter_name,
    validateAlphaInput,
    cleanSearch,
    setRouteItem,
    findRoute,
    pagination,
    headers,
    getPermissions,
    permissionsList,
    headerPermissions,
    permissionsPagination,
    findPermission,
    filter_permission_name,
  };
}
