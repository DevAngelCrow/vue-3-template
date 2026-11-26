<template>
  <AppModal
    title="Subir Archivo"
    :show="props.show"
    title-btn-cancel="Cancelar"
    title-btn-confirm="Subir"
    footer-buttons
    show-icon-close
    width="45rem"
    @close-modal="closeModal"
    @confirm-modal="onSubmit"
  >
    <div class="w-full space-y-4 py-2">
      <div
        class="grid grid-cols-1 items-start gap-x-4 gap-y-5 sm:grid-cols-2 md:grid-cols-6"
      >
        <AppSelect
          v-model="providerCode"
          v-bind="providerCodeAttrs"
          class="md:col-span-3"
          label="Proveedor (opcional)"
          :options="activeProviderOptions"
          option-label="name"
          option-value="code"
          :error-messages="errors.provider_code"
        />
        <AppInputText
          v-model="folder"
          v-bind="folderAttrs"
          class="md:col-span-3"
          label="Carpeta destino (opcional)"
          placeholder="Ej. inventory_img"
          :error-messages="errors.folder"
          maxlength="80"
        />
        <div class="sm:col-span-2 md:col-span-6">
          <AppDragDropFile
            v-model="files"
            v-bind="filesAttrs"
            label="Imagen*"
            accept="image/jpeg,image/png,image/gif,image/webp"
            :max-size="maxUploadSizeBytes"
            :error-messages="errors.files"
          />
        </div>
      </div>
    </div>
  </AppModal>
</template>

<script setup lang="ts">
import { inject } from 'vue';

import AppModal from '@/core/components/AppModal.vue';

import { useStorageFiles } from '../../composables/useStorageFiles';

type StorageFilesType = ReturnType<typeof useStorageFiles>;

const props = defineProps<{
  show: boolean;
}>();

const emit = defineEmits<{
  (e: 'close-modal'): void;
}>();

const storageFilesInstance = inject<StorageFilesType>('useStorageFiles')!;

const {
  files,
  filesAttrs,
  providerCode,
  providerCodeAttrs,
  folder,
  folderAttrs,
  errors,
  handleSubmit,
  resetForm,
  activeProviderOptions,
  uploadMutation,
  maxUploadSizeBytes,
} = storageFilesInstance;

const onSubmit = handleSubmit(async values => {
  await uploadMutation.mutateAsync(values);
  closeModal();
});

const closeModal = () => {
  resetForm();
  emit('close-modal');
};
</script>
