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

import catalogServices from '../Services/catalog.services';
import { MunicipalityResponse } from '../interfaces/municipalities/municipality.response.interface';
import { Municipality } from '../interfaces/districts/districts.municipality.interface';
import { DistrictResponse } from '../interfaces/districts/district.response.interface';
import { DistrictForm } from '../interfaces/districts/district.form.interface';
import { municipalitiesKeys } from './useMunicipalities';

export type FilterDistrictType = {
  filter_name?: string;
  status?: boolean | 'Todos';
  id_municipality?: string;
};

export const districtsKeys = createQueryKeys<
  FilterDistrictType & { page?: number; per_page?: number }
>('districts');

export function useDistrict() {
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
        .required('El nombre del distrito es requerido')
        .min(3, 'El nombre de tener al menos 3 caracteres')
        .max(150, 'El nombre no puede tener más de 150 caracteres'),
      description: yup
        .string()
        .min(5, 'La descripción debe tener al menos 5 caracteres')
        .nullable()
        .max(150, 'La descripción no puede tener más de 150 caracteres'),
      municipality: yup
        .mixed<Municipality>()
        .required('El campo de municipio es requerido'),
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
      field: 'municipality.name',
      header: 'Municipio',
      sortable: false,
      alignHeaders: 'start',
      alignItems: 'start',
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
  const [name, nameAttrs] = defineField('name');
  const [description, descriptionAttrs] = defineField('description');
  const [municipality, municipalityAttrs] = defineField('municipality');
  const [active, activeAttrs] = defineField('active');

  const filter = reactive<FilterDistrictType>({
    filter_name: undefined,
    status: undefined,
    id_municipality: undefined,
  });

  const appliedFilter = reactive<FilterDistrictType>({
    filter_name: undefined,
    status: undefined,
    id_municipality: undefined,
  });

  const findRegex = /[^a-zA-ZáÁéÉíÍóÓúÚñÑ.0-9 ]/g;

  // Consulta en caché para selector de municipios
  const { data: municipalitiesData } = useQuery({
    queryKey: computed(() => municipalitiesKeys.list({ status: true })),
    queryFn: async () => {
      const response = await catalogServices.getMunicipalities({ active: true });
      return response.data.data ?? [];
    },
    staleTime: 1000 * 60 * 10,
  });

  const municipalities = computed<MunicipalityResponse[]>(() => municipalitiesData.value || []);

  // Consulta paginada y reactiva de distritos
  const {
    data: queryResult,
    isPending,
    isFetching,
    refetch,
  } = useQuery({
    queryKey: computed(() =>
      districtsKeys.list({
        page: pagination.page,
        per_page: pagination.per_page,
        filter_name: appliedFilter.filter_name || undefined,
        status:
          appliedFilter.status === 'Todos' ? undefined : appliedFilter.status,
        id_municipality: appliedFilter.id_municipality || undefined,
      }),
    ),
    queryFn: async () => {
      const response = await catalogServices.getDistricts({
        page: pagination.page,
        per_page: pagination.per_page,
        filter_name: appliedFilter.filter_name || undefined,
        status:
          appliedFilter.status === 'Todos' ? undefined : appliedFilter.status,
        id_municipality: appliedFilter.id_municipality || undefined,
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

  const districts = computed<DistrictResponse[]>(
    () => queryResult.value?.data ?? [],
  );

  // Mutación: Registrar Distrito
  const addMutation = useMutation({
    mutationFn: async (form: DistrictForm) => {
      const response = await catalogServices.postDistrict({
        ...form,
        active: true,
      });
      return response.data;
    },
    onSuccess: data => {
      queryClient.invalidateQueries({ queryKey: districtsKeys.all });
      alert.showAlert({
        type: 'success',
        title: `${data.message || 'Distrito registrado'}`,
        show: true,
      });
    },
    onError: err => {
      console.error('Error al registrar distrito:', err);
    },
  });

  // Mutación: Editar Distrito
  const editMutation = useMutation({
    mutationFn: async (form: DistrictForm) => {
      const { id: distId, ...body } = form;
      const response = await catalogServices.putDistrict(distId!, body);
      return response.data;
    },
    onSuccess: data => {
      queryClient.invalidateQueries({ queryKey: districtsKeys.all });
      alert.showAlert({
        type: 'success',
        title: `${data.message || 'Distrito actualizado'}`,
        show: true,
      });
    },
    onError: err => {
      console.error('Error al editar distrito:', err);
    },
  });

  // Mutación: Alternar Estado
  const toggleMutation = useMutation({
    mutationFn: async (distId: string) => {
      const response = await catalogServices.toggleDistrict(distId);
      return response.data;
    },
    onSuccess: data => {
      queryClient.invalidateQueries({ queryKey: districtsKeys.all });
      alert.showAlert({
        type: 'success',
        title: `${data.message || 'Estado actualizado'}`,
        show: true,
      });
    },
    onError: err => {
      console.error('Error al cambiar estado del distrito:', err);
    },
  });

  const addDistrict = async (form: DistrictForm) => {
    return await addMutation.mutateAsync(form);
  };

  const editDistrict = async (form: DistrictForm) => {
    return await editMutation.mutateAsync(form);
  };

  const toggleDistrict = async (distId: string) => {
    return await toggleMutation.mutateAsync(distId);
  };

  const getDistricts = async () => {
    const res = await refetch();
    return res.data?.data ?? [];
  };

  const getMunicipalities = async () => {
    return municipalities.value;
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
    filter.id_municipality = undefined;
    appliedFilter.filter_name = undefined;
    appliedFilter.status = undefined;
    appliedFilter.id_municipality = undefined;
    pagination.page = 1;
  };

  const setDistrictItem = (value: DistrictResponse) => {
    setFieldValue('id', value?.id);
    setFieldValue('name', value?.name);
    setFieldValue('description', value?.description);
    setFieldValue('active', value?.active);
    setFieldValue('municipality', value?.municipality);
  };

  const findDistrict = (value?: FilterDistrictType) => {
    pagination.page = 1;
    const target = value && typeof value === 'object' && !('target' in value) ? value : filter;
    appliedFilter.filter_name = (target?.filter_name ?? filter.filter_name) || undefined;
    appliedFilter.status = target?.status ?? filter.status;
    appliedFilter.id_municipality = target?.id_municipality ?? filter.id_municipality;
  };

  const debouncedFindDistrict = debounce(() => {
    findDistrict();
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
    getDistricts,
    validateAlphaInput,
    cleanSearch,
    debouncedCleanSearch,
    setDistrictItem,
    findDistrict,
    debouncedFindDistrict,
    getMunicipalities,
    id,
    idAttrs,
    name,
    nameAttrs,
    description,
    descriptionAttrs,
    active,
    activeAttrs,
    municipality,
    municipalityAttrs,
    alert,
    filter,
    appliedFilter,
    pagination,
    municipalities,
    districts,
    isPending,
    isFetching,
    addDistrict,
    editDistrict,
    toggleDistrict,
    addMutation,
    editMutation,
    toggleMutation,
  };
}

export default useDistrict;
