import type { App } from 'vue';
import { QueryClient, VueQueryPlugin } from '@tanstack/vue-query';

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

export const registerVueQuery = (app: App): void => {
  app.use(VueQueryPlugin, {
    queryClient,
  });
};

export default registerVueQuery;
