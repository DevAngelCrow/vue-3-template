<template>
  <div
    class="flex flex-col sm:flex-row justify-between items-center gap-3 w-full py-2 px-1 text-surface-600 dark:text-surface-400"
  >
    <span class="text-xs text-center sm:text-left select-none">
      Mostrando
      <span class="font-bold text-surface-900 dark:text-surface-250">{{
        recordFrom
      }}</span>
      a
      <span class="font-bold text-surface-900 dark:text-surface-250">{{
        recordTo
      }}</span>
      de
      <span class="font-bold text-surface-900 dark:text-surface-250">{{
        totalRecords
      }}</span>
      registros
    </span>
    <Paginator
      class="flex justify-end p-0 border-0 bg-transparent text-xs"
      :rows="rows"
      :totalRecords="totalRecords"
      :first="first"
      :rowsPerPageOptions="showPerPageOptions ? rowsPerPageOptions : undefined"
      @page="updatePage"
      @update:rows="perPageUpdate"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, type PropType } from 'vue';
import { Paginator, type PageState } from 'primevue';

defineOptions({ name: 'AppPaginator' });

const props = defineProps({
  rows: {
    type: Number,
    default: 10,
  },
  totalRecords: {
    type: Number,
    default: 0,
  },
  first: {
    type: Number,
    default: 0,
  },
  rowsPerPageOptions: {
    type: Array as PropType<number[]>,
    default: () => [10, 20, 50, 100],
  },
  showPerPageOptions: {
    type: Boolean,
    default: false,
  },
  justify: {
    type: String,
    default: '',
  },
});

const emit = defineEmits(['pageUpdate', 'perPageUpdate']);

const recordFrom = computed(() =>
  props.totalRecords === 0 ? 0 : props.first + 1,
);
const recordTo = computed(() =>
  Math.min(props.first + props.rows, props.totalRecords),
);

const updatePage = (value: PageState) => {
  emit('pageUpdate', value.page);
};

const perPageUpdate = (value: number) => {
  emit('perPageUpdate', value);
};
</script>

<style scoped></style>
