<template>
  <Dialog
    class="!min-w-[180px]"
    v-model:visible="showModal"
    modal
    :header="title"
    :style="{ width, maxWidth: 'calc(100vw - 1rem)' }"
    :draggable="false"
    :close-on-escape="false"
    :closable="false"
    :stylesShowDocument="stylesShowDocument"
    :pt="{
      content: {
        class: 'scrollbar-hide px-0.5 md:pr-[1.25rem] md:pl-[1.25rem]',
      },
    }"
    :pt-options="{ mergeProps: true }"
  >
    <template #header>
      <div
        class="w-full text-center text-primary font-bold text-xl sm:text-2xl md:text-3xl px-8"
      >
        <slot name="header">
          <h3>{{ title }}</h3>
        </slot>
      </div>
      <div class="flex justify-end absolute right-5">
        <Button
          v-if="hasCloseIcon"
          class="bg-transparent text-primary border-none"
          icon="pi pi-times"
          rounded
          aria-label="Cerrar"
          @click="closeModal"
        />
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
          v-if="hasFooterButtons"
          class="w-full flex flex-col-reverse sm:flex-row sm:justify-center gap-3 sm:gap-8"
        >
          <Button
            v-if="hasCancelButton"
            class="w-full sm:w-auto"
            outlined
            @click="closeModal"
          >
            {{ resolvedCancelLabel }}
          </Button>
          <Button
            v-if="hasConfirmButton"
            class="w-full sm:w-auto"
            @click="confirmModal"
          >
            {{ resolvedConfirmLabel }}
          </Button>
        </div>
      </slot>
    </template>
  </Dialog>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { Dialog, Button } from 'primevue';

defineOptions({ name: 'AppModal' });

const emits = defineEmits<{
  (e: 'close-modal', value: boolean): void;
  (e: 'confirm-modal'): void;
  (e: 'update:show', value: boolean): void;
}>();

const props = defineProps({
  title: {
    type: String,
    default: '',
  },
  show: {
    type: Boolean,
    default: false,
  },
  titleBtnCancel: {
    type: String,
    default: undefined,
  },
  cancelLabel: {
    type: String,
    default: undefined,
  },
  titleBtnConfirm: {
    type: String,
    default: undefined,
  },
  confirmLabel: {
    type: String,
    default: undefined,
  },
  width: {
    type: String,
    default: '50rem',
  },
  footerButtons: {
    type: Boolean,
    default: true,
  },
  showButtons: {
    type: Boolean,
    default: undefined,
  },
  showFooter: {
    type: Boolean,
    default: undefined,
  },
  showIconClose: {
    type: Boolean,
    default: false,
  },
  showCloseIcon: {
    type: Boolean,
    default: false,
  },
  stylesShowDocument: {
    type: Boolean,
    default: false,
  },
  showBtnCancelFooter: {
    type: Boolean,
    default: true,
  },
  showCancelButton: {
    type: Boolean,
    default: undefined,
  },
  showBtnConfirmFooter: {
    type: Boolean,
    default: true,
  },
  showConfirmButton: {
    type: Boolean,
    default: undefined,
  },
});

const showModal = computed({
  get: () => props.show,
  set: value => emits('update:show', value),
});

const resolvedCancelLabel = computed(
  () => props.titleBtnCancel ?? props.cancelLabel ?? 'Cancelar',
);

const resolvedConfirmLabel = computed(
  () => props.titleBtnConfirm ?? props.confirmLabel ?? 'Confirmar',
);

const hasFooterButtons = computed(() => {
  if (props.showButtons !== undefined) return props.showButtons;
  if (props.showFooter !== undefined) return props.showFooter;
  return props.footerButtons;
});

const hasCloseIcon = computed(() => props.showIconClose || props.showCloseIcon);

const hasCancelButton = computed(() => {
  if (props.showCancelButton !== undefined) return props.showCancelButton;
  return props.showBtnCancelFooter;
});

const hasConfirmButton = computed(() => {
  if (props.showConfirmButton !== undefined) return props.showConfirmButton;
  return props.showBtnConfirmFooter;
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
