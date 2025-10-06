<template>
  <Paginator :rows :totalRecords @page="updatePage" :first />
</template>
<script setup lang="ts">
import { Paginator, type PageState } from 'primevue';

defineOptions({ name: 'AppPaginator' });

const { rows, totalRecords } = defineProps({
  rows: {
    type: Number,
    default: 1,
  },
  totalRecords: {
    type: Number,
    default: 10,
  },
  first: {
    type: Number,
    default: 0,
  },
});

const emit = defineEmits(['pageUpdate']);

const updatePage = (value: PageState) => {
  emit('pageUpdate', value.page);
};
</script>
