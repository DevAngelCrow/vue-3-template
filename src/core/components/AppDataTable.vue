<template>
  <div class="flex flex-col overflow-hidden px-2 border-2 rounded-md">
    <DataTable
      :value="paginationCustom"
      :loading
      :loadingIcon
      :row-hover
      :rows="per_page"
    >
      <Column
        :header-style="`width:${widthColumn(header)}; text-align: ${txtAlignHeaders(header)}; font-weight: bold`"
        :style="`width:${widthColumn(header)}; text-align: ${txtAlignItems(header)}`"
        v-for="header in headers"
        :key="header.field"
        :field="header.field"
        :sortable="header.sortable"
      >
        <template #header>
          <slot :name="`header-${header.header}`" :header="header.header">
            {{ header.header }}
          </slot>
        </template>
        <template #body="slotProps">
          <slot :name="`body-${header.field}`">
            {{ slotProps.data[header.field] ?? "-" }}
          </slot>
        </template>
      </Column>
      <template #footer>
        <AppPaginator
          :rows="per_page"
          :total-records="total_pages"
          v-if="paginator"
          @page-update="updatePage"
        />
      </template>
    </DataTable>
  </div>
</template>
<script setup lang="ts" generic="T">
import { Column, DataTable } from "primevue";
import { ref, computed } from "vue";
import AppPaginator from "./AppPaginator.vue";
import type {
  TableHeaders,
  TableProps,
} from "../interfaces/datatable.interface";

const {
  headers = [],
  items = [],
  per_page = 1,
  total_pages = 0,
  loading = false,
  loadingIcon = "pi pi-spin pi-spinner",
  rowHover = true,
  paginator = false,
} = defineProps<TableProps<T>>();

const page = ref<number>(0);
const emit = defineEmits(["pageUpdate"]);

const widthColumn = (value: TableHeaders) => {
  if (typeof value.width === "number") {
    return `${value.width}%`;
  }

  if (value?.width === undefined) {
    return "auto";
  }
};

const txtAlignItems = (value: TableHeaders) => {
  if (!value.alignItems) {
    return "start";
  }
  return value.alignItems;
};

const txtAlignHeaders = (value: TableHeaders) => {
  if (!value.alignHeaders) {
    return "start";
  }
  return value.alignHeaders;
};

const updatePage = (value: number) => {
  page.value = value;
  emit("pageUpdate", value);
};

const paginationCustom = computed(() => {
  const startIndex = page.value * per_page;
  const endIndex = startIndex + per_page;
  console.log(startIndex, endIndex);
  return items.slice(startIndex, endIndex);
});
</script>
<style scoped></style>
