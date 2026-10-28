<template>
  <AppModal
    class="bg-surface-800 border-none h-full"
    :show="show"
    :width="width"
    :title="documentName"
    :show-footer="false"
    @close-modal="closeModal"
  >
    <template #header>
      <div class="relative text-white flex items-center justify-center w-full">
        <span class="text-center truncate px-8">{{ documentName }}</span>
        <div class="flex justify-end absolute right-0">
          <Button
            class="bg-transparent border-none text-white"
            variant="text"
            icon="pi pi-times"
            rounded
            aria-label="Cerrar visor"
            @click="closeModal"
          />
        </div>
      </div>
    </template>
    <template #default>
      <embed
        class="h-[77vh] w-full p-0 flex justify-center"
        :src="fileBlob"
      />
    </template>
  </AppModal>
</template>
<script setup lang="ts">
import { Button } from 'primevue';
import { ref, watchEffect } from 'vue';

import AppModal from './AppModal.vue';
import type { AppDocumentVisorProps } from '../interfaces';

defineOptions({ name: 'AppDocumentVisor' });

const props = withDefaults(defineProps<AppDocumentVisorProps>(), {
  documentName: '',
  file: '',
  show: false,
  validType: 'application/pdf',
  width: '99%',
});

interface ValidationMessage {
  valid_types: string;
  invalid_types: string;
  flag?: boolean;
}

const fileBlob = ref<string | undefined>();
const emit = defineEmits<{
  'close-visor': [value: boolean];
}>();

const fileTypes = [
  'application/pdf',
  'text/plain',
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp',
  'image/svg+xml',
  'image/bmp',
];

const conversion = (dataURI: string) => {
  const byteString = atob(dataURI.split(',')[1]);
  const mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
  const ab = new ArrayBuffer(byteString.length);
  const ia = new Uint8Array(ab);
  for (let i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i);
  }
  const blob = new Blob([ab], { type: mimeString });
  return blob;
};

const typesValidation = (types: string) => {
  const typesArray = types.replace(/\s/g, '').split(',');
  const valid = typesArray.filter(item => fileTypes.includes(item));
  const invalid = typesArray.filter(item => !fileTypes.includes(item));
  const message: ValidationMessage = {
    valid_types: valid.join(','),
    invalid_types: invalid.join(','),
  };
  if (invalid.length) {
    message.flag = false;
    return message;
  }
  message.flag = true;
  return message;
};

const closeModal = () => {
  emit('close-visor', false);
};

watchEffect(() => {
  const validation = typesValidation(props.validType);
  if (props.file && validation.flag) {
    const url = conversion(props.file);
    const secondValidation = typesValidation(url.type);
    if (secondValidation.flag) {
      fileBlob.value = URL.createObjectURL(url);
    }
    if (secondValidation.invalid_types.length) {
      throw `Archivos no validos: ${secondValidation.invalid_types}`;
    }
  }
});
</script>
