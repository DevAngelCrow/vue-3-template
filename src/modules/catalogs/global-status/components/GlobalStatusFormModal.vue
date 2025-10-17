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
        id="description"
        label="Descripción"
        v-model="description"
        :error-messages="errors.description"
        v-bind="descriptionAttrs"
        :readonly="props.modalState.isReadonly"
      />
      <AppInputText
        class="w-full min-w-0"
        id="table_header"
        label="Cabecera de tabla*"
        v-model="table_header"
        :error-messages="errors.table_header"
        v-bind="tableHeaderAttrs"
        :readonly="props.modalState.isReadonly"
      />
    </section>
    <section v-else id="body_delete_modal" class="w-full flex flex-wrap gap-5">
      <div class="w-full flex justify-center text-center items-center">
        <span class="text-center flex">{{ props.modalState.description }}</span>
      </div>
    </section>
  </AppModal>
</template>
<script setup lang="ts">
import { computed, inject } from 'vue';

import AppModal from '@/core/components/AppModal.vue';
import { useLoaderStore } from '@/core/store';

import { useGlobalStatus } from '../../composables/useGlobalStatus';
import { GlobalStatusForm } from '../../interfaces/global-status/global-status.form.interface';

type GlobalStateType = ReturnType<typeof useGlobalStatus>;

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
const useGlobalStatusComposable = inject<GlobalStateType>('useGlobalStatus')!;
const { startLoading, finishLoading } = useLoaderStore();

const {
  errors,
  name,
  nameAttrs,
  description,
  descriptionAttrs,
  table_header,
  tableHeaderAttrs,
  handleSubmit,
  addGlobalStatus,
  editGlobalStatus,
  deleteGlobalStatus,
} = useGlobalStatusComposable;

const onSubMit = handleSubmit(async values => {
  try {
    startLoading();
    const form: GlobalStatusForm = {
      name: values?.name,
      description: values?.description,
      table_header: values?.table_header,
    };
    let success = false;
    switch (props.modalState.mode) {
      case 'add':
        success = (await addGlobalStatus(form)) ? true : false;
        break;
      case 'edit':
        form.id = values.id;
        form.state = values.state;
        success = (await editGlobalStatus(form)) ? true : false;
        break;
      case 'delete':
        success = (await deleteGlobalStatus(values.id)) ? true : false;
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
  emit('close-modal');
};

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
