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
import { GeographicDivisionResponse } from '../interfaces/geographic-division/geographic-division.response.interface';
import { GeographicDivisionForm } from '../interfaces/geographic-division/geographic-division.form.interface';
import { GeographicDivisionTypeSimple } from '../interfaces/geographic-division/geographic-division.type.interface';
import { GeographicDivisionParent } from '../interfaces/geographic-division/geographic-division.parent.interface';
import catalogServices from '../Services/catalog.services';
import { countriesKeys } from './useCountries';

export type FilterGeographicDivisionType = {
  filter?: string;
  status?: boolean | 'Todos';
  id_country?: string;
  id_type?: string;
  id_parent?: string;
};

export const geographicDivisionsKeys = createQueryKeys<
  FilterGeographicDivisionType & { page?: number; per_page?: number }
>('geographic-divisions');

export function useGeographicDivision() {
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
      description: yup
        .string()
        .min(3, 'La descripción debe tener al menos 3 caracteres')
        .max(255, 'La descripción debe tener menos de 255 caracteres')
        .nullable(),
      country: yup.mixed<CountryResponse>().required('El país es requerido'),
      divisionType: yup
        .mixed<GeographicDivisionTypeSimple>()
        .required('El tipo de división es requerido'),
      parent: yup.mixed<GeographicDivisionParent>().nullable(),
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
      field: 'country.name',
      header: 'País',
      sortable: false,
      alignHeaders: 'start',
      alignItems: 'start',
    },
    {
      field: 'type.name',
      header: 'Tipo',
      sortable: false,
      alignHeaders: 'start',
      alignItems: 'start',
    },
    {
      field: 'parent.name',
      header: 'Pertenece a',
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
  const [country, countryAttrs] = defineField('country');
  const [divisionType, divisionTypeAttrs] = defineField('divisionType');
  const [parent, parentAttrs] = defineField('parent');
  const [active, activeAttrs] = defineField('active');

  const filter = reactive<FilterGeographicDivisionType>({
    filter: undefined,
    status: undefined,
    id_country: undefined,
    id_type: undefined,
    id_parent: undefined,
  });

  const appliedFilter = reactive<FilterGeographicDivisionType>({
    filter: undefined,
    status: undefined,
    id_country: undefined,
    id_type: undefined,
    id_parent: undefined,
  });

  const findRegex = /[^a-zA-ZáÁéÉíÍóÓúÚñÑ.0-9 ]/g;

  // Cache para lista de países
  const { data: countriesData } = useQuery({
    queryKey: computed(() => countriesKeys.list({ status: true })),
    queryFn: async () => {
      const response = await catalogServices.getAllCountries({ status: true });
      return response.data.data ?? [];
    },
    staleTime: 1000 * 60 * 10,
  });

  const countries = computed<CountryResponse[]>(() => countriesData.value || []);

  const divisionTypesList = ref<GeographicDivisionTypeSimple[]>([]);
  const parentDivisionsList = ref<GeographicDivisionParent[]>([]);

  const getDivisionTypesList = async (params?: { id_country?: string }) => {
    try {
      const response = await catalogServices.getAllGeographicDivisionTypes({
        active: true,
        per_page: 100,
        ...(params?.id_country ? { id_country: params.id_country } : {}),
      });
      if (response.statusCode === 200) {
        divisionTypesList.value = response.data.data;
      }
    } catch (error) {
      console.error(error);
    }
  };

  const getParentDivisionsList = async (params?: { id_country?: string }) => {
    try {
      const response = await catalogServices.getAllGeographicDivisionsCursor({
        active: true,
        limit: 100,
        ...(params?.id_country ? { id_country: params.id_country } : {}),
      });
      if (response.statusCode === 200) {
        parentDivisionsList.value = response.data.data;
      }
    } catch (error) {
      console.error(error);
    }
  };

  // Consulta paginada y reactiva de divisiones geográficas
  const {
    data: queryResult,
    isPending,
    isFetching,
    refetch,
  } = useQuery({
    queryKey: computed(() =>
      geographicDivisionsKeys.list({
        page: pagination.page,
        per_page: pagination.per_page,
        filter: appliedFilter.filter || undefined,
        status:
          appliedFilter.status === 'Todos' ? undefined : appliedFilter.status,
        id_country: appliedFilter.id_country || undefined,
        id_type: appliedFilter.id_type || undefined,
        id_parent: appliedFilter.id_parent || undefined,
      }),
    ),
    queryFn: async () => {
      const response = await catalogServices.getAllGeographicDivisions({
        page: pagination.page,
        per_page: pagination.per_page,
        filter: appliedFilter.filter || undefined,
        active:
          appliedFilter.status === 'Todos' ? undefined : appliedFilter.status,
        id_country: appliedFilter.id_country || undefined,
        id_type: appliedFilter.id_type || undefined,
        id_parent: appliedFilter.id_parent || undefined,
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

  const divisions = computed<GeographicDivisionResponse[]>(
    () => queryResult.value?.data ?? [],
  );

  // Mutación: Registrar División
  const addMutation = useMutation({
    mutationFn: async (form: GeographicDivisionForm) => {
      const response = await catalogServices.postGeographicDivision({
        ...form,
        active: true,
      });
      return response.data;
    },
    onSuccess: data => {
      queryClient.invalidateQueries({
        queryKey: geographicDivisionsKeys.all,
      });
      alert.showAlert({
        type: 'success',
        title: `${data.message || 'División registrada'}`,
        show: true,
      });
    },
    onError: err => {
      console.error('Error al registrar división geográfica:', err);
    },
  });

  // Mutación: Editar División
  const editMutation = useMutation({
    mutationFn: async (form: GeographicDivisionForm) => {
      const { id: divId, ...body } = form;
      if (!divId) {
        throw new Error('ID de división no proporcionado');
      }
      const response = await catalogServices.putGeographicDivision(divId, body);
      return response.data;
    },
    onSuccess: data => {
      queryClient.invalidateQueries({
        queryKey: geographicDivisionsKeys.all,
      });
      alert.showAlert({
        type: 'success',
        title: `${data?.message || 'División actualizada'}`,
        show: true,
      });
    },
    onError: err => {
      console.error('Error al editar división geográfica:', err);
    },
  });

  // Mutación: Alternar Estado
  const toggleMutation = useMutation({
    mutationFn: async (divId: string) => {
      const response = await catalogServices.patchGeographicDivision(divId);
      return response.data;
    },
    onSuccess: data => {
      queryClient.invalidateQueries({
        queryKey: geographicDivisionsKeys.all,
      });
      alert.showAlert({
        type: 'success',
        title: `${data.message || 'Estado actualizado'}`,
        show: true,
      });
    },
    onError: err => {
      console.error('Error al cambiar estado de división:', err);
    },
  });

  const addDivision = async (form: GeographicDivisionForm) => {
    return await addMutation.mutateAsync(form);
  };

  const editDivision = async (form: GeographicDivisionForm) => {
    return await editMutation.mutateAsync(form);
  };

  const toggleDivision = async (divId: string) => {
    return await toggleMutation.mutateAsync(divId);
  };

  const getDivisions = async () => {
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
    filter.id_type = undefined;
    filter.id_parent = undefined;
    appliedFilter.filter = undefined;
    appliedFilter.status = undefined;
    appliedFilter.id_country = undefined;
    appliedFilter.id_type = undefined;
    appliedFilter.id_parent = undefined;
    pagination.page = 1;
  };

  const setDivisionItem = (value: GeographicDivisionResponse) => {
    setFieldValue('id', value?.id);
    setFieldValue('name', value?.name);
    setFieldValue('description', value?.description);
    setFieldValue('active', value?.active);
    setFieldValue('country', value?.country);
    setFieldValue('divisionType', value?.type);
    setFieldValue('parent', value?.parent ?? null);
  };

  const findDivision = (value?: FilterGeographicDivisionType) => {
    pagination.page = 1;
    const target = value && typeof value === 'object' && !('target' in value) ? value : filter;
    appliedFilter.filter = (target?.filter ?? filter.filter) || undefined;
    appliedFilter.status = target?.status ?? filter.status;
    appliedFilter.id_country = target?.id_country ?? filter.id_country;
    appliedFilter.id_type = target?.id_type ?? filter.id_type;
    appliedFilter.id_parent = target?.id_parent ?? filter.id_parent;
  };

  const debouncedFindDivision = debounce(() => {
    findDivision();
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
    getDivisions,
    getDivisionTypesList,
    getParentDivisionsList,
    validateAlphaInput,
    cleanSearch,
    debouncedCleanSearch,
    setDivisionItem,
    findDivision,
    debouncedFindDivision,
    getCountries,
    id,
    idAttrs,
    name,
    nameAttrs,
    description,
    descriptionAttrs,
    active,
    activeAttrs,
    country,
    countryAttrs,
    divisionType,
    divisionTypeAttrs,
    parent,
    parentAttrs,
    alert,
    filter,
    appliedFilter,
    pagination,
    countries,
    divisionTypesList,
    parentDivisionsList,
    divisions,
    isPending,
    isFetching,
    addDivision,
    editDivision,
    toggleDivision,
    addMutation,
    editMutation,
    toggleMutation,
  };
}

export default useGeographicDivision;
