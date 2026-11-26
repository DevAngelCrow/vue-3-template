<template>
  <div class="py-5 px-5 h-full max-h-full flex items-start justify-center">
    <section
      id="storage_files_content"
      class="w-full xl:w-[90%] flex flex-col gap-5"
    >
      <AppTitle title="Archivos Almacenados" class="w-full md:w-auto" />

      <div
        class="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-3 w-full"
      >
        <AppSelect
          v-model="filter.id_provider"
          class="w-full sm:w-72"
          label="Proveedor de almacenamiento"
          :options="providerOptions"
          option-label="name"
          option-value="id"
          show-clear
        />
        <Button
          class="w-full sm:w-auto rounded-md"
          icon="pi pi-search"
          label="Buscar"
          @click="debouncedFindStorageFiles"
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
          icon="pi pi-upload"
          label="Subir archivo"
          @click="uploadModalOpen = true"
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
          :items="storageFiles"
          :paginator="true"
          :per_page="pagination.per_page"
          :total_items="pagination.total_items"
          :page="pagination.page"
          :show-per-page-options="true"
          :per-page-options="[10, 20, 50, 100]"
          @page-update="handlePagination"
          @per-page-update="handlePerPagePagination"
        >
          <template #body-filename="{ data }">
            <span class="font-medium text-sm break-all">
              {{ data.filename }}
            </span>
          </template>

          <template #body-size="{ data }">
            <span class="whitespace-nowrap text-xs sm:text-sm">
              {{ formatFileSize(data.size) }}
            </span>
          </template>

          <template #body-id_provider="{ data }">
            <span class="text-sm">
              {{ providerNameById.get(data.id_provider) || data.id_provider }}
            </span>
          </template>

          <template #body-active="{ data }">
            <AppChipStatus
              :active="data.active"
              :label="data.active ? 'Activo' : 'Inactivo'"
            />
          </template>

          <template #body-created_at="{ data }">
            <span class="whitespace-nowrap text-xs sm:text-sm">
              {{ formatFileDate(data.created_at) }}
            </span>
          </template>

          <template #body-acciones="{ data }">
            <div class="flex justify-center">
              <Button
                class="rounded-full"
                variant="text"
                icon="pi pi-eye"
                v-tooltip.bottom="'Ver archivo'"
                @click="openPreviewModal(data)"
              />
            </div>
          </template>
        </AppDataTable>
      </AppSkeleton>
    </section>

    <StorageFileUploadModal
      :show="uploadModalOpen"
      @close-modal="uploadModalOpen = false"
    />

    <StorageFilePreviewModal
      :show="previewModalOpen"
      :file="selectedFile"
      :provider-label="selectedProviderLabel"
      :resolve-url="resolveFileUrl"
      :format-size="formatFileSize"
      :format-date="formatFileDate"
      @close-modal="closePreviewModal"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, provide, ref } from 'vue';
import { Button } from 'primevue';

import StorageFilePreviewModal from '../components/storage/StorageFilePreviewModal.vue';
import StorageFileUploadModal from '../components/storage/StorageFileUploadModal.vue';
import { useStorageFiles } from '../composables/useStorageFiles';
import type { StorageFileResponse } from '../interfaces/storage/storage-file.interface';

const storageFilesInstance = useStorageFiles();
provide('useStorageFiles', storageFilesInstance);

const {
  headers,
  pagination,
  filter,
  storageFiles,
  providerOptions,
  providerNameById,
  isFetching,
  debouncedFindStorageFiles,
  debouncedCleanSearch,
  formatFileSize,
  formatFileDate,
  resolveFileUrl,
} = storageFilesInstance;

const uploadModalOpen = ref(false);
const previewModalOpen = ref(false);
const selectedFile = ref<StorageFileResponse | null>(null);

const selectedProviderLabel = computed(() => {
  if (!selectedFile.value) return '—';
  return (
    providerNameById.value.get(selectedFile.value.id_provider) ||
    selectedFile.value.id_provider
  );
});

const openPreviewModal = (file: StorageFileResponse) => {
  selectedFile.value = file;
  previewModalOpen.value = true;
};

const closePreviewModal = () => {
  previewModalOpen.value = false;
  selectedFile.value = null;
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
