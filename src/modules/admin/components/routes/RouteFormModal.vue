<template>
  <AppModal
    :title="props.modalState.title"
    :show="props.modalState.show"
    :title-btn-cancel="modalButtons.cancelText"
    :title-btn-confirm="modalButtons.confirmText"
    footer-buttons
    show-icon-close
    width="45rem"
    @close-modal="closeModal"
    @confirm-modal="onSubMit"
    :showBtnConfirmFooter="props.modalState.mode !== 'view'"
  >
    <section
      v-if="props.modalState.mode !== 'delete'"
      id="body_modal"
      class="flex justify-center items-center flex-wrap flex-row gap-5 py-1.5 w-full"
    >
      <AppInputText
        class="w-full min-w-0"
        id="name"
        label="Nombre*"
        v-model="name"
        :error-messages="errors.name"
        v-bind="nameAttrs"
        :readonly="props.modalState.isReadonly"
      />
      <AppInputText
        class="w-full min-w-0"
        id="title"
        label="Título*"
        v-model="title"
        :error-messages="errors.title"
        v-bind="titleAttrs"
        :readonly="props.modalState.isReadonly"
      />
      <AppInputText
        class="w-full min-w-0"
        id="uri"
        label="Uri*"
        v-model="uri"
        :error-messages="errors.uri"
        v-bind="uriAttrs"
        @update:modelValue="validateInputUri(uri, 'uri')"
        :readonly="props.modalState.isReadonly"
      />
      <AppInputText
        class="w-full min-w-0"
        id="description"
        label="Descripción*"
        v-model="description"
        :error-messages="errors.description"
        v-bind="descriptionAttrs"
        :readonly="props.modalState.isReadonly"
      />
      <div class="w-full flex flex-wrap gap-5">
        <AppInputNumber
          class="grow"
          id="order"
          label="Orden*"
          v-model.number="order"
          :error-messages="errors.order"
          v-bind="orderAttrs"
          :readonly="props.modalState.isReadonly"
        />
        <AppInputText
          class="grow"
          id="icon"
          label="Ícono (nombre)*"
          v-model="icon"
          :error-messages="errors.icon"
          v-bind="iconAttrs"
          :readonly="props.modalState.isReadonly"
        />
      </div>
      <div class="w-full flex flex-wrap justify-start gap-5">
        <div class="flex-1">
          <AppCheckBox
            id="child_route"
            label="Es sub-ruta"
            v-model="child_route"
            v-bind="child_routeAttrs"
            binary
            :readonly="props.modalState.isReadonly"
          />
        </div>
        <div class="flex-1">
          <AppCheckBox
            id="show"
            label="Mostrar en el menú"
            v-model="show"
            v-bind="showAttrs"
            binary
            :readonly="props.modalState.isReadonly"
          />
        </div>
        <div class="w-full mt-5">
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
            :readonly="props.modalState.isReadonly"
            :disabled="!child_route"
          />
        </div>
        <RoutePermissionDataTable
          :modal-state="props.modalState.mode"
          @update:selected-permissions-ids="
            value => (selectedPermissionsIds = value)
          "
          ref="routePermissionDataTable"
          :readonly="props.modalState.isReadonly"
        />
      </div>
    </section>
    <section v-else id="body_delete_modal" class="w-full flex flex-wrap gap-5">
      <div class="w-full flex justify-center text-center items-center">
        <span class="text-center flex">{{ props.modalState.description }}</span>
      </div>
    </section>
  </AppModal>
</template>
<script setup lang="ts">
import { AutoCompleteCompleteEvent } from 'primevue';
import { computed, ref, inject } from 'vue';

import { useLoaderStore } from '@/core/store';

import { useAdmin } from '../../composables/useAdmin';
import { RouteForm } from '../../interfaces/route-form.interface';
import RoutePermissionDataTable from './RoutePermissionDataTable.vue';

type AdminType = ReturnType<typeof useAdmin>;

const props = defineProps<{
  modalState: {
    show: boolean;
    mode: 'closed' | 'add' | 'view' | 'edit' | 'delete';
    title: string;
    description: string;
    isReadonly: boolean;
    selectedItem: null | number;
  };
}>();

const emit = defineEmits(['close-modal']);
const admin = inject<AdminType>('useAdmin')!;
const { startLoading, finishLoading } = useLoaderStore();
const {
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
  addRoute,
  deleteRoute,
  editRoute,
  validateInputUri,
} = admin;

const routesFiltered = ref<unknown[]>([]);
const selectedPermissionsIds = ref<Set<number>>(new Set());
const routePermissionDataTable = ref<InstanceType<
  typeof RoutePermissionDataTable
> | null>(null);

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
      permissions_id: [...selectedPermissionsIds.value],
    };
    let success = false;
    switch (props.modalState.mode) {
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
      emit('close-modal');
    }
  } catch (error) {
    console.error(error);
  } finally {
    finishLoading();
  }
});

const closeModal = () => {
  routePermissionDataTable.value?.closeModal();
  emit('close-modal');
};

const showParentRoute = computed(() => {
  try {
    if (child_route.value) {
      return 'w-full !max-w-full min-w-0 max-h-20 transition-all transition-discrete duration-300';
    }
    return 'w-full !max-w-full min-w-0 max-h-0 transition-all transition-discrete duration-300 opacity-0 !pointer-events-none';
  } catch (error) {
    console.error(error);
  }
});

const modalButtons = computed(() => {
  switch (props.modalState.mode) {
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
</script>
<style scoped></style>
