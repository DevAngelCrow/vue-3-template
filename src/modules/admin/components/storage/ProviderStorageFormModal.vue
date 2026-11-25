<template>
  <AppModal
    :title="props.modalState.title"
    :show="props.modalState.show"
    :title-btn-cancel="modalButtons.cancelText"
    :title-btn-confirm="modalButtons.confirmText"
    footer-buttons
    show-icon-close
    width="42rem"
    :show-btn-confirm-footer="props.modalState.mode !== 'view'"
    @close-modal="closeModal"
    @confirm-modal="onSubmit"
  >
    <div
      v-if="props.modalState.mode !== 'delete'"
      class="w-full space-y-4 py-2"
    >
      <div
        class="grid grid-cols-1 items-start gap-x-4 gap-y-5 sm:grid-cols-2 md:grid-cols-6"
      >
        <AppInputText
          id="provider_code"
          v-model="code"
          v-bind="codeAttrs"
          class="md:col-span-2"
          label="Código*"
          placeholder="Ej. S3"
          :error-messages="errors.code"
          :readonly="props.modalState.isReadonly"
          maxlength="6"
        />
        <AppInputText
          id="provider_name"
          v-model="name"
          v-bind="nameAttrs"
          class="md:col-span-4"
          label="Nombre*"
          placeholder="Ej. Amazon S3"
          :error-messages="errors.name"
          :readonly="props.modalState.isReadonly"
          maxlength="150"
        />
        <AppInputText
          id="provider_description"
          v-model="description"
          v-bind="descriptionAttrs"
          class="sm:col-span-2 md:col-span-6"
          label="Descripción*"
          placeholder="Descripción del proveedor de almacenamiento"
          :error-messages="errors.description"
          :readonly="props.modalState.isReadonly"
          maxlength="150"
        />
        <div class="sm:col-span-2 md:col-span-6 pt-1">
          <AppCheckBox
            id="provider_active"
            v-model="active"
            v-bind="activeAttrs"
            label="Activo"
            :disabled="props.modalState.isReadonly"
            :error-messages="errors.active"
          />
        </div>
      </div>
    </div>

    <div v-else class="w-full py-4 text-center">
      <p class="text-sm text-surface-700">
        {{ props.modalState.description }}
      </p>
    </div>
  </AppModal>
</template>

<script setup lang="ts">
import { computed, inject } from 'vue';

import AppModal from '@/core/components/AppModal.vue';

import { useProviderStorage } from '../../composables/useProviderStorage';
import type { ProviderStorageForm } from '../../interfaces/storage/provider-storage.interface';

type ProviderStorageType = ReturnType<typeof useProviderStorage>;

const props = defineProps<{
  modalState: {
    show: boolean;
    mode: 'closed' | 'add' | 'view' | 'edit' | 'delete';
    title: string;
    description: string;
    isReadonly: boolean;
    selectedItem: string | null;
  };
}>();

const emit = defineEmits<{
  (e: 'close-modal'): void;
}>();

const providerStorage = inject<ProviderStorageType>('useProviderStorage')!;

const {
  name,
  nameAttrs,
  code,
  codeAttrs,
  description,
  descriptionAttrs,
  active,
  activeAttrs,
  errors,
  handleSubmit,
  addMutation,
  updateMutation,
  deleteMutation,
} = providerStorage;

const onSubmit = async () => {
  if (props.modalState.mode === 'delete' && props.modalState.selectedItem) {
    await deleteMutation.mutateAsync(props.modalState.selectedItem);
    emit('close-modal');
    return;
  }

  await handleSubmit(async values => {
    const payload: ProviderStorageForm = {
      name: values.name,
      code: values.code,
      description: values.description,
      active: values.active ?? true,
    };

    if (props.modalState.mode === 'add') {
      await addMutation.mutateAsync(payload);
    } else if (
      props.modalState.mode === 'edit' &&
      props.modalState.selectedItem
    ) {
      await updateMutation.mutateAsync({
        ...payload,
        id: props.modalState.selectedItem,
      });
    }
    emit('close-modal');
  })();
};

const closeModal = () => {
  emit('close-modal');
};

const modalButtons = computed(() => {
  switch (props.modalState.mode) {
    case 'edit':
      return { confirmText: 'Actualizar', cancelText: 'Cancelar' };
    case 'delete':
      return { confirmText: 'Eliminar', cancelText: 'Cancelar' };
    case 'view':
      return { confirmText: '', cancelText: 'Cerrar' };
    default:
      return { confirmText: 'Agregar', cancelText: 'Cancelar' };
  }
});
</script>
