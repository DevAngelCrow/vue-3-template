<template>
  <div class="flex justify-center items-center flex-wrap flex-row w-full">
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
        id="description"
        label="Descripción"
        v-model="description"
        :error-messages="errors.description"
        v-bind="descriptionAttrs"
        :readonly="props.modalState.isReadonly"
      />
    </div>
    <div class="w-full flex flex-wrap justify-start gap-5">
      <div class="w-full mt-5">
        <AppAutocomplete
          class="w-full"
          id="status"
          label="Estado*"
          v-model="status"
          v-bind="statusAttrs"
          :error-messages="errors.status"
          option-label="name"
          :suggestions="statusFiltered"
          dropdown
          @complete="findAutocomplete"
          :readonly="props.modalState.isReadonly"
        />
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { inject, ref } from 'vue';
import { AutoCompleteCompleteEvent } from 'primevue';

import { useRole } from '../../composables/useRole';

type RoleType = ReturnType<typeof useRole>;
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

const rol = inject<RoleType>('useRole')!;

const {
  errors,
  name,
  nameAttrs,
  description,
  descriptionAttrs,
  status,
  statusAttrs,
  globalStatus,
} = rol;

const statusFiltered = ref<unknown[]>([]);
const findAutocomplete = (event: AutoCompleteCompleteEvent) => {
  let query = event?.query;
  let _filteredItems = [];
  for (let i = 0; i < globalStatus.value.length; i++) {
    let item = globalStatus.value[i];

    if (item?.name?.toLowerCase().indexOf(query.toLowerCase()) === 0) {
      _filteredItems.push(item);
    }
  }
  statusFiltered.value = _filteredItems;
};
</script>
<style scoped></style>
