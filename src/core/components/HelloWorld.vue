<script setup lang="ts">
// import { Button } from "primevue";
import type { TableHeaders } from "../interfaces/datatable.interface";
import AppDataTable from "./AppDataTable.vue";
import { ref } from "vue";

const headers = ref<TableHeaders[]>([
  {
    header: "Cabecera_uno",
    field: "cabeceraUno",
    sortable: false,

    alignItems: "center",
  },
  {
    header: "Cabecera_dos",
    field: "cabeceraDos",
    sortable: false,
  },
  {
    header: "Cabecera_tres",
    field: "cabeceraTres",
    sortable: false,
  },
  {
    header: "Cabecera_cuatro",
    field: "cabeceraCuatro",
    sortable: false,
  },
  {
    header: "Cabecera_cinco",
    field: "cabeceraCinco",
    sortable: false,
  },
  {
    header: "Cabecera_seis",
    field: "cabeceraSeis",
    sortable: false,
  },
  {
    header: "Cabecera_siete",
    field: "cabeceraSiete",
    sortable: false,
  },
]);

const items = ref([
  {
    cabeceraUno: "primer columna f1",
    cabeceraDos: "segunda columna",
    cabeceraTres: "tercer columna",
    cabeceraCuatro: "cuarta columna",
    cabeceraCinco: "quinta columna",
    cabeceraSeis: "sexta columna",
    cabeceraSiete: "septima columna",
  },
  {
    cabeceraUno: "primer columna f2",
    cabeceraDos: "segunda columna",
    cabeceraTres: "tercer columna",
    cabeceraCuatro: "cuarta columna",
    cabeceraCinco: "quinta columna",
    cabeceraSeis: "sexta columna",
    cabeceraSiete: "septima columna",
  },
  {
    cabeceraUno: "primer columna f3",
    cabeceraDos: "segunda columna",
    cabeceraTres: "tercer columna",
    cabeceraCuatro: "cuarta columna",
    cabeceraCinco: "quinta columna",
    cabeceraSeis: "sexta columna",
    cabeceraSiete: "septima columna",
  },
  {
    cabeceraUno: "primer columna f4",
    cabeceraDos: "segunda columna",
    cabeceraTres: "tercer columna",
    cabeceraCuatro: "cuarta columna",
    cabeceraCinco: "quinta columna",
    cabeceraSeis: "sexta columna",
    cabeceraSiete: "septima columna",
  },
]);
</script>

<template>
  <div class="w-full h-full flex justify-center items-center align-base-line">
    <AppDataTable
      :headers="headers"
      :items="items"
      :per_page="10"
      :total_pages="items.length"
      paginator
    />
  </div>
</template>

<style scoped>
.read-the-docs {
  color: #888;
}
</style>
