<template>
  <div class="py-5 px-5 h-full max-h-full">
    <section
      id="global_status_content"
      class="w-full flex flex-row flex-wrap gap-5"
    >
      <div class="w-full flex flex-row gap-3 flex-wrap">
        <AppTitle
          title="Estados Globales"
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
            v-debounce:700.keydown.enter="() => findGlobalStatus(filter_name)"
          />
          <Button
            class="flex-shrink-0 grow rounded-md"
            v-debounce:700.click="() => findGlobalStatus(filter_name)"
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
        :items="globalStatus"
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
        <template #body-active="{ data }">
          <Chip
            :label="data?.status?.name"
            :style="{
              backgroundColor: data?.status?.state_color,
              color: data?.status?.text_color,
            }"
          ></Chip>
        </template>
        <template #body-state_color="{ data }">
          <div class="flex justify-center items-center gap-2 w-full h-full">
            <div
              :class="`rounded-xl border-1 h-5 w-[20px]`"
              :style="{ backgroundColor: data.state_color }"
            ></div>
            <span>{{ data.state_color }}</span>
          </div>
        </template>
        <template #body-text_color="{ data }">
          <div class="flex justify-center items-center gap-2 w-full h-full">
            <div
              :class="`rounded-xl border-1 h-5 w-[20px]`"
              :style="{ backgroundColor: data.text_color }"
            ></div>
            <span>{{ data.text_color }}</span>
          </div>
        </template>
      </AppDataTable>
    </section>
    <GlobalStatusFormModal
      :modal-state="modalState"
      @close-modal="closeModal"
    />
  </div>
</template>
<script setup lang="ts">
import { onMounted, provide, reactive } from 'vue';
import { Button, Chip } from 'primevue';

import { useGlobalStatus } from '../../composables/useGlobalStatus';
import { GlobalStatusResponse } from '../../interfaces/global-status/global-status.response.interface';
import GlobalStatusFormModal from '../components/GlobalStatusFormModal.vue';

const globalStatusInstance = useGlobalStatus();
provide('useGlobalStatus', globalStatusInstance);

const {
  filter_name,
  resetForm,
  cleanSearch,
  findGlobalStatus,
  validateAlphaInput,
  setGlobalStatusItem,
  getGlobalStatus,
  headers,
  pagination,
  globalStatus,
  getCategoryStatuses,
} = globalStatusInstance;

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
  data?: GlobalStatusResponse,
) => {
  modalState.mode = action;
  modalState.isReadonly = action === 'view';

  switch (action) {
    case 'add':
      modalState.title = 'Agregar Estado Global';
      break;
    case 'view':
      modalState.title = 'Ver Estado Global';
      setGlobalStatusItem(data!);
      break;
    case 'edit':
      modalState.title = 'Editar Estado Global';
      console.log('data', data);
      setGlobalStatusItem(data!);
      break;
    case 'delete':
      setGlobalStatusItem(data!);
      modalState.title = data!.active
        ? 'Desactivar Estado Global'
        : 'Activar Distrito';
      modalState.description = `¿Está seguro de cambiar el estado del estado global a ${data!.active ? 'inactivo' : 'activo'}?`;
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

const handlePagination = async (page: number) => {
  if (page + 1 === pagination.page) {
    return;
  }
  pagination.page = page + 1;
  getGlobalStatus();
};
onMounted(async () => {
  await getGlobalStatus();
  await getCategoryStatuses();
});
</script>
<style scoped></style>
