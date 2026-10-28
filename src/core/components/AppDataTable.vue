<template>
  <div class="flex flex-col overflow-hidden border border-surface-200 rounded-md">
    <DataTable
      :value="props.items"
      :loading="props.loading"
      :loading-icon="props.loadingIcon"
      :row-hover="props.rowHover"
      :rows="safePerPage"
    >
      <Column
        :style="`width:${widthColumn(header)}; text-align: ${txtAlignItems(header)}`"
        v-for="header in props.headers"
        :key="header.field"
        :field="header.field"
        :sortable="header.sortable"
        :pt="columnHeaderPt(header)"
        :pt-options="{ mergeProps: true }"
      >
        <template #header>
          <slot :name="`header-${header.header}`" :header="header.header">
            {{ header.header }}
          </slot>
        </template>
        <template #body="slotProps">
          <div :class="['flex', 'w-full', 'items-center', alignItemsClass(header)]">
            <slot
              :name="`body-${header.field}`"
              :data="slotProps.data"
              :index="slotProps.index"
            >
              {{ getNestedValue(slotProps.data, header.field) ?? '-' }}
            </slot>
          </div>
        </template>
      </Column>
      <template #empty>
        <div class="flex justify-center items-center py-6 text-surface-500 text-sm">
          No se encontraron resultados
        </div>
      </template>
      <template v-if="props.paginator" #footer>
        <AppPaginator
          :rows="safePerPage"
          :total-records="safeTotalItems"
          @page-update="updatePage"
          @per-page-update="perPageUpdate"
          :first="safeFirst"
          :rows-per-page-options="props.perPageOptions"
          :show-per-page-options="props.showPerPageOptions"
        />
      </template>
    </DataTable>
  </div>
</template>
<script setup lang="ts" generic="T extends object">
import { computed } from 'vue';
import { Column, DataTable } from 'primevue';

import AppPaginator from './AppPaginator.vue';
import type {
  TableHeaders,
  TableProps,
} from '../interfaces/datatable.interface';

defineOptions({ name: 'AppDataTable' });

const props = withDefaults(defineProps<TableProps<T>>(), {
  headers: () => [],
  items: () => [],
  perPage: 10,
  totalItems: 0,
  loading: false,
  loadingIcon: 'pi pi-spin pi-spinner',
  rowHover: true,
  paginator: false,
  page: 1,
  showPerPageOptions: false,
  perPageOptions: () => [10, 20, 50, 100],
});

const emit = defineEmits<{
  pageUpdate: [page: number];
  perPageUpdate: [perPage: number];
}>();

const safePage = computed(() => {
  const p = typeof props.page === 'number' ? props.page : Number(props.page);
  return Number.isFinite(p) && p >= 1 ? Math.floor(p) : 1;
});

const safePerPage = computed(() => {
  const raw = props.perPage ?? props.per_page;
  const pp = typeof raw === 'number' ? raw : Number(raw);
  return Number.isFinite(pp) && pp >= 1 ? Math.floor(pp) : 10;
});

const safeTotalItems = computed(() => {
  const raw = props.totalItems ?? props.total_items;
  const t = typeof raw === 'number' ? raw : Number(raw);
  return Number.isFinite(t) && t >= 0 ? Math.floor(t) : 0;
});

const safeFirst = computed(() => {
  return Math.max(0, (safePage.value - 1) * safePerPage.value);
});

const ALIGN_CLASS_MAP: Record<'start' | 'center' | 'end', string> = {
  start: 'justify-start text-start',
  center: 'justify-center text-center',
  end: 'justify-end text-end',
};

const getNestedValue = (object: unknown, path: string): unknown => {
  return path.split('.').reduce<unknown>((currentObject, propertyKey) => {
    if (
      currentObject &&
      typeof currentObject === 'object' &&
      propertyKey in currentObject
    ) {
      return (currentObject as Record<string, unknown>)[propertyKey];
    }
    return null;
  }, object);
};

const columnHeaderPt = (value: TableHeaders) => {
  const alignKey = value.alignHeaders || 'start';
  const alignClasses = ALIGN_CLASS_MAP[alignKey] || ALIGN_CLASS_MAP.start;
  return {
    columnHeaderContent: {
      class: `${alignClasses} font-extrabold`,
    },
  };
};

const widthColumn = (value: TableHeaders) => {
  if (typeof value.width === 'number') {
    return `${value.width}%`;
  }
  return 'auto';
};

const txtAlignItems = (value: TableHeaders): 'start' | 'center' | 'end' => {
  return value.alignItems || 'start';
};

const alignItemsClass = (value: TableHeaders): string => {
  const key = txtAlignItems(value);
  return ALIGN_CLASS_MAP[key] || ALIGN_CLASS_MAP.start;
};

const updatePage = (value: number) => {
  emit('pageUpdate', value);
};

const perPageUpdate = (value: number) => {
  emit('perPageUpdate', value);
};
</script>
<style scoped></style>
