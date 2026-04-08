<template>
  <Paginator :rows :totalRecords @page="updatePage" :first @update:rows="perPageUpdate"
    :rowsPerPageOptions="showPerPageOptions ? rowsPerPageOptions : undefined" />
</template>
<script setup lang="ts">
import { Paginator, type PageState } from 'primevue';
import { PropType } from 'vue';

defineOptions({ name: 'AppPaginator' });

const { rows, totalRecords, rowsPerPageOptions, showPerPageOptions } = defineProps({
  rows: {
    type: Number,
    default: 10,
  },
  totalRecords: {
    type: Number,
    default: 10,
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
});

const emit = defineEmits(['pageUpdate', 'perPageUpdate']);

const updatePage = (value: PageState) => {
  emit('pageUpdate', value.page);
};

const perPageUpdate = (value: number) => {
  emit('perPageUpdate', value);
};

</script>
