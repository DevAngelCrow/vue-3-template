---
name: vue3-loading-and-skeletons
description: Reglas y directrices para la gestión unificada de estados de carga, uso de AppLoader vs AppSkeleton y sincronización con TanStack Query en vue-3-template.
---

# Gestión Canónica de Estados de Carga: `AppLoader` vs `AppSkeleton`

Estándar para garantizar una experiencia de usuario fluida, estéticamente cuidada y libre de bloqueos indeseados en la interfaz de `vue-3-template`.

---

## 1. Principio Fundamental: Bloqueo Transaccional vs Carga Progresiva

| Tipo de Operación | Componente a Utilizar | Justificación UX / Técnica |
| :--- | :--- | :--- |
| **Mutaciones (POST, PUT, PATCH, DELETE)** | **`AppLoader`** (Overlay global modal bloqueante) | Protege la integridad transaccional bloqueando el teclado y puntero (`pointer-events: none` y captura estricta) para evitar doble envío (*double-submit*), clics duplicados o estados inconsistentes. |
| **Descargas / Exportación de Archivos (Blob PDF/Excel)** | **`AppLoader`** o spinner en botón | Indica que el servidor está preparando el archivo binario y previene solicitudes múltiples en cola. |
| **Consultas de Datos (GET / `useQuery`), Paginación y Filtros** | **`AppSkeleton`** (Carga progresiva) | Mantiene el layout estable, evita saltos de contenido (*layout shifts* o CLS) y **NO bloquea** la navegación ni el puntero del usuario. |

---

## 2. Regla Estricta para Tablas (`AppDataTable`): Cero Spinners de PrimeVue

1. **La prop `loading` en el componente base:**
   - `AppDataTable.vue` mantiene internamente la definición de prop `loading?: boolean` (con valor por defecto `loading = false`) para preservar extensibilidad y casos excepcionales.
2. **Prohibido pasar `:loading` en las vistas de módulo:**
   - **En las vistas estándar y subtablas nunca se le debe pasar la prop `:loading` a `<AppDataTable>`**. De este modo, PrimeVue jamás renderizará su máscara de carga ni su spinner nativo sobre la tabla.
3. **El skeleton asume toda la representación visual de carga:**
   - Toda tabla de datos debe envolverse obligatoriamente en `<AppSkeleton :loading="isFetching" variant="table" :rows="pagination.per_page" :headers="headers" show-paginator>`.
   - Cuando `isFetching` es `true` (en la primera carga, al paginar o al aplicar filtros con debounce), se muestra la silueta animada. Al finalizar la petición, `isFetching` pasa a `false` y se monta inmediatamente la tabla con los datos.

---

## 3. Configuración Mandatoria de TanStack Query (`vueQuery.ts`)

Las consultas (`queries`) llevan por defecto `meta: { skipLoader: true }` en la configuración global de `QueryClient`.

- **Prohibido:** Permitir que una consulta de tabla o un *polling* periódico active el overlay bloqueante `AppLoader`.
- **Sincronización Automática de Mutaciones:** `initQueryLoaderSync` escucha el cache de mutaciones (`client.isMutating() > 0`) y activa automáticamente `AppLoader` en `App.vue` durante cualquier mutación con `useMutation`.

---

## 4. Ciclo de Construcción de un Módulo Completo

Todo módulo nuevo debe articularse en 4 capas respetando este patrón:

### Capa 1: El Composable (`composables/use<Entidad>.ts`)
- Utiliza `useQuery` para consultas y retorna **`isFetching`**.
- Utiliza `useMutation` para operaciones de escritura.

```typescript
export function useProduct() {
  const queryClient = useQueryClient();
  const alert = useAlertStore();

  const pagination = reactive({ page: 1, per_page: 10, total_items: 0 });
  const appliedFilter = reactive<ProductFilters>({ filter_name: undefined });

  // Query principal
  const {
    data: queryResult,
    isFetching, // <-- OBLIGATORIO: exportar para el skeleton de la vista
    refetch,
  } = useQuery({
    queryKey: computed(() => productKeys.list({
      page: pagination.page,
      per_page: pagination.per_page,
      filter_name: appliedFilter.filter_name,
    })),
    queryFn: async () => {
      const response = await productServices.obtenerTodos(...);
      return response.data;
    },
    placeholderData: keepPreviousData,
  });

  // Mutación (activa AppLoader automáticamente durante la ejecución)
  const addMutation = useMutation({
    mutationFn: (form: ProductForm) => productServices.crear(form),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: productKeys.all });
      alert.showAlert({ type: 'success', title: 'Creado con éxito', show: true });
    },
  });

  return {
    items: computed(() => queryResult.value?.data ?? []),
    pagination,
    isFetching,
    addMutation,
  };
}
```

### Capa 2: La Vista Principal (`views/<Entidad>s.vue`)
- Desestructura `isFetching` directamente del composable.
- **Prohibido importar o usar `storeLoader.isFetching`**.
- Envuelve `<AppDataTable>` dentro de `<AppSkeleton>`.
- **No pasa `:loading` a `<AppDataTable>`**.

```html
<template>
  <AppMainContent>
    <AppHeader title="Gestión de Productos" />

    <AppSkeleton
      :loading="isFetching"
      variant="table"
      :rows="pagination.per_page"
      :headers="headers"
      show-paginator
    >
      <AppDataTable
        :headers="headers"
        :items="items"
        :paginator="true"
        :per_page="pagination.per_page"
        :total_items="pagination.total_items"
        :page="pagination.page"
        @page-update="handlePagination"
        @per-page-update="handlePerPagePagination"
      >
        <!-- Slots de columnas -->
      </AppDataTable>
    </AppSkeleton>
  </AppMainContent>
</template>

<script setup lang="ts">
import { useProduct } from '../composables/useProduct';

const productInstance = useProduct();
const { items, headers, pagination, isFetching } = productInstance;
</script>
```

### Capa 3: El Modal Desacoplado (`components/<Entidad>FormModal.vue`)
- El modal ejecuta `await addMutation.mutateAsync(values)`.
- `initQueryLoaderSync` detecta la mutación activa y despliega `AppLoader` de forma global, bloqueando la pantalla para evitar clics dobles.

### Capa 4: Subtablas dentro de Modales
- Si un modal muestra una tabla secundaria (ej. permisos asignables), el composable declara un ref reactivo de carga:
  ```typescript
  const isPermissionsLoading = ref(false);
  const getPermissions = async () => {
    try {
      isPermissionsLoading.value = true;
      const res = await adminServices.getPermissions(...);
      permissionsList.value = res.data.data;
    } finally {
      isPermissionsLoading.value = false;
    }
  };
  ```
- El componente subtabla consume `isPermissionsLoading`:
  ```html
  <AppSkeleton :loading="isPermissionsLoading" variant="table" :rows="5" :headers="headers" show-paginator>
    <AppDataTable :headers="headers" :items="permissionsList" ... />
  </AppSkeleton>
  ```

---

## 5. Checklist de Validación

- [ ] Las consultas de lectura (`useQuery`) no activan el overlay de pantalla completa `AppLoader`.
- [ ] La tabla de la vista principal está envuelta en `<AppSkeleton :loading="isFetching" variant="table" ...>`.
- [ ] La tabla `<AppDataTable>` **no** tiene la prop `:loading` en la vista (no muestra spinner nativo de PrimeVue).
- [ ] La vista no importa ni utiliza `storeLoader.isFetching`.
- [ ] Las mutaciones (`useMutation`) activan automáticamente el overlay global `AppLoader` durante su ejecución.
- [ ] No existen textos de carga planos tipo `<i class="pi pi-spin pi-spinner"></i> Cargando...` en vistas principales; se emplea `AppSkeleton`.
