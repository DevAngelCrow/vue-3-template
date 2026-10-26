import type { App } from 'vue';
import { QueryClient, VueQueryPlugin } from '@tanstack/vue-query';

import { useLoaderStore } from '../store/useLoaderStore';

interface HttpErrorLike {
  statusCode?: number;
  response?: {
    status?: number;
  };
}

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutos de vigencia de datos
      gcTime: 1000 * 60 * 15, // 15 minutos en caché antes de garbage collection
      refetchOnWindowFocus: false, // Evita refetch automático al cambiar de ventana/pestaña
      retry: (failureCount, error) => {
        const httpError = error as HttpErrorLike;
        const status = httpError?.statusCode ?? httpError?.response?.status;

        // No reintentar en errores de cliente definitivos
        if (status && [400, 401, 403, 404, 422].includes(status)) {
          return false;
        }

        // Reintentar máximo 1 vez para errores transitorios de red / servidor
        return failureCount < 1;
      },
    },
    mutations: {
      retry: false, // Las mutaciones no deben reintentarse automáticamente por seguridad
    },
  },
});

/**
 * Sincroniza de forma reactiva los eventos de consultas y mutaciones de TanStack Query
 * con el Pinia store `useLoaderStore`.
 */
export const initQueryLoaderSync = (client: QueryClient = queryClient): (() => void) => {
  const loaderStore = useLoaderStore();

  const syncQueries = () => {
    // Queries fetching (excluyendo aquellas con meta.skipLoader: true)
    const fetchingCount = client.isFetching({
      predicate: query => query.meta?.skipLoader !== true,
    });
    loaderStore.setQueryFetchingCount(fetchingCount);

    // Queries en primera carga (status pending & fetchStatus fetching)
    const pendingQueries = client.getQueryCache().findAll({
      fetchStatus: 'fetching',
      predicate: query =>
        query.state.status === 'pending' && query.meta?.skipLoader !== true,
    });
    loaderStore.setQueryPendingCount(pendingQueries.length);
  };

  const syncMutations = () => {
    // Mutaciones en ejecución (excluyendo aquellas con meta.skipLoader: true)
    const mutatingCount = client.isMutating({
      predicate: mutation => mutation.meta?.skipLoader !== true,
    });
    loaderStore.setMutationPendingCount(mutatingCount);
  };

  const unsubscribeQueries = client.getQueryCache().subscribe(syncQueries);
  const unsubscribeMutations = client.getMutationCache().subscribe(syncMutations);

  // Sincronizar estado inicial
  syncQueries();
  syncMutations();

  return () => {
    unsubscribeQueries();
    unsubscribeMutations();
  };
};

export const registerVueQuery = (app: App): void => {
  app.use(VueQueryPlugin, {
    queryClient,
  });

  initQueryLoaderSync(queryClient);
};

export default registerVueQuery;
