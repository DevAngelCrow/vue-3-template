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
import { MunicipalityResponse } from '../interfaces/municipalities/municipality.response.interface';
import { MunicipalityForm } from '../interfaces/municipalities/municipality.form.interface';
import { Department } from '../interfaces/municipalities/municipality.department.interface';
import { DepartmentResponse } from '../interfaces/deparments/department.response.interface';
import { departmentsKeys } from './useDepartment';

export type FilterMunicipalityType = {
  filter_name?: string;
  status?: boolean | 'Todos';
  id_department?: string;
};

export const municipalitiesKeys = createQueryKeys<
  FilterMunicipalityType & { page?: number; per_page?: number }
>('municipalities');

export function useMunicipality() {
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
        .required('El nombre del municipio es requerido')
        .min(3, 'El nombre de tener al menos 3 caracteres')
        .max(150, 'El nombre no puede tener más de 255 caracteres'),
      description: yup
        .string()
        .required('La descripción es requerida')
        .min(5, 'La descripción debe tener al menos 5 caracteres')
        .max(150, 'La descripción no puede tener más de 255 caracteres')
        .nullable(),
      department: yup
        .mixed<Department>()
        .required('El campo de departamento es requerido'),
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
      field: 'department.name',
      header: 'Departamento',
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
  const [department, departmentAttrs] = defineField('department');
  const [active, activeAttrs] = defineField('active');

  const filter = reactive<FilterMunicipalityType>({
    filter_name: undefined,
    status: undefined,
    id_department: undefined,
  });

  const appliedFilter = reactive<FilterMunicipalityType>({
    filter_name: undefined,
    status: undefined,
    id_department: undefined,
  });

  const findRegex = /[^a-zA-ZáÁéÉíÍóÓúÚñÑ.0-9 ]/g;

  // Consulta en caché para selector de departamentos
  const { data: departmentsData } = useQuery({
    queryKey: computed(() => departmentsKeys.list({ status: true })),
    queryFn: async () => {
      const response = await catalogServices.getAllDepartments({ active: true });
      return response.data.data ?? [];
    },
    staleTime: 1000 * 60 * 10,
  });

  const departments = computed<DepartmentResponse[]>(() => departmentsData.value || []);

  // Consulta paginada y reactiva de municipios
  const {
    data: queryResult,
    isPending,
    isFetching,
    refetch,
  } = useQuery({
    queryKey: computed(() =>
      municipalitiesKeys.list({
        page: pagination.page,
        per_page: pagination.per_page,
        filter_name: appliedFilter.filter_name || undefined,
        status:
          appliedFilter.status === 'Todos' ? undefined : appliedFilter.status,
        id_department: appliedFilter.id_department || undefined,
      }),
    ),
    queryFn: async () => {
      const response = await catalogServices.getMunicipalities({
        page: pagination.page,
        per_page: pagination.per_page,
        filter_name: appliedFilter.filter_name || undefined,
        status:
          appliedFilter.status === 'Todos' ? undefined : appliedFilter.status,
        id_department: appliedFilter.id_department || undefined,
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

  const municipalities = computed<MunicipalityResponse[]>(
    () => queryResult.value?.data ?? [],
  );

  // Mutación: Registrar Municipio
  const addMutation = useMutation({
    mutationFn: async (form: MunicipalityForm) => {
      const response = await catalogServices.postMunicipality({
        ...form,
        active: true,
      });
      return response.data;
    },
    onSuccess: data => {
      queryClient.invalidateQueries({ queryKey: municipalitiesKeys.all });
      alert.showAlert({
        type: 'success',
        title: `${data.message || 'Municipio registrado'}`,
        show: true,
      });
    },
    onError: err => {
      console.error('Error al registrar municipio:', err);
    },
  });

  // Mutación: Editar Municipio
  const editMutation = useMutation({
    mutationFn: async (form: MunicipalityForm) => {
      const { id: munId, ...body } = form;
      const response = await catalogServices.putMunicipality(munId!, body);
      return response.data;
    },
    onSuccess: data => {
      queryClient.invalidateQueries({ queryKey: municipalitiesKeys.all });
      alert.showAlert({
        type: 'success',
        title: `${data.message || 'Municipio actualizado'}`,
        show: true,
      });
    },
    onError: err => {
      console.error('Error al editar municipio:', err);
    },
  });

  // Mutación: Alternar Estado
  const toggleMutation = useMutation({
    mutationFn: async (munId: string) => {
      const response = await catalogServices.toggleMunicipality(munId);
      return response.data;
    },
    onSuccess: data => {
      queryClient.invalidateQueries({ queryKey: municipalitiesKeys.all });
      alert.showAlert({
        type: 'success',
        title: `${data.message || 'Estado actualizado'}`,
        show: true,
      });
    },
    onError: err => {
      console.error('Error al cambiar estado del municipio:', err);
    },
  });

  const addMunicipality = async (form: MunicipalityForm) => {
    return await addMutation.mutateAsync(form);
  };

  const editMunicipality = async (form: MunicipalityForm) => {
    return await editMutation.mutateAsync(form);
  };

  const toggleMunicipality = async (munId: string) => {
    return await toggleMutation.mutateAsync(munId);
  };

  const getMunicipalities = async () => {
    const res = await refetch();
    return res.data?.data ?? [];
  };

  const getDepartments = async () => {
    return departments.value;
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
    filter.id_department = undefined;
    appliedFilter.filter_name = undefined;
    appliedFilter.status = undefined;
    appliedFilter.id_department = undefined;
    pagination.page = 1;
  };

  const setMunicipalityItem = (value: MunicipalityResponse) => {
    setFieldValue('id', value?.id);
    setFieldValue('name', value?.name);
    setFieldValue('description', value?.description);
    setFieldValue('active', value?.active);
    setFieldValue('department', value?.department);
  };

  const findMunicipality = (value: FilterMunicipalityType) => {
    pagination.page = 1;
    appliedFilter.filter_name = (value?.filter_name ?? filter.filter_name) || undefined;
    appliedFilter.status = value?.status ?? filter.status;
    appliedFilter.id_department = value?.id_department ?? filter.id_department;
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
    getMunicipalities,
    validateAlphaInput,
    cleanSearch,
    setMunicipalityItem,
    findMunicipality,
    getDepartments,
    id,
    idAttrs,
    name,
    nameAttrs,
    description,
    descriptionAttrs,
    active,
    activeAttrs,
    department,
    departmentAttrs,
    alert,
    filter,
    appliedFilter,
    pagination,
    departments,
    municipalities,
    isPending,
    isFetching,
    addMunicipality,
    editMunicipality,
    toggleMunicipality,
    addMutation,
    editMutation,
    toggleMutation,
  };
}

export default useMunicipality;
