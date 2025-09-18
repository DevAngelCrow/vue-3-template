<template>
  <div class="py-5 px-5 h-screen max-h-screen">
    <section id="content" class="w-full flex flex-row flex-wrap gap-5">
      <div class="w-full flex flex-row gap-3 flex-wrap">
        <AppTitle
          title="Rutas"
          class="w-full md:w-auto flex justify-center items-center"
        />
        <div
          id="inputs"
          class="flex rounded-lg border-2 border-primary py-0.5 px-0.5 gap-3 flex-wrap grow lg:grow-0"
        >
          <AppInputText
            label="Buscar"
            class="min-w-auto w-auto grow flex-shrink-0 md:w-[335px]"
          />
          <Button class="flex-shrink-0 grow rounded-md">Buscar</Button>
          <Button class="flex-shrink-0 grow rounded-md" outlined
            >Limpiar</Button
          >
          <Button class="flex-shrink-0 grow rounded-md"
            ><i
              class="pi pi-plus flex justify-center items-center text-center"
              style="font-size: 1.1rem; font-weight: bold"
            ></i
            ><span>Agregar</span></Button
          >
        </div>
      </div>
      <AppDataTable
        class="w-full"
        :headers="headers"
        :items="items"
        :paginator="true"
        :per_page="10"
        :total_pages="1"
      >
        <template #body-acciones>
          <div class="flex gap-0 justify-center">
            <Button
              class="rounded-full mx-0 my-0 px-0 py-0"
              variant="text"
              icon="pi pi-pencil"
              @click=""
            ></Button>
            <Button
              class="rounded-full"
              variant="text"
              icon="pi pi-trash"
              @click=""
            ></Button>
          </div>
        </template>
        <template #body-icon="{ data }">
          <i :class="data.icon"></i>
        </template>
        <template #body-active="{ data }">
          <Chip :class="data ? 'bg-green-600' : 'bg-red-600'">{{
            data ? 'Activo' : 'Inactivo'
          }}</Chip>
        </template>
        <template #body-show="{ data }">
          <i :class="data ? 'pi pi-eye' : 'pi pi-eye-slash'"></i>
        </template>
      </AppDataTable>
    </section>
  </div>
</template>
<script setup lang="ts">
import { Button, Chip } from 'primevue';
import { onMounted, ref } from 'vue';

import { TableHeaders } from '@/core/interfaces';
import { useLoaderStore } from '@/core/store';

import { useAdmin } from '../composables/useAdmin';
import { RoutesResponse } from '../interfaces/routes.response.interface';

const { startLoading, finishLoading } = useLoaderStore();
const { getRoutes } = useAdmin();

const headers = ref<TableHeaders[]>([
  {
    field: 'id',
    header: 'No.',
    sortable: false,
    alignHeaders: 'center',
    alignItems: 'center',
  },
  {
    field: 'name',
    header: 'Nombre',
    sortable: false,
    alignHeaders: 'center',
    alignItems: 'center',
  },
  {
    field: 'description',
    header: 'Descripción',
    sortable: false,
    alignHeaders: 'center',
    alignItems: 'center',
  },
  {
    field: 'icon',
    header: 'Ícono',
    sortable: false,
    alignHeaders: 'center',
    alignItems: 'center',
  },
  {
    field: 'uri',
    header: 'Uri',
    sortable: false,
    alignHeaders: 'center',
    alignItems: 'center',
  },
  {
    field: 'show',
    header: 'Mostrar',
    sortable: false,
    alignHeaders: 'center',
    alignItems: 'center',
  },
  {
    field: 'order',
    header: 'Orden',
    sortable: false,
    alignHeaders: 'center',
    alignItems: 'center',
  },
  {
    field: 'parent_route.name',
    header: 'Ruta padre',
    sortable: false,
    alignHeaders: 'center',
    alignItems: 'center',
  },
  {
    field: 'active',
    header: 'Estado',
    sortable: false,
    alignHeaders: 'center',
    alignItems: 'center',
  },
  {
    field: 'acciones',
    header: 'Acciones',
    sortable: false,
    alignHeaders: 'center',
    alignItems: 'center',
  },
]);

const items = ref<RoutesResponse[] | undefined>([]);

onMounted(async () => {
  try {
    startLoading();
    items.value = await getRoutes();
  } catch (error) {
    console.log(error);
  } finally {
    finishLoading();
  }
});
</script>
<style scoped></style>
