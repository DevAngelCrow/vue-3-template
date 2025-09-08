<template>
  <section
    id="card_documentos_personales"
    class="card_height min-h-[200px] w-[95%] sm:w-[65%] md:w-[55%] lg:w-[55%] bg-surface-200 h-[25%] sm:h-[35%] md:h-[30%] rounded-xl flex flex-col align-top gap-10 lg:gap-12 px-3 py-3 sm:px-10 overflow-y-auto"
  >
    <div class="w-full mt-5 gap-5 flex flex-col">
      <span class="text-xl">Documentos:</span>
    </div>
    <div class="flex gap-6 flex-wrap flex-row justify-between">
      <AppSelect
        class="grow min-w-[200px]"
        id="document_type"
        label="Tipo de documento*"
        v-model="documentType"
        v-bind="documentTypeAttrs"
        :error-messages="errors.documentType"
        :options="documentTypesItems"
        option-value="id"
        option-label="name"
      />
      <AppInputText
        class="grow"
        id="document"
        label="Número de documento*"
        v-model="documentNumber"
        v-bind="documentNumberAttrs"
        :error-messages="errors.documentNumber"
      />
    </div>
  </section>
</template>
<script setup lang="ts">
import { onMounted, ref } from 'vue';

import authServices from '@/core/services/auth.services';
import { DocumentType } from '@/core/services/interfaces/auth/documentType.interface';

import { useAuth } from '../composables/useAuth';

const {
  documentType,
  documentTypeAttrs,
  documentNumber,
  documentNumberAttrs,
  errors,
} = useAuth();

const documentTypesItems = ref<DocumentType[]>([]);

const getDocumentTypes = async () => {
  const response = await authServices.getDocumentTypes();

  documentTypesItems.value = response.data.items;
};

onMounted(async () => {
  await getDocumentTypes();
});

defineExpose({
  documentType,
  documentTypeAttrs,
  documentNumber,
  documentNumberAttrs,
  errors,
});
</script>
<style scoped>
@media (max-width: 471px) {
  .card_height {
    @apply h-[35%];
  }
}
</style>
