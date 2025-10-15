<template>
  <div class="py-5 px-5 h-full max-h-full">
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
            v-model="filter_name"
            @update:modelValue="validateAlphaInput(filter_name)"
            @keydown.enter="findRoute(filter_name)"
          />
          <Button
            class="flex-shrink-0 grow rounded-md"
            @click="findRoute(filter_name)"
            >Buscar</Button
          >
          <Button
            class="flex-shrink-0 grow rounded-md"
            outlined
            @click="cleanSearch"
            >Limpiar</Button
          >
          <Button
            class="flex-shrink-0 grow rounded-md"
            @click="openModal('add')"
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
        :per_page="pagination.per_page"
        :total_items="pagination.total_items"
        :page="pagination.page"
        @page-update="handlePagination"
      >
        <template #body-acciones="{ data }">
          <div class="flex gap-0 justify-center">
            <Button
              class="rounded-full mx-0 my-0 px-0 py-0"
              variant="text"
              icon="pi pi-eye"
              @click="openModal('view', data)"
            ></Button>
            <Button
              class="rounded-full mx-0 my-0 px-0 py-0"
              variant="text"
              icon="pi pi-pencil"
              @click="openModal('edit', data)"
            ></Button>
            <Button
              class="rounded-full"
              variant="text"
              icon="pi pi-trash"
              @click="openModal('delete', data)"
            ></Button>
          </div>
        </template>
        <template #body-icon="{ data }">
          <i :class="data.icon"></i>
        </template>
        <template #body-active="{ data }">
          <Chip :class="data.active ? 'bg-green-600' : 'bg-red-600'">{{
            data.active ? 'Activo' : 'Inactivo'
          }}</Chip>
        </template>
        <template #body-show="{ data }">
          <i :class="data.show ? 'pi pi-eye' : 'pi pi-eye-slash'"></i>
        </template>
      </AppDataTable>
    </section>
    <RouteFormModal :modal-state="modalState" @close-modal="closeModal" />
  </div>
</template>
<script setup lang="ts">
import { Button, Chip } from 'primevue';
import { nextTick, onMounted, reactive, watch, provide } from 'vue';

import { useAdmin } from '../composables/useAdmin';
import { RoutesResponse } from '../interfaces/routes.response.interface';
import RouteFormModal from '../components/routes/RouteFormModal.vue';

const adminInstance = useAdmin();
provide('useAdmin', adminInstance);

const {
  getRoutes,
  child_route,
  resetField,
  items,
  filter_name,
  resetForm,
  validateAlphaInput,
  cleanSearch,
  setRouteItem,
  findRoute,
  pagination,
  headers,
  getPermissions,
} = adminInstance;

const modalState = reactive<{
  show: boolean;
  mode: 'closed' | 'add' | 'view' | 'edit' | 'delete';
  title: string;
  description: string;
  isReadonly: boolean;
  selectedItem: null | number;
}>({
  show: false,
  mode: 'closed',
  title: '',
  description: '',
  isReadonly: false,
  selectedItem: null as number | null,
});

const openModal = (
  action: 'add' | 'view' | 'edit' | 'delete',
  data?: RoutesResponse,
) => {
  modalState.mode = action;
  modalState.isReadonly = action === 'view';

  switch (action) {
    case 'add':
      modalState.title = 'Agregar Ruta';
      break;
    case 'view':
      modalState.title = 'Ver Ruta';
      setRouteItem(data!);
      break;
    case 'edit':
      modalState.title = 'Editar Ruta';
      setRouteItem(data!);
      break;
    case 'delete':
      setRouteItem(data!);
      modalState.title = data!.active ? 'Desactivar Ruta' : 'Activar Ruta';
      modalState.description = `¿Está seguro de cambiar el estado de la ruta a ${data!.active ? 'inactivo' : 'activo'}?`;
      modalState.selectedItem = data!.id;
      break;
  }
  modalState.show = true;
};

const closeModal = () => {
  modalState.show = false;
  modalState.mode = 'closed';
  modalState.title = '';
  modalState.description = '';
  modalState.isReadonly = false;
  modalState.selectedItem = null;
  resetForm();
};

watch(
  child_route,
  (newValue, oldValue) => {
    if (oldValue === true && newValue === false) {
      try {
        nextTick(() => {
          resetField('parent_route', { errors: undefined, value: null });
        });
      } catch (error) {
        console.error(error);
      }
    }
  },
  {
    immediate: false,
  },
);

const handlePagination = async (page: number) => {
  if (page + 1 === pagination.page) {
    return;
  }
  pagination.page = page + 1;
  getRoutes();
};
onMounted(async () => {
  try {
    await getRoutes();
    await getPermissions();
  } catch (error) {
    console.error(error);
  }
});
</script>
<style scoped></style>
