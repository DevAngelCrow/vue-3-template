/**
 * Factoría para estandarizar las claves de consulta (Query Keys) en TanStack Query.
 * Permite invalidar y manejar cachés con consistencia y tipado seguro.
 */
export const createQueryKeys = <TFilters = Record<string, unknown>>(
  entity: string,
) => ({
  all: [entity] as const,
  lists: () => [entity, 'list'] as const,
  list: (filters?: TFilters) => [entity, 'list', filters] as const,
  details: () => [entity, 'detail'] as const,
  detail: (id: string | number) => [entity, 'detail', id] as const,
});

export default createQueryKeys;
