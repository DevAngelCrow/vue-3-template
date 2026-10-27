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

import { CountryResponse } from '../interfaces/country.response.interface';
import { GeographicDivisionTypeResponse } from '../interfaces/geographic-division-type/geographic-division-type.response.interface';
import { GeographicDivisionTypeForm } from '../interfaces/geographic-division-type/geographic-division-type.form.interface';
import catalogServices from '../Services/catalog.services';
import { countriesKeys } from './useCountries';

export type FilterDivisionType = {
  filter?: string;
  status?: boolean | 'Todos';
  id_country?: string;
};

export const geographicDivisionTypesKeys = createQueryKeys<
  FilterDivisionType & { page?: number; per_page?: number }
>('geographic-division-types');

export function useGeographicDivisionType() {
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
        .required('El nombre es requerido')
        .min(3, 'El nombre debe tener al menos 3 caracteres')
        .max(150, 'El nombre debe tener menos de 150 caracteres'),
      level: yup
        .number()
        .typeError('El nivel debe ser un número')
        .required('El nivel es requerido')
        .min(1, 'El nivel debe ser mayor o igual a 1'),
      country: yup.mixed<CountryResponse>().required('El país es requerido'),
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
      field: 'level',
      header: 'Nivel',
      sortable: false,
      alignHeaders: 'center',
      alignItems: 'center',
      width: 10,
    },
    {
      field: 'country.name',
      header: 'País',
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
  const [level, levelAttrs] = defineField('level');
  const [country, countryAttrs] = defineField('country');
  const [active, activeAttrs] = defineField('active');

  const filter = reactive<FilterDivisionType>({
    filter: undefined,
    status: undefined,
    id_country: undefined,
  });

  const appliedFilter = reactive<FilterDivisionType>({
    filter: undefined,
    status: undefined,
    id_country: undefined,
  });

  const findRegex = /[^a-zA-ZáÁéÉíÍóÓúÚñÑ.0-9 ]/g;

  // Consulta en caché para selector de países
  const { data: countriesData } = useQuery({
    queryKey: computed(() => countriesKeys.list({ status: true })),
    queryFn: async () => {
      const response = await catalogServices.getAllCountries({ status: true });
      return response.data.data ?? [];
    },
    staleTime: 1000 * 60 * 10,
  });

  const countries = computed<CountryResponse[]>(() => countriesData.value || []);

  // Consulta paginada y reactiva de tipos de división geográfica
  const {
    data: queryResult,
    isPending,
    isFetching,
    refetch,
  } = useQuery({
    queryKey: computed(() =>
      geographicDivisionTypesKeys.list({
        page: pagination.page,
        per_page: pagination.per_page,
        filter: appliedFilter.filter || undefined,
        status:
          appliedFilter.status === 'Todos' ? undefined : appliedFilter.status,
        id_country: appliedFilter.id_country || undefined,
      }),
    ),
    queryFn: async () => {
      const response = await catalogServices.getAllGeographicDivisionTypes({
        page: pagination.page,
        per_page: pagination.per_page,
        filter: appliedFilter.filter || undefined,
        active:
          appliedFilter.status === 'Todos' ? undefined : appliedFilter.status,
        id_country: appliedFilter.id_country || undefined,
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

  const divisionTypes = computed<GeographicDivisionTypeResponse[]>(
    () => queryResult.value?.data ?? [],
  );

  // Mutación: Registrar Tipo de División
  const addMutation = useMutation({
    mutationFn: async (form: GeographicDivisionTypeForm) => {
      const response = await catalogServices.postGeographicDivisionType({
        ...form,
        active: true,
      });
      return response.data;
    },
    onSuccess: data => {
      queryClient.invalidateQueries({
        queryKey: geographicDivisionTypesKeys.all,
      });
      alert.showAlert({
        type: 'success',
        title: `${data.message || 'Tipo de división registrado'}`,
        show: true,
      });
    },
    onError: err => {
      console.error('Error al registrar tipo de división:', err);
    },
  });

  // Mutación: Editar Tipo de División
  const editMutation = useMutation({
    mutationFn: async (form: GeographicDivisionTypeForm) => {
      const { id: divId, ...body } = form;
      if (!divId) return;
      const response = await catalogServices.putGeographicDivisionType(
        divId,
        body,
      );
      return response.data;
    },
    onSuccess: data => {
      queryClient.invalidateQueries({
        queryKey: geographicDivisionTypesKeys.all,
      });
      alert.showAlert({
        type: 'success',
        title: `${data?.message || 'Tipo de división actualizado'}`,
        show: true,
      });
    },
    onError: err => {
      console.error('Error al editar tipo de división:', err);
    },
  });

  // Mutación: Alternar Estado
  const toggleMutation = useMutation({
    mutationFn: async (divId: string) => {
      const response =
        await catalogServices.patchGeographicDivisionType(divId);
      return response.data;
    },
    onSuccess: data => {
      queryClient.invalidateQueries({
        queryKey: geographicDivisionTypesKeys.all,
      });
      alert.showAlert({
        type: 'success',
        title: `${data.message || 'Estado actualizado'}`,
        show: true,
      });
    },
    onError: err => {
      console.error('Error al cambiar estado de tipo de división:', err);
    },
  });

  const addDivisionType = async (form: GeographicDivisionTypeForm) => {
    return await addMutation.mutateAsync(form);
  };

  const editDivisionType = async (form: GeographicDivisionTypeForm) => {
    return await editMutation.mutateAsync(form);
  };

  const toggleDivisionType = async (divId: string) => {
    return await toggleMutation.mutateAsync(divId);
  };

  const getDivisionTypes = async () => {
    const res = await refetch();
    return res.data?.data ?? [];
  };

  const getCountries = async () => {
    return countries.value;
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
      filter.filter = sanitizedValue;
    });
  };

  const cleanSearch = () => {
    filter.filter = undefined;
    filter.status = undefined;
    filter.id_country = undefined;
    appliedFilter.filter = undefined;
    appliedFilter.status = undefined;
    appliedFilter.id_country = undefined;
    pagination.page = 1;
  };

  const setDivisionTypeItem = (value: GeographicDivisionTypeResponse) => {
    setFieldValue('id', value?.id);
    setFieldValue('name', value?.name);
    setFieldValue('level', value?.level);
    setFieldValue('active', value?.active);
    setFieldValue('country', value?.country);
  };

  const findDivisionType = (value?: FilterDivisionType) => {
    pagination.page = 1;
    const target = value && typeof value === 'object' && !('target' in value) ? value : filter;
    appliedFilter.filter = (target?.filter ?? filter.filter) || undefined;
    appliedFilter.status = target?.status ?? filter.status;
    appliedFilter.id_country = target?.id_country ?? filter.id_country;
  };

  const debouncedFindDivisionType = debounce(() => {
    findDivisionType();
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
    getDivisionTypes,
    validateAlphaInput,
    cleanSearch,
    debouncedCleanSearch,
    setDivisionTypeItem,
    findDivisionType,
    debouncedFindDivisionType,
    getCountries,
    id,
    idAttrs,
    name,
    nameAttrs,
    level,
    levelAttrs,
    active,
    activeAttrs,
    country,
    countryAttrs,
    alert,
    filter,
    appliedFilter,
    pagination,
    countries,
    divisionTypes,
    isPending,
    isFetching,
    addDivisionType,
    editDivisionType,
    toggleDivisionType,
    addMutation,
    editMutation,
    toggleMutation,
  };
}

export default useGeographicDivisionType;
