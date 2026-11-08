<template>
  <div
    class="py-5 px-4 sm:px-6 h-full max-h-full flex items-start justify-center"
  >
    <section id="gender_content" class="w-full xl:w-[86%] flex flex-col gap-5">
      <div
        class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 w-full"
      >
        <AppTitle title="Géneros" class="w-full sm:w-auto" />
      </div>
      <div
        id="inputs"
        class="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-3 w-full"
      >
        <AppInputText
          label="Buscar..."
          class="w-full sm:w-64 md:w-80 min-w-0"
          v-model="filter_name"
          append-icon="pi pi-search"
          @update:modelValue="validateAlphaInput(filter_name)"
          @keydown.enter="debouncedFindGender"
        />
        <div class="flex items-center gap-2 flex-wrap">
          <Button class="rounded-md" @click="debouncedFindGender">
            Buscar
          </Button>
          <Button
            class="rounded-md"
            outlined
            @click="debouncedCleanSearch"
            label="Limpiar"
            :icon="iconFilter"
          />
        </div>
      </div>
      <AppSkeleton
        :loading="isPending"
        variant="table"
        :rows="pagination.per_page"
        :headers="headers"
        show-paginator
      >
        <AppDataTable
          class="w-full"
          :headers="headers"
          :items="genders"
          :paginator="true"
          :per_page="pagination.per_page"
          :total_items="pagination.total_items"
          :page="pagination.page"
          :show-per-page-options="true"
          :per-page-options="[10, 20, 50, 100]"
          @page-update="handlePagination"
          @per-page-update="handlePerPagePagination"
        >
          <template #body-acciones="{ data }">
            <div class="flex gap-0 justify-center">
              <Button
                class="rounded-full mx-0 my-0 px-0 py-0"
                variant="text"
                icon="pi pi-eye"
                @click="openModal(data)"
                v-tooltip.bottom="'Ver detalle'"
              />
            </div>
          </template>
        </AppDataTable>
      </AppSkeleton>
    </section>
    <GenderFormModal :modal-state="modalState" @close-modal="closeModal" />
  </div>
</template>

<script setup lang="ts">
import { computed, reactive } from 'vue';
import { Button } from 'primevue';

import AppTitle from '@/core/components/AppTitle.vue';
import AppInputText from '@/core/components/AppInputText.vue';
import AppDataTable from '@/core/components/AppDataTable.vue';
import AppSkeleton from '@/core/components/AppSkeleton.vue';

import { useGender } from '../../composables/useGender';
import { GenderResponse } from '../../interfaces/gender/gender.response.interface';
import GenderFormModal from '../components/GenderFormModal.vue';

const {
  headers,
  pagination,
  genders,
  filter_name,
  validateAlphaInput,
  debouncedFindGender,
  debouncedCleanSearch,
  isPending,
} = useGender();

const modalState = reactive<{
  show: boolean;
  title: string;
  selectedItem: GenderResponse | null;
}>({
  show: false,
  title: '',
  selectedItem: null,
});

const openModal = (data: GenderResponse) => {
  modalState.title = 'Ver Género';
  modalState.selectedItem = data;
  modalState.show = true;
};

const closeModal = () => {
  modalState.show = false;
  modalState.title = '';
  modalState.selectedItem = null;
};

const handlePagination = (page: number) => {
  if (page + 1 === pagination.page) {
    return;
  }
  pagination.page = page + 1;
};

const handlePerPagePagination = (perPage: number) => {
  if (perPage === pagination.per_page) return;
  pagination.per_page = perPage;
  pagination.page = 1;
};

const iconFilter = computed(() => {
  if (!filter_name.value) {
    return 'pi pi-filter';
  }
  return 'pi pi-filter-slash';
});
</script>

<style scoped></style>
