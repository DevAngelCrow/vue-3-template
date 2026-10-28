<template>
  <Dialog
    class="!min-w-[180px]"
    v-model:visible="showModal"
    modal
    :header="title"
    :style="{ width }"
    :draggable="false"
    :close-on-escape="false"
    :closable="false"
    :pt="{
      header: {
        class: 'relative',
      },
      content: {
        class: 'scrollbar-hide px-0.5 md:pr-[1.25rem] md:pl-[1.25rem]',
      },
    }"
    :pt-options="{ mergeProps: true }"
  >
    <template #header>
      <div class="relative flex items-center justify-center w-full">
        <div
          class="w-full text-center text-primary font-bold text-2xl md:text-3xl px-8"
        >
          <slot name="header">
            <h3>{{ title }}</h3>
          </slot>
        </div>
        <div v-if="showCloseIcon" class="flex justify-end absolute right-0">
          <Button
            class="bg-transparent text-primary border-none"
            variant="text"
            icon="pi pi-times"
            rounded
            aria-label="Cerrar"
            @click="closeModal"
          />
        </div>
      </div>
    </template>
    <template #default>
      <div class="flex justify-center w-full h-full overflow-hidden">
        <slot name="default"></slot>
      </div>
    </template>
    <template #footer>
      <slot name="footer">
        <div
          v-if="showFooter"
          class="w-full flex justify-center items-center gap-8"
        >
          <Button
            v-if="showCancelButton"
            variant="outlined"
            @click="closeModal"
          >
            {{ cancelLabel }}
          </Button>
          <Button v-if="showConfirmButton" @click="confirmModal">
            {{ confirmLabel }}
          </Button>
        </div>
      </slot>
    </template>
  </Dialog>
</template>
<script setup lang="ts">
import { Dialog, Button } from 'primevue';
import { computed } from 'vue';

import type { AppModalProps } from '../interfaces';

defineOptions({ name: 'AppModal' });

const emits = defineEmits<{
  'close-modal': [value: boolean];
  'confirm-modal': [];
  'update:show': [value: boolean];
}>();

const props = withDefaults(defineProps<AppModalProps>(), {
  title: '',
  show: false,
  cancelLabel: 'Cancelar',
  confirmLabel: 'Confirmar',
  width: '50rem',
  showFooter: true,
  showCloseIcon: false,
  showCancelButton: true,
  showConfirmButton: true,
});

const showModal = computed({
  get: () => props.show,
  set: value => emits('update:show', value),
});

const closeModal = () => {
  emits('close-modal', false);
};

const confirmModal = () => {
  emits('confirm-modal');
};
</script>
<style scoped>
.scrollbar-hide::-webkit-scrollbar {
  display: none !important;
}
</style>
