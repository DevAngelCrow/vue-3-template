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
        @page-update="
          (value: number) => {
            pagination.page = value + 1;
            getRoutes();
          }
        "
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
    <AppModal
      :title="modalState.title"
      :show="modalState.show"
      :title-btn-cancel="modalButtons.cancelText"
      :title-btn-confirm="modalButtons.confirmText"
      footer-buttons
      show-icon-close
      width="45rem"
      @close-modal="closeModal"
      @confirm-modal="onSubMit"
      :showBtnConfirmFooter="modalState.mode !== 'view'"
    >
      <section
        v-if="modalState.mode !== 'delete'"
        id="body_modal"
        class="flex justify-center items-center flex-wrap flex-row gap-5 py-1.5"
      >
        <AppInputText
          class="w-full min-w-0"
          id="name"
          label="Nombre*"
          v-model="name"
          :error-messages="errors.name"
          v-bind="nameAttrs"
          :readonly="modalState.isReadonly"
        />
        <AppInputText
          class="w-full min-w-0"
          id="title"
          label="Título*"
          v-model="title"
          :error-messages="errors.title"
          v-bind="titleAttrs"
          :readonly="modalState.isReadonly"
        />
        <AppInputText
          class="w-full min-w-0"
          id="uri"
          label="Uri*"
          v-model="uri"
          :error-messages="errors.uri"
          v-bind="uriAttrs"
          @update:modelValue="validateInputUri(uri, 'uri')"
          :readonly="modalState.isReadonly"
        />
        <AppInputText
          class="w-full min-w-0"
          id="description"
          label="Descripción*"
          v-model="description"
          :error-messages="errors.description"
          v-bind="descriptionAttrs"
          :readonly="modalState.isReadonly"
        />
        <div class="w-full flex flex-wrap gap-5">
          <AppInputText
            class="grow w-[50%] min-w-auto"
            id="order"
            label="Orden*"
            v-model.number="order"
            :error-messages="errors.order"
            v-bind="orderAttrs"
            :readonly="modalState.isReadonly"
          />
          <AppInputText
            class="grow w-[50%] min-w-auto"
            id="icon"
            label="Ícono (nombre)*"
            v-model="icon"
            :error-messages="errors.icon"
            v-bind="iconAttrs"
            :readonly="modalState.isReadonly"
          />
        </div>
        <div class="w-full flex flex-wrap justify-start">
          <div class="w-[50%]">
            <AppCheckBox
              id="child_route"
              label="Es sub-ruta"
              v-model="child_route"
              v-bind="child_routeAttrs"
              binary
              :readonly="modalState.isReadonly"
            />
          </div>
          <div class="w-[50%]">
            <AppCheckBox
              id="show"
              label="Mostrar en el menú"
              v-model="show"
              v-bind="showAttrs"
              binary
              :readonly="modalState.isReadonly"
            />
          </div>
        </div>
        <AppAutocomplete
          :class="showParentRoute"
          id="patern_route"
          label="Ruta padre"
          v-model="parent_route"
          v-bind="parent_routeAttrs"
          :error-messages="errors.parent_route"
          option-label="title"
          :suggestions="routesFiltered"
          dropdown
          @complete="findAutocomplete"
          :readonly="modalState.isReadonly"
          :disabled="!child_route"
        />
        <AppPickList
          v-model="permissionsListPicker"
          :option-label="'name'"
          :responsive="true"
          :show-source-controls="false"
          :show-target-controls="false"
        />
      </section>
      <section
        v-else
        id="body_delete_modal"
        class="w-full flex flex-wrap gap-5"
      >
        <div class="w-full flex justify-center text-center items-center">
          <span class="text-center flex">{{ modalState.description }}</span>
        </div>
      </section>
    </AppModal>
  </div>
</template>
<script setup lang="ts">
import { AutoCompleteCompleteEvent, Button, Chip } from 'primevue';
import { computed, nextTick, onMounted, reactive, ref, watch } from 'vue';

import { useLoaderStore } from '@/core/store';

import { useAdmin } from '../composables/useAdmin';
import { RouteForm } from '../interfaces/route-form.interface';
import { RoutesResponse } from '../interfaces/routes.response.interface';

const { startLoading, finishLoading } = useLoaderStore();
const {
  getRoutes,
  addRoute,
  editRoute,
  deleteRoute,
  errors,
  name,
  nameAttrs,
  title,
  titleAttrs,
  uri,
  uriAttrs,
  description,
  descriptionAttrs,
  order,
  orderAttrs,
  icon,
  iconAttrs,
  child_route,
  child_routeAttrs,
  show,
  showAttrs,
  parent_route,
  parent_routeAttrs,
  handleSubmit,
  parentRoutes,
  resetField,
  items,
  filter_name,
  resetForm,
  validateInputUri,
  validateAlphaInput,
  cleanSearch,
  setRouteItem,
  findRoute,
  pagination,
  headers,
  getPermissions,
  permissionsList,
} = useAdmin();

const modalState = reactive({
  show: false,
  mode: 'closed',
  title: '',
  description: '',
  isReadonly: false,
  selectedItem: null as number | null,
});

const routesFiltered = ref<any[]>([]);
const permissionsListPicker = ref<any[][]>([[], []]);

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

const findAutocomplete = (event: AutoCompleteCompleteEvent) => {
  let query = event?.query;
  let _filteredItems = [];
  for (let i = 0; i < parentRoutes.value.length; i++) {
    let item = parentRoutes.value[i];

    if (item?.title?.toLowerCase().indexOf(query.toLowerCase()) === 0) {
      _filteredItems.push(item);
    }
  }
  routesFiltered.value = _filteredItems;
};

const onSubMit = handleSubmit(async values => {
  try {
    startLoading();
    const form: RouteForm = {
      name: values.name,
      description: values.description,
      child_route: values.child_route,
      icon: values.icon,
      order: values.order,
      show: values.show ? true : false,
      uri: values.uri,
      parent_route: values.parent_route,
      title: values.title,
    };
    let success = false;
    switch (modalState.mode) {
      case 'add':
        success = (await addRoute(form)) ? true : false;
        break;
      case 'edit':
        form.id = values.id;
        form.active = values.active;
        success = (await editRoute(form)) ? true : false;
        break;
      case 'delete':
        success = (await deleteRoute(values.id)) ? true : false;
        break;
    }
    if (success) {
      closeModal();
    }
  } catch (error) {
    console.error(error);
  } finally {
    finishLoading();
  }
});

const showParentRoute = computed(() => {
  try {
    if (child_route.value) {
      return 'w-full !max-w-full min-w-auto max-h-20 transition-all transition-discrete duration-300';
    }
    return 'w-full !max-w-full min-w-auto max-h-0 transition-all transition-discrete duration-300 opacity-0 !pointer-events-none';
  } catch (error) {
    console.error(error);
  }
});

const modalButtons = computed(() => {
  switch (modalState.mode) {
    case 'edit':
      return { confirmText: 'Editar', cancelText: 'Cancelar' };
    case 'delete':
      return { confirmText: 'Aceptar', cancelText: 'Cancelar' };
    case 'view':
      return { confirmText: '', cancelText: 'Cerrar' };
    default:
      return { confirmText: 'Agregar', cancelText: 'Cancelar' };
  }
});

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

onMounted(async () => {
  try {
    await getRoutes();
    await getPermissions();
    permissionsListPicker.value = [permissionsList.value, []];
    nextTick(() => {});
  } catch (error) {
    console.error(error);
  }
});
</script>
<style scoped></style>
