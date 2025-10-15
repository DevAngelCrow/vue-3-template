<template>
  <div class="py-5 px-5 h-full max-h-full">
    <section
      id="departments_content"
      class="w-full flex flex-row flex-wrap gap-5"
    >
      <div class="w-full flex flex-row gap-3 flex-wrap">
        <AppTitle
          title="Departamentos"
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
            v-debounce:700.keydown.enter="() => findDepartment(filter_name)"
          />
          <Button
            class="flex-shrink-0 grow rounded-md"
            v-debounce:700.click="() => findDepartment(filter_name)"
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
    </section>
  </div>
</template>
<script setup lang="ts">
import { onMounted, provide, reactive } from 'vue';
import { Button } from 'primevue';

import { useDepartment } from '../../composables/useDepartment';
import { DepartmentResponse } from '../../interfaces/deparments/department.response.interface';

const departmentInstance = useDepartment();
provide('useDepartment', departmentInstance);

const {
  filter_name,
  //resetForm,
  cleanSearch,
  findDepartment,
  validateAlphaInput,
  setDepartmenItem,
  getCountries,
  getDepartments,
  //headers, pagination
} = departmentInstance;

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
  data?: DepartmentResponse,
) => {
  modalState.mode = action;
  modalState.isReadonly = action === 'view';

  switch (action) {
    case 'add':
      modalState.title = 'Agregar Departamento';
      break;
    case 'view':
      modalState.title = 'Ver Departamento';
      setDepartmenItem(data!);
      break;
    case 'edit':
      modalState.title = 'Editar Departamento';
      setDepartmenItem(data!);
      break;
    case 'delete':
      setDepartmenItem(data!);
      modalState.title = data!.active
        ? 'Desactivar Departamento'
        : 'Activar Departamento';
      modalState.description = `¿Está seguro de cambiar el estado del departamento a ${data!.active ? 'inactivo' : 'activo'}?`;
      modalState.selectedItem = data!.id;
      break;
  }
  modalState.show = true;
};

// const closeModal = () => {
//   modalState.show = false;
//   modalState.mode = 'closed';
//   modalState.title = '';
//   modalState.description = '';
//   modalState.isReadonly = false;
//   modalState.selectedItem = null;
//   resetForm();
// };

onMounted(async () => {
  await getCountries();
  await getDepartments();
});
</script>
<style scoped></style>
