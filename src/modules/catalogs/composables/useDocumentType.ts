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
import { sanitizedValueInput } from '@/core/utils/inputTextValidations';
import { createQueryKeys } from '@/core/utils/queryKeys';

import catalogServices from '../Services/catalog.services';
import { DocumentTypeResponse } from '../interfaces/document-type/document-type.response.interface';
import { DocumentTypeForm } from '../interfaces/document-type/document-type.form.interface';

export type FilterDocumentType = {
  filter_name?: string;
  status?: boolean | 'Todos';
};

export const documentTypesKeys = createQueryKeys<
  FilterDocumentType & { page?: number; per_page?: number }
>('document-types');

export function useDocumentType() {
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
        .required('El nombre del tipo de documento es requerido')
        .min(3, 'El nombre debe tener al menos 3 caracteres')
        .max(150, 'El nombre no puede tener más de 150 caracteres'),
      description: yup
        .string()
        .required('La descripción es requerida')
        .min(5, 'La descripción debe tener al menos 5 caracteres')
        .max(150, 'La descripción no puede tener más de 150 caracteres'),
      mask: yup
        .string()
        .nullable()
        .max(150, 'La máscara no puede tener más de 150 caracteres'),
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
      field: 'description',
      header: 'Descripción',
      sortable: false,
      alignHeaders: 'start',
      alignItems: 'start',
    },
    {
      field: 'mask',
      header: 'Máscara',
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

  const pagination = reactive({
    page: 1,
    per_page: 10,
    total_items: 0,
  });

  const [id, idAttrs] = defineField('id');
  const [name, nameAttrs] = defineField('name');
  const [description, descriptionAttrs] = defineField('description');
  const [mask, maskAttrs] = defineField('mask');
  const [active, activeAttrs] = defineField('active');

  const filter = reactive<FilterDocumentType>({
    filter_name: undefined,
    status: undefined,
  });

  const appliedFilter = reactive<FilterDocumentType>({
    filter_name: undefined,
    status: undefined,
  });

  const findRegex = /[^a-zA-ZáÁéÉíÍóÓúÚñÑ.0-9 ]/g;

  // Consulta paginada y reactiva de tipos de documento
  const {
    data: queryResult,
    isPending,
    isFetching,
    refetch,
  } = useQuery({
    queryKey: computed(() =>
      documentTypesKeys.list({
        page: pagination.page,
        per_page: pagination.per_page,
        filter_name: appliedFilter.filter_name || undefined,
        status:
          appliedFilter.status === 'Todos' ? undefined : appliedFilter.status,
      }),
    ),
    queryFn: async () => {
      const response = await catalogServices.getDocumentTypes({
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

  const documentTypes = computed<DocumentTypeResponse[]>(
    () => queryResult.value?.data ?? [],
  );

  // Mutación: Registrar Tipo de Documento
  const addMutation = useMutation({
    mutationFn: async (form: DocumentTypeForm) => {
      const response = await catalogServices.postDocumentType({
        ...form,
        active: true,
      });
      return response.data;
    },
    onSuccess: data => {
      queryClient.invalidateQueries({ queryKey: documentTypesKeys.all });
      alert.showAlert({
        type: 'success',
        title: `${data.message || 'Tipo de documento registrado'}`,
        show: true,
      });
    },
    onError: err => {
      console.error('Error al registrar tipo de documento:', err);
    },
  });

  // Mutación: Editar Tipo de Documento
  const editMutation = useMutation({
    mutationFn: async (form: DocumentTypeForm) => {
      const { id: docId, ...body } = form;
      const response = await catalogServices.putDocumentType(docId!, body);
      return response.data;
    },
    onSuccess: data => {
      queryClient.invalidateQueries({ queryKey: documentTypesKeys.all });
      alert.showAlert({
        type: 'success',
        title: `${data.message || 'Tipo de documento actualizado'}`,
        show: true,
      });
    },
    onError: err => {
      console.error('Error al editar tipo de documento:', err);
    },
  });

  // Mutación: Alternar Estado
  const toggleMutation = useMutation({
    mutationFn: async (docId: string) => {
      const response = await catalogServices.toggleDocumentType(docId);
      return response.data;
    },
    onSuccess: data => {
      queryClient.invalidateQueries({ queryKey: documentTypesKeys.all });
      alert.showAlert({
        type: 'success',
        title: `${data.message || 'Estado actualizado'}`,
        show: true,
      });
    },
    onError: err => {
      console.error('Error al cambiar estado de tipo de documento:', err);
    },
  });

  const addDocumentType = async (form: DocumentTypeForm) => {
    return await addMutation.mutateAsync(form);
  };

  const editDocumentType = async (form: DocumentTypeForm) => {
    return await editMutation.mutateAsync(form);
  };

  const toggleDocumentType = async (docId: string) => {
    return await toggleMutation.mutateAsync(docId);
  };

  const getDocumentTypes = async () => {
    const res = await refetch();
    return res.data?.data ?? [];
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
    filter.filter_name = undefined;
    filter.status = undefined;
    appliedFilter.filter_name = undefined;
    appliedFilter.status = undefined;
    pagination.page = 1;
  };

  const setDocumentTypeItem = (value: DocumentTypeResponse) => {
    setFieldValue('id', value?.id);
    setFieldValue('name', value?.name);
    setFieldValue('description', value?.description);
    setFieldValue('mask', value?.mask);
    setFieldValue('active', value?.active);
  };

  const findDocumentType = (value: FilterDocumentType) => {
    pagination.page = 1;
    appliedFilter.filter_name =
      (value?.filter_name ?? filter.filter_name) || undefined;
    appliedFilter.status = value?.status ?? filter.status;
  };

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
    setDocumentTypeItem,
    findDocumentType,
    id,
    idAttrs,
    name,
    nameAttrs,
    description,
    descriptionAttrs,
    mask,
    maskAttrs,
    active,
    activeAttrs,
    alert,
    filter,
    appliedFilter,
    pagination,
    documentTypes,
    isPending,
    isFetching,
    getDocumentTypes,
    addDocumentType,
    editDocumentType,
    toggleDocumentType,
    addMutation,
    editMutation,
    toggleMutation,
  };
}

export default useDocumentType;
