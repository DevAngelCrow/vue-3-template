<template>
  <div class="flex justify-center items-center flex-wrap flex-row gap-5 w-full">
    <div class="w-full flex flex-wrap gap-5">
      <AppInputText
        class="flex-1 min-w-0"
        id="name"
        label="Nombre*"
        v-model="name"
        :error-messages="errors.name"
        v-bind="nameAttrs"
        :readonly="props.modalState.isReadonly"
      />
      <AppInputText
        class="flex-1 min-w-0"
        id="title"
        label="Título*"
        v-model="title"
        :error-messages="errors.title"
        v-bind="titleAttrs"
        :readonly="props.modalState.isReadonly"
      />
    </div>
    <div class="w-full flex flex-wrap gap-5">
      <AppInputText
        class="flex-1 min-w-0"
        id="uri"
        label="Uri*"
        v-model="uri"
        :error-messages="errors.uri"
        v-bind="uriAttrs"
        @update:modelValue="validateInputUri(uri, 'uri')"
        :readonly="props.modalState.isReadonly"
      />
      <AppInputText
        class="flex-1 min-w-0"
        id="description"
        label="Descripción*"
        v-model="description"
        :error-messages="errors.description"
        v-bind="descriptionAttrs"
        :readonly="props.modalState.isReadonly"
      />
    </div>
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
    </div>
  </div>
</template>
<script setup lang="ts">
import { computed, inject, ref } from 'vue';
import { AutoCompleteCompleteEvent } from 'primevue';

import { useAdmin } from '../../composables/useAdmin';

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

const admin = inject<AdminType>('useAdmin')!;

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
  parentRoutes,

  validateInputUri,
} = admin;

const routesFiltered = ref<unknown[]>([]);
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
</script>
<style scoped></style>
