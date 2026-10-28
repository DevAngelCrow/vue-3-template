---
name: vue3-crud-module-scaffolder
description: Use this skill when the user asks to create, scaffold, or refactor a business module or CRUD in vue-3-template following Vue 3.5, Vite 7, TanStack Query v5, Vee-Validate 4, Yup, PrimeVue 5, App* components, and strict color tokens.
---

# Scaffolder de Módulos CRUD: Vue 3 + PrimeVue 5 + TanStack Query

Esta habilidad es el runbook normativo para crear módulos de negocio completos en `vue-3-template` cumpliendo al 100% las directrices de `AGENTS.md`, asegurando que `npm run lint` y `npm run check:types` pasen con 0 errores y 0 advertencias.

---

## 1. Estructura de Directorios del Módulo

Todo módulo nuevo debe ubicarse en `src/modules/<nombre-modulo>/` con la siguiente estructura:

```text
src/modules/<nombre-modulo>/
├── components/
│   └── <Nombre>FormModal.vue       # Modal desacoplado con modalState
├── composables/
│   └── use<Nombre>.ts              # Composable canónico (Queries, Mutaciones, Formulario, Debounce)
├── interfaces/
│   ├── <nombre>.form.interface.ts     # DTO de formulario (payload)
│   └── <nombre>.response.interface.ts # DTO de respuesta y modelos de datos
├── services/
│   └── <nombre>.services.ts        # Métodos HTTP usando exclusivamente httpClient
├── views/
│   └── <Nombre>s.vue               # Vista principal con AppDataTable, AppHeader, AppCard
└── routes.ts                       # Rutas del módulo con importación diferida
```

---

## 2. Reglas Mandatorias de Arquitectura y Estilo

1. **Tokens de Color Obligatorios**:
   - Usar estrictamente `primary-*`, `surface-*` (slate), `success-*`, `danger-*` o variables `--p-*`.
   - **PROHIBIDO** el uso de colores fijos de Tailwind (`red-600`, `green-600`, `slate-*`, `zinc-*`, `gray-*`).
2. **Componentes Globales `App*`**:
   - Usar `AppInputText`, `AppSelect`, `AppDataTable`, `AppModal`, `AppCard`, `AppHeader`, `AppTitle`, etc. Se encuentran registrados globalmente.
3. **Manejo de Debounce**:
   - **PROHIBIDO** el uso de la directiva `v-debounce`. El debounce se implementa en el composable con `debounce` de `@/core/utils/debounceFunction` y se enlaza con `@keydown.enter` o `@click`.
4. **Modales Desacoplados**:
   - Gestionados mediante un estado reactivo `modalState`:
     ```ts
     const modalState = reactive<{
       show: boolean;
       mode: 'closed' | 'add' | 'view' | 'edit' | 'delete';
       title: string;
       description: string;
       isReadonly: boolean;
       selectedItem: null | string;
     }>({
       show: false,
       mode: 'closed',
       title: '',
       description: '',
       isReadonly: false,
       selectedItem: null,
     });
     ```
5. **Cliente HTTP**:
   - Usar exclusivamente `httpClient` desde `@/core/utils/httpClient`. No instanciar `axios` directamente.

---

## 3. Secuencia de Implementación Paso a Paso

### Paso 1: Definir Contratos e Interfaces (`interfaces/`)

```typescript
// src/modules/<modulo>/interfaces/<modulo>.form.interface.ts
export interface ProductForm {
  id?: string;
  name: string;
  active: boolean;
}

// src/modules/<modulo>/interfaces/<modulo>.response.interface.ts
export interface ProductItem {
  id: string;
  name: string;
  active: boolean;
  created_at?: string;
}
```

---

### Paso 2: Servicio HTTP (`services/`)

```typescript
// src/modules/<modulo>/services/<modulo>.services.ts
import httpClient from '@/core/utils/httpClient';
import type { ApiResponseGeneric, ApiPostResponse } from '@/core/services';
import type { ProductItem } from '../interfaces/product.response.interface';
import type { ProductForm } from '../interfaces/product.form.interface';

interface GetProductsParams {
  page?: number;
  per_page?: number;
  name?: string;
  active?: boolean;
}

export const productServices = {
  obtenerTodos: (params?: GetProductsParams): Promise<ApiResponseGeneric<ProductItem[]>> =>
    httpClient.get('/products', { params }),

  obtenerPorId: (id: string): Promise<ApiPostResponse<ProductItem>> =>
    httpClient.get(`/products/${id}`),

  crear: (payload: ProductForm): Promise<ApiPostResponse<null>> =>
    httpClient.post('/products', payload),

  actualizar: (id: string, payload: ProductForm): Promise<ApiPostResponse<null>> =>
    httpClient.put(`/products/${id}`, payload),

  cambiarEstado: (id: string): Promise<ApiPostResponse<null>> =>
    httpClient.patch(`/products/${id}`),
};

export default productServices;
```

---

### Paso 3: Composable Canónico (`composables/`)

```typescript
// src/modules/<modulo>/composables/useProduct.ts
import { computed, reactive } from 'vue';
import { useForm } from 'vee-validate';
import * as yup from 'yup';
import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/vue-query';
import { useAlertStore } from '@/core/store';
import { createQueryKeys } from '@/core/utils/queryKeys';
import { debounce } from '@/core/utils/debounceFunction';
import productServices from '../services/product.services';
import type { ProductForm } from '../interfaces/product.form.interface';

export type FilterType = {
  filter_name?: string;
  status?: boolean | 'Todos';
};

export const productKeys = createQueryKeys<FilterType & { page?: number; per_page?: number }>('products');

export function useProduct() {
  const queryClient = useQueryClient();
  const alert = useAlertStore();

  // 1. Formulario reactivo Vee-Validate + Yup
  const { errors, defineField, handleSubmit, resetForm, setValues } = useForm<ProductForm>({
    validationSchema: yup.object({
      id: yup.string().optional(),
      name: yup.string().required('El nombre es requerido').min(3, 'Mínimo 3 caracteres'),
      active: yup.boolean().default(true),
    }),
  });

  const [name, nameAttrs] = defineField('name');
  const [active, activeAttrs] = defineField('active');

  // 2. Paginación y Filtros
  const pagination = reactive({ page: 1, per_page: 10, total_items: 0 });
  const filter = reactive<FilterType>({ filter_name: undefined, status: undefined });
  const appliedFilter = reactive<FilterType>({ filter_name: undefined, status: undefined });

  // 3. Debounce para filtros y búsquedas
  const findItems = (value?: FilterType) => {
    pagination.page = 1;
    const target = value && typeof value === 'object' && !('target' in value) ? value : filter;
    appliedFilter.filter_name = (target?.filter_name ?? filter.filter_name) || undefined;
    appliedFilter.status = target?.status ?? filter.status;
  };

  const cleanSearch = () => {
    filter.filter_name = undefined;
    filter.status = undefined;
    appliedFilter.filter_name = undefined;
    appliedFilter.status = undefined;
    pagination.page = 1;
  };

  const debouncedFind = debounce(findItems, 600);
  const debouncedClean = debounce(cleanSearch, 600);

  // 4. Query TanStack Query
  const { data: queryResult, isPending, isFetching, refetch } = useQuery({
    queryKey: computed(() =>
      productKeys.list({
        page: pagination.page,
        per_page: pagination.per_page,
        filter_name: appliedFilter.filter_name,
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

  // 5. Mutaciones
  const addMutation = useMutation({
    mutationFn: (form: ProductForm) => productServices.crear(form),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: productKeys.all });
      alert.showAlert({ type: 'success', title: res.data.message || 'Creado con éxito', show: true });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, form }: { id: string; form: ProductForm }) => productServices.actualizar(id, form),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: productKeys.all });
      alert.showAlert({ type: 'success', title: res.data.message || 'Actualizado con éxito', show: true });
    },
  });

  return {
    name,
    nameAttrs,
    active,
    activeAttrs,
    errors,
    handleSubmit,
    resetForm,
    setValues,
    pagination,
    filter,
    appliedFilter,
    debouncedFind,
    debouncedClean,
    items: computed(() => queryResult.value?.data ?? []),
    isPending,
    isFetching,
    refetch,
    addMutation,
    updateMutation,
  };
}

export type UseProductReturn = ReturnType<typeof useProduct>;
```

---

### Paso 4: Modal Desacoplado (`components/<Nombre>FormModal.vue`)

```vue
<script setup lang="ts">
import { inject } from 'vue';
import type { UseProductReturn } from '../composables/useProduct';

const props = defineProps<{
  modalState: {
    show: boolean;
    mode: 'closed' | 'add' | 'view' | 'edit' | 'delete';
    title: string;
    description: string;
    isReadonly: boolean;
    selectedItem: null | string;
  };
}>();

const emit = defineEmits<{
  (e: 'close-modal'): void;
}>();

const composable = inject<UseProductReturn>('useProduct')!;
const { name, nameAttrs, errors, handleSubmit, resetForm, addMutation, updateMutation } = composable;

const onSubmit = handleSubmit(async (values) => {
  if (props.modalState.mode === 'add') {
    await addMutation.mutateAsync(values);
  } else if (props.modalState.mode === 'edit' && props.modalState.selectedItem) {
    await updateMutation.mutateAsync({ id: props.modalState.selectedItem, form: values });
  }
  close();
});

const close = () => {
  resetForm();
  emit('close-modal');
};
</script>

<template>
  <AppModal
    :show="props.modalState.show"
    :title="props.modalState.title"
    :cancel-label="props.modalState.isReadonly ? 'Cerrar' : 'Cancelar'"
    :confirm-label="props.modalState.mode === 'add' ? 'Guardar' : 'Actualizar'"
    :show-confirm-button="!props.modalState.isReadonly"
    show-footer
    show-close-icon
    width="45rem"
    @close-modal="close"
    @confirm-modal="onSubmit"
  >
    <div class="flex flex-col gap-4 w-full">
      <AppInputText
        v-model="name"
        v-bind="nameAttrs"
        label="Nombre del Producto"
        placeholder="Ej. Laptop Pro"
        :error-message="errors.name"
        :readonly="props.modalState.isReadonly"
      />
    </div>
  </AppModal>
</template>
```

---

### Paso 5: Vista Principal (`views/<Nombre>s.vue`)

```vue
<script setup lang="ts">
import { provide, reactive } from 'vue';
import { useProduct } from '../composables/useProduct';
import ProductFormModal from '../components/ProductFormModal.vue';
import type { TableHeaders } from '@/core/interfaces';

const productComposable = useProduct();
provide('useProduct', productComposable);

const { items, pagination, filter, isFetching, debouncedFind, debouncedClean } = productComposable;

const headers: TableHeaders[] = [
  { field: 'name', header: 'Nombre', sortable: true },
  { field: 'active', header: 'Estado', sortable: false },
  { field: 'actions', header: 'Acciones', sortable: false },
];

const modalState = reactive<{
  show: boolean;
  mode: 'closed' | 'add' | 'view' | 'edit' | 'delete';
  title: string;
  description: string;
  isReadonly: boolean;
  selectedItem: null | string;
}>({
  show: false,
  mode: 'closed',
  title: '',
  description: '',
  isReadonly: false,
  selectedItem: null,
});

const openAddModal = () => {
  modalState.mode = 'add';
  modalState.title = 'Nuevo Producto';
  modalState.description = 'Ingresa los datos para registrar un producto';
  modalState.isReadonly = false;
  modalState.selectedItem = null;
  modalState.show = true;
};

const handlePagination = (page: number) => {
  if (page + 1 === pagination.page) return;
  pagination.page = page + 1;
};

const handlePerPagePagination = (perPage: number) => {
  if (perPage === pagination.per_page) return;
  pagination.per_page = perPage;
  pagination.page = 1;
};
</script>

<template>
  <AppMainContent>
    <AppTitle title="Gestión de Productos" />

    <AppCard>
      <!-- Barra de Filtros con debounce -->
      <div class="flex flex-wrap items-center gap-4 mb-4">
        <AppInputText
          v-model="filter.filter_name"
          placeholder="Buscar producto..."
          class="w-full sm:w-72"
          @keydown.enter="debouncedFind"
        />
        <Button label="Buscar" icon="pi pi-search" @click="debouncedFind" />
        <Button label="Limpiar" icon="pi pi-filter-slash" variant="text" severity="secondary" @click="debouncedClean" />
        <Button label="Nuevo Producto" icon="pi pi-plus" class="ml-auto" @click="openAddModal" />
      </div>

      <!-- Tabla de Datos -->
      <AppSkeleton :loading="isFetching" variant="table" :rows="pagination.per_page" :headers="headers">
        <AppDataTable
          :items="items"
          :headers="headers"
          :paginator="true"
          :total-items="pagination.total_items"
          :page="pagination.page"
          :per-page="pagination.per_page"
          @page-update="handlePagination"
          @per-page-update="handlePerPagePagination"
        >
          <template #body-active="{ data }">
            <AppChipStatus :label="data.active ? 'Activo' : 'Inactivo'" />
          </template>
          <template #body-actions="{ data }">
            <Button icon="pi pi-pencil" variant="text" severity="secondary" v-tooltip.bottom="'Editar'" />
          </template>
        </AppDataTable>
      </AppSkeleton>
    </AppCard>

    <ProductFormModal :modal-state="modalState" @close-modal="modalState.show = false" />
  </AppMainContent>
</template>
```

---

### Paso 6: Rutas del Módulo (`routes.ts`)

```typescript
// src/modules/<modulo>/routes.ts
import type { RouteRecordRaw } from 'vue-router';

export const productRoutes: RouteRecordRaw[] = [
  {
    path: 'products',
    name: 'Products',
    component: () => import('./views/Products.vue'),
    meta: {
      title: 'Productos',
      permission: 'listar-productos',
    },
  },
];

export default productRoutes;
```

---

## 4. Validación Obligatoria

Al concluir la generación de archivos, siempre ejecutar:
```bash
npm run check:types
npm run lint
```
Asegurar que no existan tipos `any`, advertencias de ESLint ni uso de colores no semánticos.
