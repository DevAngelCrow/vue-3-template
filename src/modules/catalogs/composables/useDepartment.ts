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

import { Country } from '../interfaces/deparments/deparment.country.interface';
import { DepartmentResponse } from '../interfaces/deparments/department.response.interface';
import { DepartmentForm } from '../interfaces/deparments/deparment.form.interface';
import { CountryResponse } from '../interfaces/country.response.interface';
import catalogServices from '../Services/catalog.services';
import { countriesKeys } from './useCountries';

export type FilterDepartmentType = {
  filter_name?: string;
  status?: boolean | 'Todos';
  id_country?: string;
};

export const departmentsKeys = createQueryKeys<
  FilterDepartmentType & { page?: number; per_page?: number }
>('departments');

export function useDepartment() {
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
        .required('El nombre del departamento es requerido')
        .min(3, 'El nombre de tener al menos 3 caracteres')
        .max(150, 'El nombre debe tener menos de 150 caracteres'),
      description: yup
        .string()
        .min(5, 'La descripción debe tener al menos 5 caracteres')
        .max(150, 'La descripción debe tener menos de 150 caracteres')
        .nullable(),
      country: yup.mixed<Country>().required('El campo del país es requerido'),
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
  const [description, descriptionAttrs] = defineField('description');
  const [country, countryAttrs] = defineField('country');
  const [active, activeAttrs] = defineField('active');

  const filter = reactive<FilterDepartmentType>({
    filter_name: undefined,
    status: undefined,
    id_country: undefined,
  });

  const appliedFilter = reactive<FilterDepartmentType>({
    filter_name: undefined,
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
    staleTime: 1000 * 60 * 10, // 10 min de frescura para el combo
  });

  const countries = computed<CountryResponse[]>(() => countriesData.value || []);

  // Consulta paginada y reactiva de departamentos
  const {
    data: queryResult,
    isPending,
    isFetching,
    refetch,
  } = useQuery({
    queryKey: computed(() =>
      departmentsKeys.list({
        page: pagination.page,
        per_page: pagination.per_page,
        filter_name: appliedFilter.filter_name || undefined,
        status:
          appliedFilter.status === 'Todos' ? undefined : appliedFilter.status,
        id_country: appliedFilter.id_country || undefined,
      }),
    ),
    queryFn: async () => {
      const response = await catalogServices.getAllDepartments({
        page: pagination.page,
        per_page: pagination.per_page,
        filter_name: appliedFilter.filter_name || undefined,
        status:
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

  const deparments = computed<DepartmentResponse[]>(
    () => queryResult.value?.data ?? [],
  );

  // Mutación: Registrar Departamento
  const addMutation = useMutation({
    mutationFn: async (form: DepartmentForm) => {
      const response = await catalogServices.postDepartment({
        ...form,
        active: true,
      });
      return response.data;
    },
    onSuccess: data => {
      queryClient.invalidateQueries({ queryKey: departmentsKeys.all });
      alert.showAlert({
        type: 'success',
        title: `${data.message || 'Departamento registrado'}`,
        show: true,
      });
    },
    onError: err => {
      console.error('Error al registrar departamento:', err);
    },
  });

  // Mutación: Editar Departamento
  const editMutation = useMutation({
    mutationFn: async (form: DepartmentForm) => {
      const { id: depId, ...body } = form;
      const response = await catalogServices.putDepartment(depId!, body);
      return response.data;
    },
    onSuccess: data => {
      queryClient.invalidateQueries({ queryKey: departmentsKeys.all });
      alert.showAlert({
        type: 'success',
        title: `${data.message || 'Departamento actualizado'}`,
        show: true,
      });
    },
    onError: err => {
      console.error('Error al editar departamento:', err);
    },
  });

  // Mutación: Alternar Estado
  const toggleMutation = useMutation({
    mutationFn: async (depId: string) => {
      const response = await catalogServices.toggleDepartment(depId);
      return response.data;
    },
    onSuccess: data => {
      queryClient.invalidateQueries({ queryKey: departmentsKeys.all });
      alert.showAlert({
        type: 'success',
        title: `${data.message || 'Estado actualizado'}`,
        show: true,
      });
    },
    onError: err => {
      console.error('Error al cambiar estado del departamento:', err);
    },
  });

  const addDepartment = async (form: DepartmentForm) => {
    return await addMutation.mutateAsync(form);
  };

  const editDepartment = async (form: DepartmentForm) => {
    return await editMutation.mutateAsync(form);
  };

  const toggleDepartment = async (depId: string) => {
    return await toggleMutation.mutateAsync(depId);
  };

  const getDepartments = async () => {
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
      filter.filter_name = sanitizedValue;
    });
  };

  const cleanSearch = () => {
    filter.filter_name = undefined;
    filter.status = undefined;
    filter.id_country = undefined;
    appliedFilter.filter_name = undefined;
    appliedFilter.status = undefined;
    appliedFilter.id_country = undefined;
    pagination.page = 1;
  };

  const setDepartmenItem = (value: DepartmentResponse) => {
    setFieldValue('id', value?.id);
    setFieldValue('name', value?.name);
    setFieldValue('description', value?.description);
    setFieldValue('active', value?.active);
    setFieldValue('country', value?.country);
  };

  const findDepartment = (value?: FilterDepartmentType) => {
    pagination.page = 1;
    const target = value && typeof value === 'object' && !('target' in value) ? value : filter;
    appliedFilter.filter_name = (target?.filter_name ?? filter.filter_name) || undefined;
    appliedFilter.status = target?.status ?? filter.status;
    appliedFilter.id_country = target?.id_country ?? filter.id_country;
  };

  const debouncedFindDepartment = debounce(() => {
    findDepartment();
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
    getDepartments,
    validateAlphaInput,
    cleanSearch,
    debouncedCleanSearch,
    setDepartmenItem,
    findDepartment,
    debouncedFindDepartment,
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
    alert,
    filter,
    appliedFilter,
    pagination,
    countries,
    deparments,
    isPending,
    isFetching,
    addDepartment,
    editDepartment,
    toggleDepartment,
    addMutation,
    editMutation,
    toggleMutation,
  };
}

export default useDepartment;
