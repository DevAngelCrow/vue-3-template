<template>
  <AppModal
    :title="props.modalState.title"
    :show="props.modalState.show"
    cancel-label="Cerrar"
    :confirm-label="''"
    show-footer
    show-close-icon
    width="45rem"
    @close-modal="closeModal"
    :show-confirm-button="false"
  >
    <section
      id="body_modal"
      class="flex justify-center items-center flex-wrap flex-row gap-5 py-1.5 w-full"
    >
      <AppInputText
        class="w-full min-w-0"
        id="name"
        label="Nombre"
        :model-value="props.modalState.selectedItem?.name"
        readonly
      />
    </section>
  </AppModal>
</template>
<script setup lang="ts">
import AppModal from '@/core/components/AppModal.vue';

import { GenderResponse } from '../../interfaces/gender/gender.response.interface';

const props = defineProps<{
  modalState: {
    show: boolean;
    title: string;
    selectedItem: GenderResponse | null;
  };
}>();

const emit = defineEmits(['close-modal']);

const closeModal = () => {
  emit('close-modal');
};
</script>
