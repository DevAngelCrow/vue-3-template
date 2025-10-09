<script setup lang="ts">
import { onMounted, ref, watch } from 'vue';
// import { Button } from 'primevue';

// import { TableHeaders } from '../interfaces';
// const show = ref<boolean>(false);

// const openModal = (value: boolean) => {
//   show.value = !value;
// };

// const closeModal = (value: boolean) => {
//   show.value = value;
// };

// const confirmModal = () => {
//   //TODO
//   //aca debe hacer algo
//   closeModal(false);
// };

const permisos = ref<any[][]>([
  [
    { id: 1, name: 'view_users' },
    { id: 2, name: 'create_users' },
    { id: 3, name: 'delete_users' },
    { id: 4, name: 'view_routes' },
    { id: 5, name: 'edit_routes' },
  ],
  [],
]);
onMounted(() => {});
const fecha = ref();

watch(fecha, newVale => {
  console.log(newVale);
});

// const headers = ref<TableHeaders[]>([
//   {
//     field: 'vinculador_uno',
//     header: 'cabecera_Uno',
//     sortable: false,
//     alignHeaders: 'center',
//     alignItems: 'center',
//   },
//   {
//     field: 'vinculador_dos',
//     header: 'cabecera_Dos',
//     sortable: false,
//     alignHeaders: 'center',
//     alignItems: 'center',
//   },
//   {
//     field: 'vinculador_tres',
//     header: 'cabecera_Tres',
//     sortable: false,
//     alignHeaders: 'center',
//     alignItems: 'center',
//   },
//   {
//     field: 'acciones',
//     header: 'Acciones',
//     sortable: false,
//     alignHeaders: 'center',
//     alignItems: 'center',
//   },
// ]);

// const items = ref([
//   {
//     vinculador_uno: 'item_cabecera_uno_pagina_1',
//     vinculador_dos: 'item_cabecera_dos_pagina_1',
//     vinculador_tres: 'item_cabecera_tres_pagina_1',
//   },
//   {
//     vinculador_uno: 'item_cabecera_uno_pagina_2',
//     vinculador_dos: 'item_cabecera_dos_pagina_2',
//     vinculador_tres: 'item_cabecera_tres_pagina_2',
//   },
//   {
//     vinculador_uno: 'item_cabecera_uno_pagina_3',
//     vinculador_dos: 'item_cabecera_dos_pagina_3',
//     vinculador_tres: 'item_cabecera_tres_pagina_3',
//   },
// ]);
</script>

<template>
  <!-- <Button class="mt-10" @click="openModal(show)">Modal</Button>
  <AppModal
    :show="show"
    @close-modal="closeModal"
    @confirm-modal="confirmModal"
    show-icon-close
    title="AppModal"
  >
    <div>
      <h1>Aca esta el body del modal</h1>
    </div>
  </AppModal>
  <h1>Esto es un texto</h1>

  <span>Probando appdatepicker</span>
  <AppDatePicker v-model="fecha" />

  <AppDataTable
    :headers="headers"
    :items="items"
    :paginator="true"
    :per_page="10"
    :total_pages="1"
  >
    <template #body-acciones="{ data }">
      <i class="pi pi-pencil"></i>
      <i class="pi pi-trash"></i>
      <i class="pi pi-times-circle"></i>
    </template>
</AppDataTable> -->
  <br />
  <AppPickList v-model="permisos" :option-label="'name'" />
</template>

<style scoped>
.read-the-docs {
  color: #888;
}
</style>
