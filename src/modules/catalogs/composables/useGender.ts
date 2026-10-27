import { computed, nextTick, reactive, ref, watch } from 'vue';
import { keepPreviousData, useQuery } from '@tanstack/vue-query';

import { TableHeaders } from '@/core/interfaces';
import { debounce } from '@/core/utils/debounceFunction';
import { sanitizedValueInput } from '@/core/utils/inputTextValidations';
import { createQueryKeys } from '@/core/utils/queryKeys';

import catalogServices from '../Services/catalog.services';
import { GenderResponse } from '../interfaces/gender/gender.response.interface';

export const gendersKeys = createQueryKeys<{
  page?: number;
  per_page?: number;
  filter?: string | null;
}>('genders');

export function useGender() {
  const headers = ref<TableHeaders[]>([
    {
      field: 'name',
      header: 'Nombre',
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

  const filter_name = ref<string | null>(null);
  const appliedFilterName = ref<string | null>(null);
  const findRegex = /[^a-zA-ZáÁéÉíÍóÓúÚñÑ.0-9 ]/g;

  // Consulta paginada y reactiva de géneros
  const {
    data: queryResult,
    isPending,
    isFetching,
    refetch,
  } = useQuery({
    queryKey: computed(() =>
      gendersKeys.list({
        page: pagination.page,
        per_page: pagination.per_page,
        filter: appliedFilterName.value || undefined,
      }),
    ),
    queryFn: async () => {
      const response = await catalogServices.getGenders({
        page: pagination.page,
        per_page: pagination.per_page,
        filter: appliedFilterName.value || undefined,
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

  const genders = computed<GenderResponse[]>(
    () => queryResult.value?.data ?? [],
  );

  const getGenders = async () => {
    const res = await refetch();
    return res.data?.data ?? [];
  };

  const validateAlphaInput = (
    value: string | null,
    regex: RegExp = findRegex,
  ) => {
    if (!value) {
      value = '';
    }
    const sanitizedValue = sanitizedValueInput(value, regex);
    nextTick(() => {
      filter_name.value = sanitizedValue;
    });
  };

  const cleanSearch = () => {
    filter_name.value = null;
    appliedFilterName.value = null;
    pagination.page = 1;
  };

  const findGender = (value?: string | null) => {
    pagination.page = 1;
    const target = typeof value === 'string' ? value : filter_name.value;
    appliedFilterName.value = target || null;
  };

  const debouncedFindGender = debounce(() => {
    findGender();
  }, 700);
  const debouncedCleanSearch = debounce(() => {
    cleanSearch();
  }, 700);

  return {
    headers,
    genders,
    pagination,
    filter_name,
    isPending,
    isFetching,
    getGenders,
    validateAlphaInput,
    cleanSearch,
    debouncedCleanSearch,
    findGender,
    debouncedFindGender,
  };
}

export default useGender;
