<template>
  <div class="py-5 px-5 h-full max-h-full">
    <section
      id="departments_content"
      class="w-full flex flex-row flex-wrap gap-5"
    >
      <div class="w-full flex flex-row gap-3 flex-wrap">
        <AppTitle
          title="Categoría de Permisos"
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
            v-debounce:700.keydown.enter="
              () => findCategoryPermission(filter_name)
            "
          />
          <Button
            class="flex-shrink-0 grow rounded-md"
            v-debounce:700.click="() => findCategoryPermission(filter_name)"
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
        :items="categories"
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
              v-tooltip.bottom="'Editar'"
            ></Button>
            <Button
              class="rounded-full"
              variant="text"
              :icon="data?.active ? 'pi pi-trash' : 'pi pi-check-circle'"
              @click="openModal('delete', data)"
              v-tooltip.bottom="data?.active ? 'Desactivar' : 'Activar'"
            ></Button>
          </div>
        </template>
        <template #body-icon="{ data }">
          <i :class="data.icon"></i>
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
      </AppDataTable>
    </section>
    <CategoryPermissionFormModal
      :modal-state="modalState"
      @close-modal="closeModal"
    />
  </div>
</template>
<script setup lang="ts">
import { onMounted, provide, reactive } from 'vue';
import { Button, Chip } from 'primevue';

import { PermissionsResponse } from '../interfaces/permissions/permissions.response.interface';
import { useCategoryPermission } from '../composables/useCategoryPermission';
import CategoryPermissionFormModal from '../components/category-permissions/CategoryPermissionFormModal.vue';

const categoryPermissionInstance = useCategoryPermission();
provide('useCategoryPermission', categoryPermissionInstance);

const {
  filter_name,
  resetForm,
  cleanSearch,
  findCategoryPermission,
  validateAlphaInput,
  setCategoryPermissionItem,
  getCategoryPermissions,
  headers,
  pagination,
  categories,
} = categoryPermissionInstance;

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
  data?: PermissionsResponse,
) => {
  modalState.mode = action;
  modalState.isReadonly = action === 'view';

  switch (action) {
    case 'add':
      modalState.title = 'Agregar Categoría';
      break;
    case 'view':
      modalState.title = 'Ver Categoría';
      setCategoryPermissionItem(data!);
      break;
    case 'edit':
      modalState.title = 'Editar Categoría';
      setCategoryPermissionItem(data!);
      break;
    case 'delete':
      setCategoryPermissionItem(data!);
      modalState.title = data!.active
        ? 'Desactivar Categoría'
        : 'Activar Categoría';
      modalState.description = `¿Está seguro de cambiar el estado de la categoría a ${data!.active ? 'inactivo' : 'activo'}?`;
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
  getCategoryPermissions();
};
onMounted(async () => {
  await getCategoryPermissions();
});
</script>
<style scoped></style>
