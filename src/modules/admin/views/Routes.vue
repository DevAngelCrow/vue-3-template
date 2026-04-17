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
            class="min-w-auto w-full sm:w-[50%] grow shrink-0 md:w-45 lg:w-83.75"
            v-model="filter.filter_name"
            @input="validateAlphaInput(filter.filter_name)"
          />
          <AppSelect
            class="min-w-0 grow shrink-0 w-full sm:w-[40%] md:w-auto"
            :options="statusOptions"
            option-label="name"
            label="Estado"
            v-model="filter.active"
            optionValue="value"
          />
          <AppSelect
            class="min-w-0 grow shrink-0 w-full sm:w-[40%] md:w-auto"
            :options="parentRoutes"
            option-label="name"
            label="Ruta padre"
            v-model="filter.id_parent"
            optionValue="id"
          />
          <Button
            class="flex-shrink-0 grow rounded-md"
            v-debounce:700.click="() => findRoute(filter)"
            >Buscar</Button
          >
          <Button
            class="flex-shrink-0 grow rounded-md"
            outlined
            v-debounce:700.click="cleanSearch"
            >Limpiar</Button
          >
          <Button
            class="flex-shrink-0 grow rounded-md"
            @click="goToRouteMaintenance()"
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
        :show-per-page-options="true"
        :per-page-options="[10, 20, 50, 100]"
        @per-page-update="handlePerPagePagination"
      >
        <template #body-acciones="{ data }">
          <div class="flex gap-0 justify-center">
            <Button
              class="rounded-full mx-0 my-0 px-0 py-0"
              variant="text"
              icon="pi pi-eye"
              @click="goToRouteMaintenance(data.id)"
              v-tooltip.bottom="'Ver detalle'"
            ></Button>
            <Button
              class="rounded-full"
              variant="text"
              icon="pi pi-trash"
              @click="openModal('delete', data)"
              v-tooltip.bottom="'Eliminar'"
            ></Button>
          </div>
        </template>
        <template #body-icon="{ data }">
          <i :class="data.icon"></i>
        </template>
        <template #body-active="{ data }">
          <AppChip
            :label="data?.status?.name"
            :style="{
              backgroundColor: data?.status?.state_color,
              color: data?.status?.text_color,
            }"
          >
          </AppChip>
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
import { Button } from 'primevue';
import { nextTick, onMounted, reactive, watch, provide, ref } from 'vue';
import { useRouter } from 'vue-router';

import { useAdmin } from '../composables/useAdmin';
import { RoutesResponse } from '../interfaces/routes/routes.response.interface';
import RouteFormModal from '../components/routes/RouteFormModal.vue';

const adminInstance = useAdmin();
provide('useAdmin', adminInstance);

const router = useRouter();

const {
  getRoutes,
  child_route,
  resetField,
  items,
  filter,
  resetForm,
  validateAlphaInput,
  cleanSearch,
  setRouteItem,
  findRoute,
  pagination,
  headers,
  parentRoutes,
} = adminInstance;

const goToRouteMaintenance = (id?: string) => {
  if (id) {
    router.push({ name: 'route-maintenance', params: { id } });
  } else {
    router.push({ name: 'route-maintenance' });
  }
};
const modalState = reactive<{
  show: boolean;
  mode: 'closed' | 'add' | 'view' | 'edit' | 'delete';
  title: string;
  description: string;
  isReadonly: boolean;
  selectedItem: null | string;
}>({
  show: false,
  mode: 'closed',
  title: '',
  description: '',
  isReadonly: false,
  selectedItem: null as string | null,
});
const statusOptions = ref<{ name: string; value: boolean | null | 'Todos' }[]>([
  { name: 'Todos', value: 'Todos' },
  { name: 'Activo', value: true },
  { name: 'Inactivo', value: false },
]);
const openModal = (action: 'delete', data: RoutesResponse) => {
  modalState.mode = action;
  modalState.isReadonly = false;
  setRouteItem(data);
  modalState.title = data.active ? 'Desactivar Ruta' : 'Activar Ruta';
  modalState.description = `¿Está seguro de cambiar el estado de la ruta a ${data.active ? 'inactivo' : 'activo'}?`;
  modalState.selectedItem = data.id;
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
const handlePerPagePagination = async (perPage: number) => {
  if (perPage === pagination.per_page) return;

  pagination.per_page = perPage;
  pagination.page = 1;
  getRoutes();
};
onMounted(async () => {
  try {
    await getRoutes();
  } catch (error) {
    console.error(error);
  }
});
</script>
<style scoped></style>
