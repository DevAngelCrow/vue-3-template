<template>
  <div class="py-5 px-5 h-full max-h-full">
    <section id="departments_content" class="w-full flex flex-row flex-wrap gap-5">
      <div class="w-full flex flex-row gap-3 flex-wrap">
        <AppTitle title="Permisos" class="w-full md:w-auto flex justify-center items-center" />
        <div id="inputs" class="flex rounded-lg border-2 border-primary py-0.5 px-0.5 gap-3 flex-wrap grow lg:grow-0">
          <AppInputText label="Buscar" class="min-w-auto w-auto grow shrink-0 md:w-[335px]" v-model="filter.filter_name"
            @update:modelValue="validateAlphaInput(filter.filter_name)"
            v-debounce:700.keydown.enter="() => findPermission(filter)" />
          <AppSelect class="w-full sm:w-[20%] lg:w-auto min-w-0 grow shrink-0" :options="categoryPermissions" option-label="name"
            label="Categoría" v-model="filter.category_permission_id" optionValue="id" />
          <AppSelect class="w-full sm:w-[20%] lg:w-auto min-w-0 grow shrink-0" :options="statusOptions"
            option-label="name" label="Estado" v-model="filter.active" optionValue="value" />
          <Button class="shrink-0 grow rounded-md"
            v-debounce:700.click="() => findPermission(filter)">Buscar</Button>
          <Button class="shrink-0 grow rounded-md" outlined v-debounce:700.click="cleanSearch">Limpiar</Button>
          <Button class="shrink-0 grow rounded-md" @click="openModal('add')"><i
              class="pi pi-plus flex justify-center items-center text-center"
              style="font-size: 1.1rem; font-weight: bold"></i><span>Agregar</span></Button>
        </div>
      </div>
      <AppDataTable class="w-full" :headers="headers" :items="permissions" :paginator="true"
        :per_page="pagination.per_page" :total_items="pagination.total_items" :page="pagination.page"
        @page-update="handlePagination" :show-per-page-options="true" :per-page-options="[10, 20, 50, 100]"
        @per-page-update="handlePerPagePagination">
        <template #body-acciones="{ data }">
          <div class="flex gap-0 justify-center">
            <Button class="rounded-full mx-0 my-0 px-0 py-0" variant="text" icon="pi pi-eye"
              @click="openModal('view', data)" v-tooltip.bottom="'Ver detalle'"></Button>
            <Button class="rounded-full mx-0 my-0 px-0 py-0" variant="text" icon="pi pi-pencil"
              @click="openModal('edit', data)" :disabled="!data.active" v-tooltip.bottom="'Editar'"></Button>
            <Button class="rounded-full" variant="text" :icon="data.active ? 'pi pi-trash' : 'pi pi-check-circle'"
              @click="openModal('delete', data)" v-tooltip.bottom="data.active ? 'Desactivar' : 'Activar'"></Button>
          </div>
        </template>
        <template #body-icon="{ data }">
          <i :class="data.icon"></i>
        </template>
        <template #body-active="{ data }">
          <AppChip :label="data?.status?.name" :style="{
            backgroundColor: data?.status?.state_color,
            color: data?.status?.text_color,
          }">
          </AppChip>
        </template>
      </AppDataTable>
    </section>
    <PermissionFormModal :modal-state="modalState" @close-modal="closeModal" />
  </div>
</template>
<script setup lang="ts">
import { onMounted, provide, reactive, ref } from 'vue';
import { Button } from 'primevue';

import { usePermission } from '../composables/usePermissions';
import { PermissionsResponse } from '../interfaces/permissions/permissions.response.interface';
import PermissionFormModal from '../components/permissions/PermissionFormModal.vue';

const permissionInstance = usePermission();
provide('usePermission', permissionInstance);

const {
  filter,
  resetForm,
  cleanSearch,
  findPermission,
  validateAlphaInput,
  setPermissionItem,
  getPermissions,
  getCategoryPermissions,
  headers,
  pagination,
  permissions,
  categoryPermissions,
} = permissionInstance;

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
      modalState.title = 'Agregar Departamento';
      break;
    case 'view':
      modalState.title = 'Ver Departamento';
      setPermissionItem(data!);
      break;
    case 'edit':
      modalState.title = 'Editar Departamento';
      setPermissionItem(data!);
      break;
    case 'delete':
      setPermissionItem(data!);
      modalState.title = data!.active
        ? 'Desactivar Permiso'
        : 'Activar Permiso';
      modalState.description = `¿Está seguro de cambiar el estado del permiso a ${data!.active ? 'inactivo' : 'activo'}?`;
      modalState.selectedItem = data!.id;
      break;
  }
  modalState.show = true;
};
const statusOptions = ref<{ name: string, value: boolean | null | 'Todos' }[]>([{ name: 'Todos', value: 'Todos' }, { name: 'Activo', value: true }, { name: 'Inactivo', value: false },]);
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
  getPermissions();
};
const handlePerPagePagination = async (perPage: number) => {
  if (perPage === pagination.per_page) return;

  pagination.per_page = perPage;
  pagination.page = 1;
  getPermissions();
};
onMounted(async () => {
  await getPermissions();
  await getCategoryPermissions();
});
</script>
<style scoped></style>
