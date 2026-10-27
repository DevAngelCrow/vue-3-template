import { computed, nextTick, reactive, ref, watch } from 'vue';
import { useForm } from 'vee-validate';
import * as yup from 'yup';
import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/vue-query';

import adminServices from '@/core/services/index.services';
import { useAlertStore } from '@/core/store';
import { debounce } from '@/core/utils/debounceFunction';
import { sanitizedValueInput } from '@/core/utils/inputTextValidations';
import { TableHeaders } from '@/core/interfaces';
import { createQueryKeys } from '@/core/utils/queryKeys';

import { RouteForm } from '../interfaces/routes/route-form.interface';
import { RouteParentAutocomplete } from '../interfaces/routes/route-parent-autocomplete-obj.interface';
import { RoutesResponse } from '../interfaces/routes/routes.response.interface';
import { CategoryPermissionsResponse } from '../interfaces/role/role.category-permisions.response.interface';

export type FilterRouteType = {
  filter_name?: string;
  active?: boolean;
  show?: boolean;
  id_parent?: string;
  required_auth?: boolean;
};

export const routeKeys = createQueryKeys<
  FilterRouteType & { page?: number; per_page?: number }
>('admin-routes');

export const parentRoutesKeys = createQueryKeys('admin-parent-routes');

export const routeDetailKeys = createQueryKeys<{ id: string }>(
  'admin-route-detail',
);

export const categoryPermissionsKeys = createQueryKeys<{ active?: boolean }>(
  'admin-category-permissions',
);

export function useAdmin() {
  const queryClient = useQueryClient();
  const alert = useAlertStore();

  const invalidRouteRegex = /[^A-Za-z0-9\-/]/g;
  const routeValidRegex =
    /^(?:\/|\/[A-Za-z0-9]+(?:-[A-Za-z0-9]+)*(?:\/[A-Za-z0-9]+(?:-[A-Za-z0-9]+)*)*)$/;
  const findRegex = /[^a-zA-ZáÁéÉíÍóÓúÚñÑ.0-9 ]/g;

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
      id: yup.string().typeError('El campo id debe ser de tipo string'),
      name: yup
        .string()
        .required('El nombre de la ruta es requerido')
        .max(150, 'El nombre no puede tener más de 150 caracteres')
        .min(4, 'El nombre debe tener al menos 3 caracteres'),
      title: yup
        .string()
        .required('El título de la ruta es requerido')
        .max(150, 'El título no puede tener más de 150 caracteres')
        .min(3, 'El título debe tener al menos 3 caracteres'),
      uri: yup
        .string()
        .required('El campo uri es requerido')
        .max(150, 'El uri no puede tener más de 150 caracteres')
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
      description: yup
        .string()
        .max(255, 'La descripción no puede tener más de 255 caracteres'),
      order: yup
        .number()
        .typeError('El campo debe ser de tipo entero')
        .required('El campo es requerido'),
      icon: yup
        .string()
        .min(2)
        .max(150, 'El icono no puede tener más de 255 caracteres'),
      child_route: yup.boolean(),
      show: yup.boolean(),
      active: yup.boolean(),
      parent: yup.mixed<RouteParentAutocomplete>().when('child_route', {
        is: true,
        then: schema => schema.required('El campo de ruta padre es requerido'),
        otherwise: schema => schema.nullable().notRequired(),
      }),
      permissions_ids: yup.array(),
      required_auth: yup.boolean(),
    }),
  });

  const headers = ref<TableHeaders[]>([
    {
      field: 'name',
      header: 'Nombre',
      sortable: false,
      alignHeaders: 'start',
      alignItems: 'start',
    },
    {
      field: 'description',
      header: 'Descripción',
      sortable: false,
      alignHeaders: 'start',
      alignItems: 'start',
    },
    {
      field: 'uri',
      header: 'Uri',
      sortable: false,
      alignHeaders: 'start',
      alignItems: 'start',
    },
    {
      field: 'parent.uri',
      header: 'Ruta padre',
      sortable: false,
      alignHeaders: 'start',
      alignItems: 'start',
    },
    {
      field: 'icon',
      header: 'Ícono',
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

  const pagination = reactive({
    page: 1,
    per_page: 10,
    total_items: 0,
  });

  const permissionsPagination = reactive({
    page: 1,
    per_page: 10,
    total_items: 0,
  });

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
  const [parent, parentAttrs] = defineField('parent');
  const [permissions_ids, permissions_idsAttrs] =
    defineField('permissions_ids');
  const [required_auth, required_authAttrs] = defineField('required_auth');

  const filter = reactive<FilterRouteType>({
    filter_name: undefined,
    active: undefined,
    show: undefined,
    id_parent: undefined,
    required_auth: undefined,
  });

  const appliedFilter = reactive<FilterRouteType>({
    filter_name: undefined,
    active: undefined,
    show: undefined,
    id_parent: undefined,
    required_auth: undefined,
  });

  const filter_permission = ref<{
    name: string;
    category?: {
      id: string;
      name: string;
      description: string;
    };
  }>({ name: '' });

  const permissionsList = ref<
    {
      id: string;
      name: string;
      description: string;
      active: boolean;
    }[]
  >([]);

  // Query principal paginada de rutas
  const {
    data: routesQueryResult,
    isPending,
    isFetching,
    refetch: refetchRoutes,
  } = useQuery({
    queryKey: computed(() =>
      routeKeys.list({
        page: pagination.page,
        per_page: pagination.per_page,
        filter_name: appliedFilter.filter_name || undefined,
        active: appliedFilter.active,
        show: appliedFilter.show,
        id_parent: appliedFilter.id_parent || undefined,
        required_auth: appliedFilter.required_auth,
      }),
    ),
    queryFn: async () => {
      const params = {
        page: pagination.page,
        per_page: pagination.per_page,
        name: appliedFilter.filter_name || undefined,
        active: appliedFilter.active,
        show: appliedFilter.show,
        id_parent: appliedFilter.id_parent,
        required_auth: appliedFilter.required_auth,
      };
      const response = await adminServices.getAllRoutes(params);
      if (response.statusCode === 200) {
        return response.data;
      }
      return null;
    },
    placeholderData: keepPreviousData,
  });

  watch(
    () => routesQueryResult.value,
    newData => {
      if (newData) {
        pagination.total_items = newData.total_items ?? 0;
      }
    },
    { immediate: true },
  );

  const items = computed<RoutesResponse[]>(
    () => routesQueryResult.value?.data ?? [],
  );

  // Query de rutas padre (sin paginar) para selección en formularios y filtros
  const { data: parentRoutesData, refetch: refetchParentRoutes } = useQuery({
    queryKey: computed(() => parentRoutesKeys.all),
    queryFn: async () => {
      const response = await adminServices.getAllRoutesWithOutPaginate();
      if (response.statusCode === 200 && response.data) {
        return response.data
          .filter(item => item.parent === null || item.parent === undefined)
          .map(item => ({
            title: item.title,
            id: item.id,
            uri: item.uri,
            name: item.name,
          }));
      }
      return [];
    },
    staleTime: 1000 * 60 * 10,
  });

  const parentRoutes = computed(
    () => parentRoutesData.value ?? [],
  );

  // Query de categorías de permisos
  const { data: categoriesData, refetch: refetchCategories } = useQuery({
    queryKey: computed(() => categoryPermissionsKeys.list({ active: true })),
    queryFn: async () => {
      const response = await adminServices.getCategoryPermissions({
        active: true,
      });
      if (response.statusCode === 200 && response.data) {
        return response.data.data;
      }
      return [];
    },
    staleTime: 1000 * 60 * 10,
  });

  const categories = computed<CategoryPermissionsResponse[]>(
    () => categoriesData.value ?? [],
  );

  // Mutaciones TanStack Query
  const addRouteMutation = useMutation({
    mutationFn: (form: RouteForm) => {
      if (form.id_parent) {
        form.uri = `${form.uri}`;
      }
      return adminServices.addRoute({ ...form, active: true });
    },
    onSuccess: response => {
      if (response.status === 201) {
        queryClient.invalidateQueries({ queryKey: routeKeys.all });
        queryClient.invalidateQueries({ queryKey: parentRoutesKeys.all });
        alert.showAlert({
          type: 'success',
          title: `${response.data.message}`,
          show: true,
        });
      }
    },
    onError: error => {
      console.error('Error al agregar ruta:', error);
    },
  });

  const editRouteMutation = useMutation({
    mutationFn: ({
      id,
      body,
    }: {
      id: string;
      body: Omit<RouteForm, 'id'>;
    }) => adminServices.editRoute(id, body),
    onSuccess: response => {
      if (response.status === 200) {
        queryClient.invalidateQueries({ queryKey: routeKeys.all });
        queryClient.invalidateQueries({ queryKey: parentRoutesKeys.all });
        queryClient.invalidateQueries({ queryKey: routeDetailKeys.all });
        alert.showAlert({
          type: 'success',
          title: `${response.data.message}`,
          show: true,
        });
      }
    },
    onError: error => {
      console.error('Error al editar ruta:', error);
    },
  });

  const toggleRouteMutation = useMutation({
    mutationFn: (id: string) => adminServices.toggleRoute(id),
    onSuccess: response => {
      if (response.status === 200) {
        queryClient.invalidateQueries({ queryKey: routeKeys.all });
        queryClient.invalidateQueries({ queryKey: parentRoutesKeys.all });
        alert.showAlert({
          type: 'success',
          title: `${response.data.message}`,
          show: true,
        });
      }
    },
    onError: error => {
      console.error('Error al alternar estado de ruta:', error);
    },
  });

  const addRoute = async (form: RouteForm) => {
    try {
      const response = await addRouteMutation.mutateAsync(form);
      return response.data;
    } catch (error) {
      console.error(error);
      return undefined;
    }
  };

  const editRoute = async (form: RouteForm) => {
    try {
      const { id, ...body } = form;
      const response = await editRouteMutation.mutateAsync({
        id: id!,
        body,
      });
      return response.data;
    } catch (error) {
      console.error(error);
      return undefined;
    }
  };

  const toggleRoute = async (id: string) => {
    try {
      const response = await toggleRouteMutation.mutateAsync(id);
      return response.data;
    } catch (error) {
      console.error(error);
      return undefined;
    }
  };

  const getRoutes = async () => {
    const result = await refetchRoutes();
    return result.data?.data || [];
  };

  const loadParentRoutes = async () => {
    const result = await refetchParentRoutes();
    return result.data || [];
  };

  const getCategoryPermissions = async () => {
    const result = await refetchCategories();
    return result.data || [];
  };

  const getRouteById = async (id: string) => {
    try {
      permissionsList.value = [];
      permissionsPagination.per_page = 0;
      permissionsPagination.total_items = 0;
      const response = await adminServices.getRoute(id);
      if (response.statusCode === 200) {
        permissionsList.value = response.data.permissions
          ? response.data.permissions
          : [];
        permissionsPagination.per_page = 10;
        permissionsPagination.total_items = response?.data?.permissions?.length;
      }
      return response;
    } catch (error) {
      console.error('Error al obtener ruta por ID:', error);
      return null;
    }
  };

  const getPermissions = async () => {
    try {
      const filterParams = {
        page: permissionsPagination.page,
        per_page: permissionsPagination.per_page,
        name: filter_permission.value.name
          ? filter_permission.value.name
          : undefined,
        category_permission_id: filter_permission.value.category?.id,
        active: true,
      };
      const response = await adminServices.getPermissions(filterParams);
      if (response.statusCode === 200) {
        permissionsList.value = response.data.data;
        permissionsPagination.page = response.data.current_page;
        permissionsPagination.per_page = response.data.per_page;
        permissionsPagination.total_items = response.data.total_items;
      }
    } catch (error) {
      console.error('Error al obtener permisos:', error);
    }
  };

  const findPermission = (value: {
    name: string;
    category?: {
      id: string;
      name: string;
      description: string;
    };
  }) => {
    if (value) {
      getPermissions();
    }
  };

  const validateInputUri = (
    value: string,
    input: string,
    regex: RegExp = invalidRouteRegex,
  ) => {
    const sanitizedValue = sanitizedValueInput(value, regex);

    if (!routeValidRegex.test(sanitizedValue)) {
      console.error('Ruta inválida', sanitizedValue);
    }
    nextTick(() => {
      setFieldValue(input, sanitizedValue);
    });
  };

  const validateAlphaInput = (
    value: string | undefined,
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
    if (
      (!filter.filter_name || filter.filter_name === '') &&
      !filter.active &&
      !filter.show &&
      !filter.id_parent &&
      !filter.required_auth
    ) {
      return;
    }
    filter.filter_name = undefined;
    filter.active = undefined;
    filter.show = undefined;
    filter.id_parent = undefined;
    filter.required_auth = undefined;
    pagination.page = 1;
    appliedFilter.filter_name = undefined;
    appliedFilter.active = undefined;
    appliedFilter.show = undefined;
    appliedFilter.id_parent = undefined;
    appliedFilter.required_auth = undefined;
  };

  const setRouteItem = (value: RoutesResponse) => {
    setFieldValue('id', value?.id);
    setFieldValue('name', value?.name);
    setFieldValue('title', value?.title);
    setFieldValue('uri', value?.uri);
    setFieldValue('description', value?.description);
    setFieldValue('order', value?.order);
    setFieldValue('icon', value?.icon);
    setFieldValue('parent', value?.parent);
    setFieldValue('child_route', !!parent.value);
    setFieldValue('show', value?.show);
    setFieldValue('active', value.active);
    setFieldValue(
      'permissions_ids',
      value.permissions?.length
        ? value.permissions.map(permission => permission.id)
        : [],
    );
    setFieldValue('required_auth', value.required_auth);
  };

  const findRoute = (value?: FilterRouteType) => {
    pagination.page = 1;
    const target = value && typeof value === 'object' && !('target' in value) ? value : filter;
    appliedFilter.filter_name =
      (target?.filter_name ?? filter.filter_name) || undefined;
    appliedFilter.active = target?.active ?? filter.active;
    appliedFilter.show = target?.show ?? filter.show;
    appliedFilter.id_parent = target?.id_parent ?? filter.id_parent;
    appliedFilter.required_auth = target?.required_auth ?? filter.required_auth;
  };

  const debouncedFindRoute = debounce(() => {
    findRoute();
  }, 700);
  const debouncedCleanSearch = debounce(() => {
    cleanSearch();
  }, 700);

  return {
    getRoutes,
    loadParentRoutes,
    addRoute,
    editRoute,
    toggleRoute,
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
    parent,
    parentAttrs,
    permissions_ids,
    permissions_idsAttrs,
    required_auth,
    required_authAttrs,
    errors,
    handleSubmit,
    validateField,
    parentRoutes,
    resetForm,
    resetField,
    setFieldError,
    items,
    validateInputUri,
    filter,
    appliedFilter,
    validateAlphaInput,
    cleanSearch,
    debouncedCleanSearch,
    setRouteItem,
    findRoute,
    debouncedFindRoute,
    pagination,
    headers,
    getPermissions,
    permissionsList,
    headerPermissions,
    permissionsPagination,
    findPermission,
    filter_permission,
    getCategoryPermissions,
    categories,
    isPending,
    isFetching,
    addRouteMutation,
    editRouteMutation,
    toggleRouteMutation,
  };
}

export default useAdmin;
