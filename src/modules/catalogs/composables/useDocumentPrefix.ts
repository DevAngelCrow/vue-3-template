import { computed, reactive, ref } from 'vue';
import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query';
import { useForm } from 'vee-validate';
import * as yup from 'yup';

import type { TableHeaders } from '@/core/interfaces';
import { useAlertStore } from '@/core/store';
import { debounce } from '@/core/utils/debounceFunction';
import { sanitizeInput } from '@/core/utils/inputTextValidations';

import catalogServices from '../Services/catalog.services';
import type { DocumentPrefixResponse } from '../interfaces/document-prefix/document-prefix.response.interface';
import type { DocumentPrefixForm } from '../interfaces/document-prefix/document-prefix.form.interface';

export interface FilterDocumentPrefix {
  filter_name: string;
  status: boolean | 'Todos';
}

export interface DocumentPrefixModalState {
  show: boolean;
  mode: 'closed' | 'add' | 'view' | 'edit' | 'delete';
  title: string;
  description: string;
  isReadonly: boolean;
  selectedItem: DocumentPrefixResponse | null;
}

const extractErrorMessage = (err: unknown, fallback: string): string => {
  if (typeof err === 'object' && err !== null) {
    const directMessage = Reflect.get(err, 'message');
    if (typeof directMessage === 'string' && directMessage.trim().length > 0) {
      return directMessage;
    }
    const response = Reflect.get(err, 'response');
    if (typeof response === 'object' && response !== null) {
      const data = Reflect.get(response, 'data');
      if (typeof data === 'object' && data !== null) {
        const nestedMessage = Reflect.get(data, 'message');
        if (
          typeof nestedMessage === 'string' &&
          nestedMessage.trim().length > 0
        ) {
          return nestedMessage;
        }
      }
    }
  }
  return fallback;
};

export function useDocumentPrefix() {
  const alert = useAlertStore();
  const queryClient = useQueryClient();

  const filter = reactive<FilterDocumentPrefix>({
    filter_name: '',
    status: 'Todos',
  });

  const headers = ref<TableHeaders[]>([
    { field: 'prefix', header: 'Prefijo', sortable: false },
    { field: 'name', header: 'Nombre de Serie', sortable: false },
    { field: 'code', header: 'Código', sortable: false },
    { field: 'entity_target', header: 'Entidad Destino', sortable: false },
    { field: 'current_status', header: 'Serie / Año', sortable: false },
    { field: 'next_preview', header: 'Próximo Correlativo', sortable: false },
    { field: 'active', header: 'Estado', sortable: false },
    { field: 'acciones', header: 'Acciones', sortable: false },
  ]);

  const {
    data: documentPrefixes,
    isLoading,
    isFetching,
    refetch,
  } = useQuery<DocumentPrefixResponse[]>({
    queryKey: ['document-prefixes'],
    queryFn: () => catalogServices.getDocumentPrefixes(),
    staleTime: 1000 * 60 * 5,
  });

  const filteredDocumentPrefixes = computed<DocumentPrefixResponse[]>(() => {
    const rawList = documentPrefixes.value ?? [];
    let result = [...rawList];

    if (filter.status !== 'Todos') {
      result = result.filter(item => item.active === filter.status);
    }

    if (filter.filter_name && filter.filter_name.trim() !== '') {
      const q = filter.filter_name.trim().toLowerCase();
      result = result.filter(
        item =>
          item.name.toLowerCase().includes(q) ||
          item.prefix.toLowerCase().includes(q) ||
          item.code.toLowerCase().includes(q) ||
          item.entity_target.toLowerCase().includes(q),
      );
    }

    return result;
  });

  const { errors, defineField, handleSubmit, resetForm, setValues } =
    useForm<DocumentPrefixForm>({
      validationSchema: yup.object({
        id: yup.string().optional(),
        code: yup
          .string()
          .required('El código programático es requerido')
          .min(2, 'Mínimo 2 caracteres')
          .max(50, 'Máximo 50 caracteres'),
        prefix: yup
          .string()
          .required('El prefijo visible es requerido')
          .min(1, 'Mínimo 1 caracter')
          .max(10, 'Máximo 10 caracteres'),
        name: yup
          .string()
          .required('El nombre de la serie es requerido')
          .min(3, 'Mínimo 3 caracteres')
          .max(100, 'Máximo 100 caracteres'),
        description: yup
          .string()
          .nullable()
          .max(255, 'Máximo 255 caracteres'),
        entity_target: yup
          .string()
          .required('La tabla o entidad destino es requerida')
          .max(50, 'Máximo 50 caracteres'),
        padding: yup
          .number()
          .typeError('El padding debe ser numérico')
          .required('La cantidad de ceros (padding) es requerida')
          .min(2, 'Mínimo 2 dígitos')
          .max(10, 'Máximo 10 dígitos'),
        reset_yearly: yup.boolean().required(),
        separator: yup
          .string()
          .required('El separador es requerido')
          .max(5, 'Máximo 5 caracteres'),
        current_value: yup
          .number()
          .typeError('El correlativo debe ser numérico')
          .required('El correlativo actual es requerido')
          .min(0, 'El correlativo no puede ser negativo'),
        active: yup.boolean().optional(),
      }),
      initialValues: {
        code: '',
        prefix: '',
        name: '',
        description: '',
        entity_target: '',
        padding: 4,
        reset_yearly: true,
        separator: '-',
        current_value: 0,
        active: true,
      },
    });

  const [id] = defineField('id');
  const [code, codeAttrs] = defineField('code');
  const [prefix, prefixAttrs] = defineField('prefix');
  const [name, nameAttrs] = defineField('name');
  const [description, descriptionAttrs] = defineField('description');
  const [entity_target, entityTargetAttrs] = defineField('entity_target');
  const [padding, paddingAttrs] = defineField('padding');
  const [reset_yearly, resetYearlyAttrs] = defineField('reset_yearly');
  const [separator, separatorAttrs] = defineField('separator');
  const [current_value, currentValueAttrs] = defineField('current_value');
  const [active, activeAttrs] = defineField('active');

  const livePreview = computed(() => {
    const p = sanitizeInput(prefix.value || 'DOC', 'alphanumericUpper') || 'DOC';
    const sep = separator.value ?? '-';
    const pad = Number(padding.value) || 4;
    const val = (Number(current_value.value) || 0) + 1;
    const numStr = String(val).padStart(pad, '0');
    if (reset_yearly.value) {
      const yr = new Date().getFullYear();
      return `${p}${sep}${yr}${sep}${numStr}`;
    }
    return `${p}${sep}${numStr}`;
  });

  const modalState = reactive<DocumentPrefixModalState>({
    show: false,
    mode: 'closed',
    title: '',
    description: '',
    isReadonly: false,
    selectedItem: null,
  });

  const openModal = (
    action: 'add' | 'view' | 'edit' | 'delete',
    data?: DocumentPrefixResponse,
  ) => {
    modalState.mode = action;
    modalState.isReadonly = action === 'view';
    modalState.selectedItem = data ?? null;

    switch (action) {
      case 'add':
        modalState.title = 'Registrar Nueva Serie de Documento';
        modalState.description = '';
        resetForm({
          values: {
            code: '',
            prefix: '',
            name: '',
            description: '',
            entity_target: '',
            padding: 4,
            reset_yearly: true,
            separator: '-',
            current_value: 0,
            active: true,
          },
        });
        break;
      case 'edit':
        modalState.title = 'Editar Prefijo y Serie de Documento';
        modalState.description = '';
        if (data) {
          setValues({
            id: data.id,
            code: data.code,
            prefix: data.prefix,
            name: data.name,
            description: data.description || '',
            entity_target: data.entity_target,
            padding: data.padding,
            reset_yearly: data.reset_yearly,
            separator: data.separator,
            current_value: data.current_value,
            active: data.active,
          });
        }
        break;
      case 'view':
        modalState.title = 'Configuración de Serie de Documento';
        modalState.description = '';
        if (data) {
          setValues({
            id: data.id,
            code: data.code,
            prefix: data.prefix,
            name: data.name,
            description: data.description || '',
            entity_target: data.entity_target,
            padding: data.padding,
            reset_yearly: data.reset_yearly,
            separator: data.separator,
            current_value: data.current_value,
            active: data.active,
          });
        }
        break;
      case 'delete':
        modalState.title = data?.active
          ? 'Desactivar Serie de Documento'
          : 'Activar Serie de Documento';
        modalState.description = `¿Está seguro de cambiar el estado de la serie '${data?.name}' a ${
          data?.active ? 'inactivo' : 'activo'
        }?`;
        if (data) {
          setValues({
            id: data.id,
            code: data.code,
            prefix: data.prefix,
            name: data.name,
            description: data.description || '',
            entity_target: data.entity_target,
            padding: data.padding,
            reset_yearly: data.reset_yearly,
            separator: data.separator,
            current_value: data.current_value,
            active: data.active,
          });
        }
        break;
    }

    modalState.show = true;
  };

  const closeModal = () => {
    modalState.show = false;
    modalState.mode = 'closed';
    modalState.title = '';
    modalState.description = '';
    modalState.isReadonly = false;
    modalState.selectedItem = null;
    resetForm();
  };

  const addMutation = useMutation({
    mutationFn: async (form: DocumentPrefixForm) => {
      const response = await catalogServices.postDocumentPrefix({
        ...form,
        code: sanitizeInput(form.code, {
          ...{
            transformCase: 'upper',
            replaceSeparator: { pattern: /[\s-]+/g, with: '_' },
            disallowPattern: /[^A-Z0-9_]/g,
            collapseSeparator: '_',
            trim: true,
          },
        }),
        prefix: sanitizeInput(form.prefix, {
          transformCase: 'upper',
          disallowPattern: /[^A-Z0-9]/g,
          trim: true,
        }),
      });
      return response.data;
    },
    onSuccess: data => {
      queryClient.invalidateQueries({ queryKey: ['document-prefixes'] });
      alert.showAlert({
        type: 'success',
        title: data.message || 'Serie de documento registrada exitosamente',
        show: true,
      });
    },
    onError: (err: unknown) => {
      alert.showAlert({
        type: 'error',
        title: extractErrorMessage(
          err,
          'Error al registrar la serie de documento',
        ),
        show: true,
      });
    },
  });

  const editMutation = useMutation({
    mutationFn: async (form: DocumentPrefixForm) => {
      const { id: prefixId, ...body } = form;
      if (!prefixId) {
        throw new Error('ID de serie de documento requerido para actualizar');
      }
      const response = await catalogServices.putDocumentPrefix(prefixId, {
        ...body,
        prefix: sanitizeInput(body.prefix, {
          transformCase: 'upper',
          disallowPattern: /[^A-Z0-9]/g,
          trim: true,
        }),
      });
      return response.data;
    },
    onSuccess: data => {
      queryClient.invalidateQueries({ queryKey: ['document-prefixes'] });
      alert.showAlert({
        type: 'success',
        title: data.message || 'Serie de documento actualizada exitosamente',
        show: true,
      });
    },
    onError: (err: unknown) => {
      alert.showAlert({
        type: 'error',
        title: extractErrorMessage(
          err,
          'Error al actualizar la serie de documento',
        ),
        show: true,
      });
    },
  });

  const toggleStatusMutation = useMutation({
    mutationFn: async (prefixId: string) => {
      const response = await catalogServices.patchDocumentPrefix(prefixId);
      return response.data;
    },
    onSuccess: data => {
      queryClient.invalidateQueries({ queryKey: ['document-prefixes'] });
      alert.showAlert({
        type: 'success',
        title: data.message || 'Estado modificado exitosamente',
        show: true,
      });
    },
    onError: (err: unknown) => {
      alert.showAlert({
        type: 'error',
        title: extractErrorMessage(err, 'Error al cambiar estado de la serie'),
        show: true,
      });
    },
  });

  const cleanSearch = () => {
    filter.filter_name = '';
    filter.status = 'Todos';
  };

  const debouncedCleanSearch = debounce(cleanSearch, 200);

  return {
    filter,
    headers,
    documentPrefixes: computed(() => documentPrefixes.value ?? []),
    filteredDocumentPrefixes,
    isLoading,
    isFetching,
    refetch,
    debouncedCleanSearch,
    modalState,
    openModal,
    closeModal,
    errors,
    handleSubmit,
    resetForm,
    livePreview,
    id,
    code,
    codeAttrs,
    prefix,
    prefixAttrs,
    name,
    nameAttrs,
    description,
    descriptionAttrs,
    entity_target,
    entityTargetAttrs,
    padding,
    paddingAttrs,
    reset_yearly,
    resetYearlyAttrs,
    separator,
    separatorAttrs,
    current_value,
    currentValueAttrs,
    active,
    activeAttrs,
    addDocumentPrefix: (form: DocumentPrefixForm) =>
      addMutation.mutateAsync(form),
    editDocumentPrefix: (form: DocumentPrefixForm) =>
      editMutation.mutateAsync(form),
    toggleDocumentPrefix: (prefixId: string) =>
      toggleStatusMutation.mutateAsync(prefixId),
    isSubmitting: computed(
      () =>
        addMutation.isPending.value ||
        editMutation.isPending.value ||
        toggleStatusMutation.isPending.value,
    ),
  };
}
