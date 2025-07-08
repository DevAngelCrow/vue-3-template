<template>
  <DataTable>
    <Column
      v-for="header in headers"
      :key="header.key"
      :field="header.field"
      :sortable="header.sortable"
      :header="header.key"
    >
    <template #header>
        <slot :name="`header-${header.key}`" :header="header" >
            {{ header.key }}
        </slot>
    </template>
    <template #body="slotProps">
        <slot :name="`body-${header.field}`">
            {{ slotProps.data[header.field] }}
        </slot>
    </template>
    </Column>
  </DataTable>
</template>
<script setup lang="ts" generic="T">
import { Column, DataTable } from "primevue";
import type { TableProps } from "../interfaces/datatable.interface";
import { ref } from "vue";

const { headers, items, itemsPerPage } = withDefaults(
  defineProps<TableProps<T>>(),
  {
    headers: () => [],
    items: () => [],
    itemsPerPage: 10,
  }
);
</script>
<style scoped></style>
