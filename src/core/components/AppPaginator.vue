<template>
  <div
    class="flex justify-center md:justify-between items-center gap-2 flex-wrap"
  >
    <span class="text-xs">
      Mostrando <span class="font-bold">{{ startRecord }}</span> a
      <span class="font-bold">{{ endRecord }}</span> de
      <span class="font-bold">{{ safeTotalRecords }}</span> registros
    </span>
    <Paginator
      class="flex justify-end"
      :rows="safeRows"
      :total-records="safeTotalRecords"
      v-model:first="localFirst"
      @page="updatePage"
      @update:rows="perPageUpdate"
      :rows-per-page-options="showPerPageOptions ? rowsPerPageOptions : undefined"
    />
  </div>
</template>
<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { Paginator, type PageState } from 'primevue';

import type { AppPaginatorProps } from '../interfaces';

defineOptions({ name: 'AppPaginator' });

const props = withDefaults(defineProps<AppPaginatorProps>(), {
  rows: 10,
  totalRecords: 0,
  first: 0,
  rowsPerPageOptions: () => [10, 20, 50, 100],
  showPerPageOptions: false,
});

const emit = defineEmits<{
  pageUpdate: [page: number];
  perPageUpdate: [perPage: number];
}>();

const safeRows = computed(() => {
  const r = typeof props.rows === 'number' ? props.rows : Number(props.rows);
  return Number.isFinite(r) && r >= 1 ? Math.floor(r) : 10;
});

const safeTotalRecords = computed(() => {
  const raw = props.totalRecords ?? props.total_records;
  const t = typeof raw === 'number' ? raw : Number(raw);
  return Number.isFinite(t) && t >= 0 ? Math.floor(t) : 0;
});

const localFirst = ref(Number(props.first) || 0);

watch(
  () => props.first,
  (newVal) => {
    const f = Number(newVal);
    const valid = Number.isFinite(f) && f >= 0 ? Math.floor(f) : 0;
    if (valid !== localFirst.value) {
      localFirst.value = valid;
    }
  },
  { immediate: true },
);

watch(
  () => safeTotalRecords.value,
  (newTotal) => {
    if (newTotal > 0 && localFirst.value >= newTotal) {
      const maxFirst =
        Math.floor((newTotal - 1) / safeRows.value) * safeRows.value;
      localFirst.value = Math.max(0, maxFirst);
    }
  },
);

const startRecord = computed(() => {
  if (safeTotalRecords.value === 0) return 0;
  return Math.min(localFirst.value + 1, safeTotalRecords.value);
});

const endRecord = computed(() => {
  if (safeTotalRecords.value === 0) return 0;
  return Math.min(localFirst.value + safeRows.value, safeTotalRecords.value);
});

const updatePage = (value: PageState) => {
  localFirst.value = Number(value.first) || 0;
  const p = Number(value.page);
  emit('pageUpdate', Number.isFinite(p) ? p : 0);
};

const perPageUpdate = (value: number) => {
  const pp = Number(value);
  const safe = Number.isFinite(pp) && pp >= 1 ? Math.floor(pp) : 10;
  localFirst.value = 0;
  emit('perPageUpdate', safe);
};
</script>
