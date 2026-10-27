import { computed, nextTick, reactive, ref, watch } from 'vue';
import { useForm } from 'vee-validate';
import * as yup from 'yup';
import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/vue-query';

import { TableHeaders } from '@/core/interfaces';
import { useAlertStore } from '@/core/store';
import { debounce } from '@/core/utils/debounceFunction';
import { sanitizedValueInput } from '@/core/utils/inputTextValidations';
import { createQueryKeys } from '@/core/utils/queryKeys';

import catalogServices from '../Services/catalog.services';
import { GlobalStatusResponse } from '../interfaces/global-status/global-status.response.interface';
import { GlobalStatusForm } from '../interfaces/global-status/global-status.form.interface';
import { CategoryStatus } from '../interfaces/global-status/global-status.category-status.interface';
import { CategoryStatusResponse } from '../interfaces/category-status/category-status.response.interface';
import { categoryStatusKeys } from './useCategoryStatus';

export type FilterGlobalStatusType = {
  filter_name?: string;
  status?: boolean | 'Todos';
  id_category?: string;
};

export const globalStatusKeys = createQueryKeys<
  FilterGlobalStatusType & { page?: number; per_page?: number }
>('global-status');

export function useGlobalStatus() {
  const queryClient = useQueryClient();
  const alert = useAlertStore();

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
      code: yup.string().required('El campo de cabecera es obligatorio'),
      name: yup
        .string()
        .required('El nombre del departamento es requerido')
        .min(3, 'El nombre de tener al menos 3 caracteres')
        .max(255, 'El nombre no puede tener más de 255 caracteres'),
      description: yup
        .string()
        .required('La descripción es obligatoria')
        .min(5, 'La descripción debe tener al menos 5 caracteres')
        .max(255, 'La descripción no puede tener más de 255 caracteres')
        .nullable(),
      state_color: yup
        .string()
        .max(10, 'El color del estado no puede tener más de 10 caracteres')
        .required('El color del estado es obligatorio'),
      text_color: yup
        .string()
        .max(
          10,
          'El color del texto del estado no puede tener más de 10 caracteres',
        )
        .required('El color del texto del estado es obligatorio'),
      category_status: yup
        .mixed<CategoryStatus>()
        .required('El campo de categoría de estado es obligatorio'),
    }),
  });

  const headers = ref<TableHeaders[]>([
    {
      field: 'code',
      header: 'Código',
      sortable: false,
      alignHeaders: 'start',
      alignItems: 'start',
    },
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
      field: 'category_status.name',
      header: 'Categoría',
      sortable: false,
      alignHeaders: 'start',
      alignItems: 'start',
    },
    {
      field: 'state_color',
      header: 'Color',
      sortable: false,
      alignHeaders: 'center',
      alignItems: 'center',
    },
    {
      field: 'text_color',
      header: 'Color de texto',
      sortable: false,
      alignHeaders: 'center',
      alignItems: 'center',
      width: 12,
    },
    {
      field: 'active',
      header: 'Estado',
      sortable: false,
      alignHeaders: 'center',
      alignItems: 'center',
      width: 10,
    },
    {
      field: 'acciones',
      header: 'Acciones',
      sortable: false,
      alignHeaders: 'center',
      alignItems: 'center',
    },
  ]);

  const pagination = reactive({
    page: 1,
    per_page: 10,
    total_items: 0,
  });

  const [id, idAttrs] = defineField('id');
  const [code, codeAttrs] = defineField('code');
  const [name, nameAttrs] = defineField('name');
  const [description, descriptionAttrs] = defineField('description');
  const [state_color, stateColorAttrs] = defineField('state_color');
  const [text_color, textColorAttrs] = defineField('text_color');
  const [category_status, categoryStatusAttrs] = defineField('category_status');

  const filter = reactive<FilterGlobalStatusType>({
    filter_name: undefined,
    status: undefined,
    id_category: undefined,
  });

  const appliedFilter = reactive<FilterGlobalStatusType>({
    filter_name: undefined,
    status: undefined,
    id_category: undefined,
  });

  const findRegex = /[^a-zA-ZáÁéÉíÍóÓúÚñÑ.0-9_ ]/g;

  // Query de Estados Globales
  const {
    data: queryResult,
    isPending,
    isFetching,
    refetch,
  } = useQuery({
    queryKey: computed(() =>
      globalStatusKeys.list({
        page: pagination.page,
        per_page: pagination.per_page,
        filter_name: appliedFilter.filter_name || undefined,
        status:
          appliedFilter.status === 'Todos' ? undefined : appliedFilter.status,
        id_category: appliedFilter.id_category || undefined,
      }),
    ),
    queryFn: async () => {
      const params = {
        page: pagination.page,
        per_page: pagination.per_page,
        filter_name: appliedFilter.filter_name || undefined,
        status:
          appliedFilter.status === 'Todos' ? undefined : appliedFilter.status,
        id_category: appliedFilter.id_category || undefined,
      };
      const response = await catalogServices.getGlobalStatus(params);
      if (response.statusCode === 200) {
        return response.data;
      }
      return null;
    },
    placeholderData: keepPreviousData,
  });

  watch(
    () => queryResult.value,
    newData => {
      if (newData) {
        pagination.total_items = newData.total_items ?? 0;
      }
    },
    { immediate: true },
  );

  const globalStatus = computed<GlobalStatusResponse[]>(
    () => queryResult.value?.data ?? [],
  );

  // Query de Categorías de Estado para selector / autocompletado
  const { data: categoryStatusesData } = useQuery({
    queryKey: computed(() => categoryStatusKeys.list({ status: true })),
    queryFn: async () => {
      const response = await catalogServices.getAllCategoryStatuses({
        status: true,
      });
      if (response.statusCode === 200) {
        return response.data.data ?? [];
      }
      return [];
    },
    staleTime: 1000 * 60 * 10,
  });

  const categoryStatuses = computed<CategoryStatusResponse[]>(
    () => categoryStatusesData.value || [],
  );

  // Mutaciones TanStack Query
  const addMutation = useMutation({
    mutationFn: (form: GlobalStatusForm) =>
      catalogServices.postGlobalStatus({
        ...form,
        active: true,
      }),
    onSuccess: response => {
      if (response.status === 201) {
        queryClient.invalidateQueries({ queryKey: globalStatusKeys.all });
        alert.showAlert({
          type: 'success',
          title: `${response.data.message}`,
          show: true,
        });
      }
    },
    onError: error => {
      console.error(error);
    },
  });

  const editMutation = useMutation({
    mutationFn: ({
      id,
      body,
    }: {
      id: string;
      body: Omit<GlobalStatusForm, 'id'>;
    }) => catalogServices.putGlobalStatus(id, body),
    onSuccess: response => {
      if (response.status === 200) {
        queryClient.invalidateQueries({ queryKey: globalStatusKeys.all });
        alert.showAlert({
          type: 'success',
          title: `${response.data.message}`,
          show: true,
        });
      }
    },
    onError: error => {
      console.error(error);
    },
  });

  const toggleMutation = useMutation({
    mutationFn: (id: string) => catalogServices.toggleGlobalStatus(id),
    onSuccess: response => {
      if (response.status === 200) {
        queryClient.invalidateQueries({ queryKey: globalStatusKeys.all });
        alert.showAlert({
          type: 'success',
          title: `${response.data.message}`,
          show: true,
        });
      }
    },
    onError: error => {
      console.error(error);
    },
  });

  const addGlobalStatus = async (form: GlobalStatusForm) => {
    try {
      const result = await addMutation.mutateAsync(form);
      return result.data;
    } catch (error) {
      console.error(error);
      return undefined;
    }
  };

  const editGlobalStatus = async (form: GlobalStatusForm) => {
    try {
      const { id, ...body } = form;
      const result = await editMutation.mutateAsync({ id: id!, body });
      return result.data;
    } catch (error) {
      console.error(error);
      return undefined;
    }
  };

  const toggleGlobalStatus = async (id: string) => {
    try {
      const result = await toggleMutation.mutateAsync(id);
      return result.data;
    } catch (error) {
      console.error(error);
      return undefined;
    }
  };

  const getGlobalStatus = async () => {
    const result = await refetch();
    return result.data;
  };

  const getCategoryStatuses = async () => {
    const response = await catalogServices.getAllCategoryStatuses({
      status: true,
    });
    if (response.statusCode === 200) {
      return response.data.data;
    }
    return [];
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
      filter.status === undefined &&
      filter.id_category === undefined
    ) {
      return;
    }
    filter.filter_name = undefined;
    filter.status = undefined;
    filter.id_category = undefined;
    pagination.page = 1;
    appliedFilter.filter_name = undefined;
    appliedFilter.status = undefined;
    appliedFilter.id_category = undefined;
  };

  const setGlobalStatusItem = (value: GlobalStatusResponse) => {
    setFieldValue('code', value?.code);
    setFieldValue('id', value?.id);
    setFieldValue('name', value?.name);
    setFieldValue('description', value?.description);
    setFieldValue('state_color', value?.state_color);
    setFieldValue('text_color', value?.text_color);
    setFieldValue('category_status', value?.category_status);
  };

  const findGlobalStatus = (value?: FilterGlobalStatusType) => {
    pagination.page = 1;
    const target = value && typeof value === 'object' && !('target' in value) ? value : filter;
    appliedFilter.filter_name =
      (target?.filter_name ?? filter.filter_name) || undefined;
    appliedFilter.status = target?.status ?? filter.status;
    appliedFilter.id_category = target?.id_category ?? filter.id_category;
  };

  const debouncedFindGlobalStatus = debounce(() => {
    findGlobalStatus();
  }, 700);
  const debouncedCleanSearch = debounce(() => {
    cleanSearch();
  }, 700);

  return {
    headers,
    errors,
    defineField,
    handleSubmit,
    validateField,
    resetForm,
    resetField,
    setFieldError,
    setFieldValue,
    validateAlphaInput,
    cleanSearch,
    debouncedCleanSearch,
    setGlobalStatusItem,
    findGlobalStatus,
    debouncedFindGlobalStatus,
    id,
    idAttrs,
    name,
    nameAttrs,
    description,
    descriptionAttrs,
    code,
    codeAttrs,
    state_color,
    stateColorAttrs,
    text_color,
    textColorAttrs,
    category_status,
    categoryStatusAttrs,
    alert,
    filter,
    appliedFilter,
    pagination,
    globalStatus,
    categoryStatuses,
    isPending,
    isFetching,
    getGlobalStatus,
    addGlobalStatus,
    editGlobalStatus,
    toggleGlobalStatus,
    getCategoryStatuses,
    addMutation,
    editMutation,
    toggleMutation,
  };
}

export default useGlobalStatus;
