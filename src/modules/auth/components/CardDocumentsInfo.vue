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
        class="flex-1"
        id="document_type"
        label="Tipo de documento*"
        v-model="documentType"
        v-bind="documentTypeAttrs"
        :error-messages="errors.documentType"
        :options="documentTypesItems"
        option-label="name"
      />
      <AppInputMask
        class="flex-1"
        id="document"
        label="Número de documento*"
        v-model="documentNumber"
        v-bind="documentNumberAttrs"
        :error-messages="errors.documentNumber"
        :mask="documentType?.mask"
        :placeholder="documentType?.mask"
      />
    </div>
  </section>
</template>
<script setup lang="ts">
import { onMounted, ref } from 'vue';

import authServices from '@/core/services/auth.services';
import { DocumentType } from '@/core/services/interfaces/auth/documentType.interface';
import { useLoaderStore } from '@/core/store';

import { useAuth } from '../composables/useAuth';

const {
  documentType,
  documentTypeAttrs,
  documentNumber,
  documentNumberAttrs,
  errors,
} = useAuth();

const { startLoading, finishLoading } = useLoaderStore();

const documentTypesItems = ref<DocumentType[]>([]);

const getDocumentTypes = async () => {
  try {
    startLoading();
    const response = await authServices.getDocumentTypes();
    if (response.statusCode === 200) {
      documentTypesItems.value = response.data.items;
    }
  } catch (error: unknown) {
    console.error(error);
  } finally {
    finishLoading();
  }
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
