<template>
  <div class="py-5 px-5 h-full max-h-full flex items-start justify-center">
    <section
      id="provider_storages_content"
      class="w-full xl:w-[85%] flex flex-col gap-5"
    >
      <AppTitle title="Proveedores de Almacenamiento" class="w-full md:w-auto" />

      <div
        class="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-3 w-full"
      >
        <AppInputText
          v-model="filter.filter"
          class="w-full sm:w-72"
          label="Buscar por nombre o código..."
          append-icon="pi pi-search"
          @keydown.enter="debouncedFindProviderStorage"
        />
        <Button
          class="w-full sm:w-auto rounded-md"
          label="Buscar"
          @click="debouncedFindProviderStorage"
        />
        <Button
          class="w-full sm:w-auto rounded-md"
          outlined
          :icon="iconFilter"
          label="Limpiar"
          @click="debouncedCleanSearch"
        />
        <Button
          class="w-full sm:w-auto rounded-md sm:ml-auto"
          icon="pi pi-plus-circle"
          label="Agregar"
          @click="openModal('add')"
        />
      </div>

      <AppSkeleton
        :loading="isFetching"
        variant="table"
        :rows="pagination.per_page"
        :headers="headers"
        show-paginator
      >
        <AppDataTable
          class="w-full"
          :headers="headers"
          :items="providers"
          :paginator="true"
          :per_page="pagination.per_page"
          :total_items="pagination.total_items"
          :page="pagination.page"
          :show-per-page-options="true"
          :per-page-options="[10, 20, 50, 100]"
          @page-update="handlePagination"
          @per-page-update="handlePerPagePagination"
        >
          <template #body-code="{ data }">
            <span class="font-mono font-semibold text-sm">{{ data.code }}</span>
          </template>

          <template #body-active="{ data }">
            <AppChipStatus
              :active="data.active"
              :label="data.active ? 'Activo' : 'Inactivo'"
            />
          </template>

          <template #body-acciones="{ data }">
            <div class="flex gap-1 justify-center">
              <Button
                class="rounded-full"
                variant="text"
                icon="pi pi-eye"
                v-tooltip.bottom="'Ver detalle'"
                @click="openModal('view', data)"
              />
              <Button
                class="rounded-full"
                variant="text"
                icon="pi pi-pencil"
                v-tooltip.bottom="'Editar'"
                @click="openModal('edit', data)"
              />
              <Button
                class="rounded-full"
                variant="text"
                severity="danger"
                icon="pi pi-trash"
                v-tooltip.bottom="'Eliminar'"
                @click="openModal('delete', data)"
              />
            </div>
          </template>
        </AppDataTable>
      </AppSkeleton>
    </section>

    <ProviderStorageFormModal
      :modal-state="modalState"
      @close-modal="closeModal"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, provide, reactive } from 'vue';
import { Button } from 'primevue';

import ProviderStorageFormModal from '../components/storage/ProviderStorageFormModal.vue';
import { useProviderStorage } from '../composables/useProviderStorage';
import type { ProviderStorageResponse } from '../interfaces/storage/provider-storage.interface';

const providerStorageInstance = useProviderStorage();
provide('useProviderStorage', providerStorageInstance);

const {
  filter,
  resetForm,
  setProviderStorageItem,
  debouncedFindProviderStorage,
  debouncedCleanSearch,
  headers,
  pagination,
  providers,
  isFetching,
} = providerStorageInstance;

const modalState = reactive<{
  show: boolean;
  mode: 'closed' | 'add' | 'view' | 'edit' | 'delete';
  title: string;
  description: string;
  isReadonly: boolean;
  selectedItem: string | null;
}>({
  show: false,
  mode: 'closed',
  title: '',
  description: '',
  isReadonly: false,
  selectedItem: null,
});

const openModal = (
  action: 'add' | 'view' | 'edit' | 'delete',
  data?: ProviderStorageResponse,
) => {
  modalState.mode = action;
  modalState.isReadonly = action === 'view';

  switch (action) {
    case 'add':
      resetForm();
      modalState.title = 'Agregar Proveedor';
      modalState.selectedItem = null;
      break;
    case 'view':
      if (data) setProviderStorageItem(data);
      modalState.title = 'Ver Proveedor';
      modalState.selectedItem = data?.id ?? null;
      break;
    case 'edit':
      if (data) setProviderStorageItem(data);
      modalState.title = 'Editar Proveedor';
      modalState.selectedItem = data?.id ?? null;
      break;
    case 'delete':
      modalState.title = 'Eliminar Proveedor';
      modalState.description = `¿Está seguro de eliminar el proveedor "${data?.name ?? ''}" (${data?.code ?? ''})?`;
      modalState.selectedItem = data?.id ?? null;
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

const handlePagination = (page: number) => {
  if (page + 1 === pagination.page) return;
  pagination.page = page + 1;
};

const handlePerPagePagination = (perPage: number) => {
  if (perPage === pagination.per_page) return;
  pagination.per_page = perPage;
  pagination.page = 1;
};

const iconFilter = computed(() =>
  Object.values(filter).some(Boolean) ? 'pi pi-filter-slash' : 'pi pi-filter',
);
</script>
