import { computed, nextTick, reactive, ref, watch } from 'vue';
import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/vue-query';
import { useForm } from 'vee-validate';
import * as yup from 'yup';

import { TableHeaders } from '@/core/interfaces';
import { useAlertStore } from '@/core/store';
import { debounce } from '@/core/utils/debounceFunction';
import { sanitizedValueInput } from '@/core/utils/inputTextValidations';
import { createQueryKeys } from '@/core/utils/queryKeys';

import { CategoryStatusResponse } from '../interfaces/category-status/category-status.response.interface';
import { CategoryStatusForm } from '../interfaces/category-status/category-status.form.interface';
import catalogServices from '../Services/catalog.services';

export type FilterCategoryStatusType = {
  filter_name?: string;
  status?: boolean | 'Todos';
};

export const categoryStatusKeys = createQueryKeys<
  FilterCategoryStatusType & { page?: number; per_page?: number }
>('category-status');

export function useCategoryStatus() {
  const alert = useAlertStore();
  const queryClient = useQueryClient();

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
        .required('El nombre de la categoría de estado es requerido')
        .min(3, 'El nombre debe tener al menos 3 caracteres')
        .max(150, 'El nombre no puede tener más de 150 caracteres'),
      code: yup
        .string()
        .required('El código es requerido')
        .min(2, 'El código debe tener al menos 2 caracteres')
        .max(10, 'El código no puede tener más de 10 caracteres'),
      description: yup
        .string()
        .min(5, 'La descripción debe tener al menos 5 caracteres')
        .max(150, 'La descripción no puede tener más de 150 caracteres')
        .nullable(),
      active: yup.boolean(),
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
      field: 'code',
      header: 'Código',
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
      width: 25,
    },
    {
      field: 'active',
      header: 'Estado',
      sortable: false,
      alignHeaders: 'center',
      alignItems: 'center',
      width: 5,
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
  const [name, nameAttrs] = defineField('name');
  const [code, codeAttrs] = defineField('code');
  const [description, descriptionAttrs] = defineField('description');
  const [active, activeAttrs] = defineField('active');

  const filter = reactive<FilterCategoryStatusType>({
    filter_name: undefined,
    status: undefined,
  });

  const appliedFilter = reactive<FilterCategoryStatusType>({
    filter_name: undefined,
    status: undefined,
  });

  const findRegex = /[^a-zA-ZáÁéÉíÍóÓúÚñÑ.0-9 ]/g;

  // Consulta paginada y reactiva de categorías de estado
  const {
    data: queryResult,
    isPending,
    isFetching,
    refetch,
  } = useQuery({
    queryKey: computed(() =>
      categoryStatusKeys.list({
        page: pagination.page,
        per_page: pagination.per_page,
        filter_name: appliedFilter.filter_name || undefined,
        status:
          appliedFilter.status === 'Todos' ? undefined : appliedFilter.status,
      }),
    ),
    queryFn: async () => {
      const response = await catalogServices.getAllCategoryStatuses({
        page: pagination.page,
        per_page: pagination.per_page,
        filter_name: appliedFilter.filter_name || undefined,
        status:
          appliedFilter.status === 'Todos' ? undefined : appliedFilter.status,
      });
      return response.data;
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

  const categoryStatuses = computed<CategoryStatusResponse[]>(
    () => queryResult.value?.data ?? [],
  );

  // Mutación: Registrar Categoría de Estado
  const addMutation = useMutation({
    mutationFn: async (form: CategoryStatusForm) => {
      const response = await catalogServices.postCategoryStatus({
        ...form,
        active: true,
      });
      return response.data;
    },
    onSuccess: data => {
      queryClient.invalidateQueries({ queryKey: categoryStatusKeys.all });
      alert.showAlert({
        type: 'success',
        title: `${data.message || 'Categoría registrada'}`,
        show: true,
      });
    },
    onError: err => {
      console.error('Error al registrar categoría de estado:', err);
    },
  });

  // Mutación: Editar Categoría de Estado
  const editMutation = useMutation({
    mutationFn: async (form: CategoryStatusForm) => {
      const { id: catId, ...body } = form;
      const response = await catalogServices.putCategoryStatus(catId!, body);
      return response.data;
    },
    onSuccess: data => {
      queryClient.invalidateQueries({ queryKey: categoryStatusKeys.all });
      alert.showAlert({
        type: 'success',
        title: `${data.message || 'Categoría actualizada'}`,
        show: true,
      });
    },
    onError: err => {
      console.error('Error al editar categoría de estado:', err);
    },
  });

  // Mutación: Alternar Estado
  const patchMutation = useMutation({
    mutationFn: async (catId: string) => {
      const response = await catalogServices.patchCategoryStatus(catId);
      return response.data;
    },
    onSuccess: data => {
      queryClient.invalidateQueries({ queryKey: categoryStatusKeys.all });
      alert.showAlert({
        type: 'success',
        title: `${data.message || 'Estado actualizado'}`,
        show: true,
      });
    },
    onError: err => {
      console.error('Error al cambiar estado de categoría:', err);
    },
  });

  const addCategoryStatus = async (form: CategoryStatusForm) => {
    return await addMutation.mutateAsync(form);
  };

  const editCategoryStatus = async (form: CategoryStatusForm) => {
    return await editMutation.mutateAsync(form);
  };

  const patchCategoryStatus = async (catId: string) => {
    return await patchMutation.mutateAsync(catId);
  };

  const getCategoryStatuses = async () => {
    const res = await refetch();
    return res.data?.data ?? [];
  };

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
    filter.filter_name = undefined;
    filter.status = undefined;
    appliedFilter.filter_name = undefined;
    appliedFilter.status = undefined;
    pagination.page = 1;
  };

  const setCategoryStatusItem = (value: CategoryStatusResponse) => {
    setFieldValue('id', value?.id);
    setFieldValue('name', value?.name);
    setFieldValue('code', value?.code);
    setFieldValue('description', value?.description);
    setFieldValue('active', value?.active);
  };

  const findCategoryStatus = (value?: FilterCategoryStatusType) => {
    pagination.page = 1;
    const target = value && typeof value === 'object' && !('target' in value) ? value : filter;
    appliedFilter.filter_name =
      (target?.filter_name ?? filter.filter_name) || undefined;
    appliedFilter.status = target?.status ?? filter.status;
  };

  const debouncedFindCategoryStatus = debounce(() => {
    findCategoryStatus();
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
    getCategoryStatuses,
    validateAlphaInput,
    cleanSearch,
    debouncedCleanSearch,
    setCategoryStatusItem,
    findCategoryStatus,
    debouncedFindCategoryStatus,
    id,
    idAttrs,
    name,
    nameAttrs,
    code,
    codeAttrs,
    description,
    descriptionAttrs,
    active,
    activeAttrs,
    alert,
    filter,
    appliedFilter,
    pagination,
    categoryStatuses,
    isPending,
    isFetching,
    addCategoryStatus,
    editCategoryStatus,
    patchCategoryStatus,
    addMutation,
    editMutation,
    patchMutation,
  };
}

export default useCategoryStatus;
