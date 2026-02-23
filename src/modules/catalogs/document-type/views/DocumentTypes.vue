<template>
  <div class="py-5 px-5 h-full max-h-full">
    <section
      id="document_type_content"
      class="w-full flex flex-row flex-wrap gap-5"
    >
      <div class="w-full flex flex-row gap-3 flex-wrap">
        <AppTitle
          title="Tipos de Documento"
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
            v-debounce:700.keydown.enter="() => findDocumentType(filter_name)"
          />
          <Button
            class="flex-shrink-0 grow rounded-md"
            v-debounce:700.click="() => findDocumentType(filter_name)"
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
        :items="documentTypes"
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
              v-tooltip.bottom="'Ver detalle'"
            ></Button>
            <Button
              class="rounded-full mx-0 my-0 px-0 py-0"
              variant="text"
              icon="pi pi-pencil"
              @click="openModal('edit', data)"
              :disabled="!data?.active"
              v-tooltip.bottom="'Editar'"
            ></Button>
            <Button
              class="rounded-full"
              variant="text"
              :icon="data?.active ? 'pi pi-trash' : 'pi pi-check-circle'"
              v-tooltip.bottom="data?.active ? 'Desactivar' : 'Activar'"
              @click="openModal('delete', data)"
            ></Button>
          </div>
        </template>
        <template #body-active="{ data }">
          <Chip
            :label="data?.active ? 'Activo' : 'Inactivo'"
            :style="{
              backgroundColor: data?.active ? '#10b981' : '#ef4444',
              color: '#ffffff',
            }"
          ></Chip>
        </template>
      </AppDataTable>
    </section>
    <DocumentTypeFormModal
      :modal-state="modalState"
      @close-modal="closeModal"
    />
  </div>
</template>
<script setup lang="ts">
import { onMounted, provide, reactive } from 'vue';
import { Button, Chip } from 'primevue';

import { useDocumentType } from '../../composables/useDocumentType';
import DocumentTypeFormModal from '../components/DocumentTypeFormModal.vue';
import { DocumentTypeResponse } from '../../interfaces/document-type/document-type.response.interface';

const documentTypeInstance = useDocumentType();
provide('useDocumentType', documentTypeInstance);

const {
  filter_name,
  resetForm,
  cleanSearch,
  findDocumentType,
  validateAlphaInput,
  setDocumentTypeItem,
  getDocumentTypes,
  headers,
  pagination,
  documentTypes,
} = documentTypeInstance;

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
  data?: DocumentTypeResponse,
) => {
  modalState.mode = action;
  modalState.isReadonly = action === 'view';

  switch (action) {
    case 'add':
      modalState.title = 'Agregar Tipo de Documento';
      break;
    case 'view':
      modalState.title = 'Ver Tipo de Documento';
      setDocumentTypeItem(data!);
      break;
    case 'edit':
      modalState.title = 'Editar Tipo de Documento';
      setDocumentTypeItem(data!);
      break;
    case 'delete':
      setDocumentTypeItem(data!);
      modalState.title = data!.active
        ? 'Desactivar Tipo de Documento'
        : 'Activar Tipo de Documento';
      modalState.description = `¿Está seguro de cambiar el estado del tipo de documento a ${data!.active ? 'inactivo' : 'activo'}?`;
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
  getDocumentTypes();
};

onMounted(async () => {
  await getDocumentTypes();
});
</script>
