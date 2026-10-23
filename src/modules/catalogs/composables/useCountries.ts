import { computed, nextTick, reactive, watch } from 'vue';
import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/vue-query';
import { useForm } from 'vee-validate';
import * as yup from 'yup';

import { useAlertStore } from '@/core/store';
import { sanitizedValueInput } from '@/core/utils/inputTextValidations';
import { createQueryKeys } from '@/core/utils/queryKeys';

import { CreateCountry } from '../interfaces/country.create.interface';
import { UpdateCountry } from '../interfaces/country.update.interface';
import { CountryResponse } from '../interfaces/country.response.interface';
import catalogServices from '../Services/catalog.services';

export type FilterCountryType = {
  filter_name?: string;
  status?: boolean | 'Todos';
};

export const countriesKeys = createQueryKeys<FilterCountryType & { page?: number; per_page?: number }>('countries');

export function useCountries() {
  const alert = useAlertStore();
  const queryClient = useQueryClient();

  // Filtros del formulario de búsqueda
  const filter = reactive<FilterCountryType>({
    filter_name: undefined,
    status: undefined,
  });

  // Filtros aplicados a la consulta actual
  const appliedFilter = reactive<FilterCountryType>({
    filter_name: undefined,
    status: undefined,
  });

  // Estado de paginación
  const pagination = reactive({
    page: 1,
    per_page: 10,
    total_items: 0,
  });

  // Query reactiva para obtener países
  const {
    data: queryResult,
    isPending,
    isFetching,
    error,
    refetch,
  } = useQuery({
    queryKey: computed(() =>
      countriesKeys.list({
        page: pagination.page,
        per_page: pagination.per_page,
        filter_name: appliedFilter.filter_name || undefined,
        status:
          appliedFilter.status === 'Todos' ? undefined : appliedFilter.status,
      }),
    ),
    queryFn: async () => {
      const response = await catalogServices.getAllCountries({
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

  // Sincronizar el total de items con la respuesta del backend
  watch(
    () => queryResult.value,
    newData => {
      if (newData) {
        pagination.total_items = newData.total_items ?? 0;
      }
    },
    { immediate: true },
  );

  // Lista de países computada a partir de los datos en caché
  const items = computed<CountryResponse[]>(
    () => queryResult.value?.data ?? [],
  );

  // Mutación: Registrar País
  const createMutation = useMutation({
    mutationFn: async (data: CreateCountry) => {
      const response = await catalogServices.createCountries(data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: countriesKeys.all });
      alert.showAlert({
        type: 'success',
        title: 'País registrado',
        content: 'El país se registró exitosamente',
      });
    },
    onError: err => {
      console.error('Error al registrar país:', err);
      alert.showAlert({
        type: 'error',
        title: 'Error en el registro de país',
        content: 'Ocurrió un error al momento del registro del país',
      });
    },
  });

  // Mutación: Actualizar País
  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateCountry }) => {
      const response = await catalogServices.updateCountries(id, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: countriesKeys.all });
      alert.showAlert({
        type: 'success',
        title: 'País actualizado',
        content: 'El país se actualizó exitosamente',
      });
    },
    onError: err => {
      console.error('Error al actualizar país:', err);
      alert.showAlert({
        type: 'error',
        title: 'Error en la actualización de país',
        content: 'Ocurrió un error al momento de actualizar el país',
      });
    },
  });

  // Mutación: Cambiar Estado
  const changeStatusMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await catalogServices.changeStatusCountry(id);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: countriesKeys.all });
      alert.showAlert({
        type: 'success',
        title: 'Estado actualizado',
        content: 'El estado del país se actualizó exitosamente',
      });
    },
    onError: err => {
      console.error('Error al cambiar estado del país:', err);
      alert.showAlert({
        type: 'error',
        title: 'Error en el cambio de estado del país',
        content: 'Ocurrió un error al momento de cambiar el estado del país',
      });
    },
  });

  // Métodos de búsqueda
  const findCountries = (value?: FilterCountryType) => {
    pagination.page = 1;
    appliedFilter.filter_name =
      (value?.filter_name ?? filter.filter_name) || undefined;
    appliedFilter.status = value?.status ?? filter.status;
  };

  const cleanSearch = () => {
    filter.filter_name = undefined;
    filter.status = undefined;
    appliedFilter.filter_name = undefined;
    appliedFilter.status = undefined;
    pagination.page = 1;
  };

  // Compatibilidad hacia atrás para llamadas directas
  const createCountry = async (data: CreateCountry) => {
    return await createMutation.mutateAsync(data);
  };

  const updateCountry = async (id: string, data: UpdateCountry) => {
    return await updateMutation.mutateAsync({ id, data });
  };

  const changeStatusCountry = async (id: string) => {
    return await changeStatusMutation.mutateAsync(id);
  };

  const getCountries = async () => {
    const result = await refetch();
    return result.data?.data ?? [];
  };

  // Formulario y validaciones con VeeValidate + Yup
  const { handleSubmit, validateField, defineField, errors, resetForm } =
    useForm({
      validateOnMount: false,
      initialValues: {
        name: '',
        abbreviation: '',
        code: '',
        iso2: '',
        phone_code: '',
      },
      validationSchema: yup.object({
        name: yup
          .string()
          .required('El nombre es obligatorio')
          .min(3, 'El nombre debe tener al menos 3 caracteres')
          .max(150, 'El nombre no puede tener más de 150 caracteres')
          .matches(/^[a-zA-ZáÁéÉíÍóÓúÚñÑ ]*$/, 'No caracteres invalidos')
          .transform(
            value => value?.replace(/[^a-zA-ZáÁéÉíÍóÓúÚñÑ ]/g, '') || '',
          ),
        abbreviation: yup
          .string()
          .required('La abreviación es obligatoria')
          .min(2, 'La abreviación debe tener al menos 2 caracteres')
          .max(150, 'La abreviación no puede tener más de 150 caracteres')
          .matches(/^[a-zA-ZáÁéÉíÍóÓúÚñÑ ]*$/, 'No caracteres invalidos')
          .transform(
            value => value?.replace(/[^a-zA-ZáÁéÉíÍóÓúÚñÑ ]/g, '') || '',
          ),
        code: yup
          .string()
          .required('El código es obligatorio')
          .min(3, 'El código debe tener al menos 3 caracteres')
          .max(150, 'El código no puede tener más de 150 caracteres')
          .matches(
            /^[a-zA-ZáÁéÉíÍóÓúÚñÑ0-9 ]*$/,
            'Solo se permiten letras, números y espacios',
          )
          .transform(
            value => value?.replace(/[^a-zA-ZáÁéÉíÍóÓúÚñÑ0-9 ]/g, '') || '',
          ),
        iso2: yup
          .string()
          .required('El código ISO2 es obligatorio')
          .length(2, 'El código ISO2 debe tener 2 caracteres')
          .matches(/^[A-Z]{2}$/i, 'Solo se permiten 2 letras'),
        phone_code: yup
          .string()
          .required('El código de teléfono es obligatorio')
          .min(1, 'El código de teléfono debe tener al menos 1 dígito')
          .max(10, 'El código de teléfono no puede tener más de 10 dígitos')
          .matches(/^\d+$/, 'Solo se permiten números'),
      }),
    });

  const [name, nameAttrs] = defineField('name');
  const [abbreviation, abbreviationAttrs] = defineField('abbreviation');
  const [code, codeAttrs] = defineField('code');
  const [iso2, iso2Attrs] = defineField('iso2');
  const [phone_code, phoneCodeAttrs] = defineField('phone_code');

  const findRegex = /[^a-zA-ZáÁéÉíÍóÓúÚñÑ.0-9 ]/g;
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

  return {
    // TanStack Query State & Methods
    items,
    isPending,
    isFetching,
    error,
    refetch,
    createMutation,
    updateMutation,
    changeStatusMutation,

    // CRUD Methods
    getCountries,
    createCountry,
    updateCountry,
    changeStatusCountry,

    // Filtros y Paginación
    filter,
    appliedFilter,
    pagination,
    findCountries,
    cleanSearch,
    validateAlphaInput,

    // Formulario VeeValidate
    handleSubmit,
    validateField,
    name,
    nameAttrs,
    abbreviation,
    abbreviationAttrs,
    code,
    codeAttrs,
    iso2,
    iso2Attrs,
    phone_code,
    phoneCodeAttrs,
    errors,
    resetForm,
  };
}

export default useCountries;
