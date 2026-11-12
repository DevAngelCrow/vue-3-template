import { computed, type Ref } from 'vue';
import { useQuery } from '@tanstack/vue-query';

import type { ApiResponseGenericSingle } from '@/core/services/interfaces/apiResponseGenericSingle.interface';
import { httpClient } from '@/core/utils/httpClient';
import type { CountryResponse } from '@/modules/catalogs/interfaces/country.response.interface';
import type { GeographicDivisionResponse } from '@/modules/catalogs/interfaces/geographic-division/geographic-division.response.interface';

export interface UsePublicGeoCatalogsOptions {
  divisionLevel?: number;
  skipGlobalAlert?: boolean;
}

const THIRTY_MINUTES_MS = 1000 * 60 * 30;

/**
 * Consume los catálogos geográficos @Public() del backend (países y divisiones)
 * utilizando TanStack Query con caché de 30 minutos y carga condicional por país.
 */
export function usePublicGeoCatalogs(
  selectedCountryId?: Ref<string | undefined>,
  options: UsePublicGeoCatalogsOptions = {},
) {
  const skipGlobalAlert = options.skipGlobalAlert ?? true;
  const divisionLevel = options.divisionLevel ?? 1;

  const countriesQuery = useQuery<CountryResponse[]>({
    queryKey: ['public-catalogs', 'countries'],
    queryFn: async () => {
      const res = await httpClient.get<
        ApiResponseGenericSingle<CountryResponse[]>
      >('/catalogs/countries/public', undefined, {
        skipGlobalAlert,
      });
      return res.data.data || [];
    },
    staleTime: THIRTY_MINUTES_MS,
    retry: false,
  });

  const divisionsQuery = useQuery<GeographicDivisionResponse[]>({
    queryKey: [
      'public-catalogs',
      'geographic-divisions',
      selectedCountryId,
      divisionLevel,
    ],
    queryFn: async () => {
      if (!selectedCountryId?.value) return [];
      const res = await httpClient.get<
        ApiResponseGenericSingle<GeographicDivisionResponse[]>
      >(
        '/catalogs/geographic-divisions/public',
        {
          id_country: selectedCountryId.value,
          level: divisionLevel,
        },
        {
          skipGlobalAlert,
        },
      );
      return res.data.data || [];
    },
    enabled: computed(() => Boolean(selectedCountryId?.value)),
    staleTime: THIRTY_MINUTES_MS,
    retry: false,
  });

  return {
    countriesQuery,
    divisionsQuery,
  };
}
