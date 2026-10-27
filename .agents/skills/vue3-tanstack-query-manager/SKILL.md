---
name: vue3-tanstack-query-manager
description: Use this skill when managing server state, hierarchical queryKeys, pagination with keepPreviousData, optimistic updates, cache invalidation, and alerts with TanStack Query v5 in vue-3-template.
---

# Gestión de Estado de Servidor con TanStack Query v5

Esta habilidad guía el uso avanzado de `@tanstack/vue-query` v5 en `vue-3-template`, asegurando la sincronización óptima con los endpoints de backend, invalidación inteligente de caché y alertas automáticas mediante `useAlertStore`.

---

## 1. Reglas Inviolables de TanStack Query

1. **Factoría de Claves `createQueryKeys`**:
   - Todo módulo debe definir sus claves con `createQueryKeys` importado desde `@/core/utils/queryKeys`:
     ```ts
     export const productKeys = createQueryKeys<FilterType & { page?: number; per_page?: number }>('products');
     ```
   - Esto genera automáticamente la jerarquía:
     - `productKeys.all`: `['products']`
     - `productKeys.lists()`: `['products', 'list']`
     - `productKeys.list(filters)`: `['products', 'list', filters]`
     - `productKeys.details()`: `['products', 'detail']`
     - `productKeys.detail(id)`: `['products', 'detail', id]`
2. **Claves Reactivas con `computed()`**:
   - La propiedad `queryKey` en `useQuery` debe envolverse siempre en `computed(() => ...)` para reaccionar inmediatamente ante cambios en `pagination.page`, `pagination.per_page` o `appliedFilter`.
3. **Paginación Suave con `keepPreviousData`**:
   - Usar `placeholderData: keepPreviousData` para evitar parpadeos visuales al navegar entre páginas.
4. **Invalidación Coherente**:
   - Tras mutaciones (crear, actualizar, eliminar), invalidar con `queryClient.invalidateQueries({ queryKey: productKeys.all })` para sincronizar listados y detalles.

---

## 2. Patrón de Implementación en Composables

```typescript
// src/modules/<modulo>/composables/useProductQuery.ts
import { computed, reactive } from 'vue';
import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/vue-query';
import { createQueryKeys } from '@/core/utils/queryKeys';
import { useAlertStore } from '@/core/store';
import productServices from '../services/product.services';
import type { ProductForm } from '../interfaces/product.form.interface';
import type { ProductItem } from '../interfaces/product.response.interface';

export type ProductFilters = {
  filter_name?: string;
  status?: boolean | 'Todos';
};

export const productKeys = createQueryKeys<ProductFilters & { page?: number; per_page?: number }>('products');

export function useProductQuery() {
  const queryClient = useQueryClient();
  const alert = useAlertStore();

  const pagination = reactive({ page: 1, per_page: 10, total_items: 0 });
  const appliedFilter = reactive<ProductFilters>({ filter_name: undefined, status: undefined });

  // 1. Query Principal con Paginación en Servidor
  const {
    data: queryResult,
    isPending,
    isFetching,
    refetch,
    error,
  } = useQuery({
    queryKey: computed(() =>
      productKeys.list({
        page: pagination.page,
        per_page: pagination.per_page,
        filter_name: appliedFilter.filter_name || undefined,
        status: appliedFilter.status === 'Todos' ? undefined : appliedFilter.status,
      }),
    ),
    queryFn: async () => {
      const response = await productServices.obtenerTodos({
        page: pagination.page,
        per_page: pagination.per_page,
        name: appliedFilter.filter_name,
        active: appliedFilter.status === 'Todos' ? undefined : appliedFilter.status,
      });

      if (response.data.total_items !== undefined) {
        pagination.total_items = response.data.total_items;
      }
      return response.data;
    },
    placeholderData: keepPreviousData,
  });

  // 2. Mutación de Creación
  const addMutation = useMutation({
    mutationFn: (form: ProductForm) => productServices.crear(form),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: productKeys.all });
      alert.showAlert({
        type: 'success',
        title: res.data.message || 'Producto registrado correctamente',
        show: true,
      });
    },
  });

  // 3. Mutación de Actualización
  const updateMutation = useMutation({
    mutationFn: ({ id, form }: { id: string; form: ProductForm }) => productServices.actualizar(id, form),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: productKeys.all });
      alert.showAlert({
        type: 'success',
        title: res.data.message || 'Producto actualizado correctamente',
        show: true,
      });
    },
  });

  // 4. Mutación de Eliminación / Cambio de Estado con Actualización Optimista
  const toggleStatusMutation = useMutation({
    mutationFn: (id: string) => productServices.cambiarEstado(id),
    onMutate: async (id: string) => {
      // Cancelar consultas salientes
      await queryClient.cancelQueries({ queryKey: productKeys.lists() });

      // Obtener snapshot anterior
      const previousData = queryClient.getQueryData(
        productKeys.list({
          page: pagination.page,
          per_page: pagination.per_page,
          filter_name: appliedFilter.filter_name,
          status: appliedFilter.status === 'Todos' ? undefined : appliedFilter.status,
        }),
      );

      // Actualizar optimistamente la caché local
      queryClient.setQueryData(
        productKeys.list({
          page: pagination.page,
          per_page: pagination.per_page,
          filter_name: appliedFilter.filter_name,
          status: appliedFilter.status === 'Todos' ? undefined : appliedFilter.status,
        }),
        (old: any) => {
          if (!old?.data) return old;
          return {
            ...old,
            data: old.data.map((item: ProductItem) =>
              item.id === id ? { ...item, active: !item.active } : item,
            ),
          };
        },
      );

      return { previousData };
    },
    onError: (_err, _id, context: any) => {
      // Revertir a los datos previos en caso de error
      if (context?.previousData) {
        queryClient.setQueryData(
          productKeys.list({
            page: pagination.page,
            per_page: pagination.per_page,
            filter_name: appliedFilter.filter_name,
            status: appliedFilter.status === 'Todos' ? undefined : appliedFilter.status,
          }),
          context.previousData,
        );
      }
    },
    onSettled: () => {
      // Sincronizar con el backend
      queryClient.invalidateQueries({ queryKey: productKeys.all });
    },
  });

  return {
    items: computed(() => queryResult.value?.data ?? []),
    pagination,
    appliedFilter,
    isPending,
    isFetching,
    refetch,
    addMutation,
    updateMutation,
    toggleStatusMutation,
  };
}
```

---

## 3. Integración en la Vista con Skeletons y Estado de Carga

En la vista (`Products.vue`), utilizar el estado de TanStack Query para orquestar la UI:

```vue
<template>
  <!-- Loader / Skeleton durante la primera carga -->
  <AppSkeleton v-if="isPending" />

  <!-- Tabla con loading state durante refetching o cambio de página -->
  <AppDataTable
    v-else
    :items="items"
    :headers="headers"
    :loading="isFetching"
    :total-items="pagination.total_items"
    v-model:page="pagination.page"
    v-model:per-page="pagination.per_page"
  >
    <!-- Columnas personalizadas -->
  </AppDataTable>
</template>
```

---

## 4. Validación de Calidad

```bash
npm run check:types
npm run lint
```
Garantizar que todas las funciones de `useMutation` y `useQuery` mantengan tipos explícitos para sus payloads y retornos.
