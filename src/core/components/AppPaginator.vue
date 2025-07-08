<template>
  <Paginator :rows :totalRecords @page="updatePage" />
</template>
<script setup lang="ts">
import { Paginator, type PageState } from "primevue";
import { ref } from "vue";

const page = ref<number>(1);
const { rows, totalRecords } = defineProps({
  rows: {
    type: Number,
    default: 1,
  },
  totalRecords: {
    type: Number,
    default: 10,
  },
});

const emit = defineEmits(["pageUpdate"]);

const updatePage = (value: PageState) => {
  page.value = value.page;
  emit("pageUpdate", page.value);
};
</script>
