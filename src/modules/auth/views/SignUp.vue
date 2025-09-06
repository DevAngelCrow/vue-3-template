<template>
  <div class="w-full min-h-screen bg-primary flex justify-center">
    <div class="w-full bg-primary flex justify-center mt-16">
      <AppVerticalStepper
        :components="components"
        :steps="components.length"
        ref="stepperRef"
        @register="getAllFormData"
      />
    </div>
  </div>
</template>
<script setup lang="ts">
import { reactive, markRaw, ref } from 'vue';

import type { StepperVerticalInterface } from '@/core/interfaces/stepperVertical.interface';

import CardPersonalInfo from '../components/CardPersonalInfo.vue';
import CardDocumentsInfo from '../components/CardDocumentsInfo.vue';
import CardUserInfo from '../components/CardUserInfo.vue';
import CardAddressInfo from '../components/CardAddressInfo.vue';

const components = reactive<StepperVerticalInterface[]>([
  { component: markRaw(CardPersonalInfo), header: 'Información personal' },
  { component: markRaw(CardAddressInfo), header: 'Dirección' },
  { component: markRaw(CardDocumentsInfo), header: 'Documentos' },
  { component: markRaw(CardUserInfo), header: 'Información de usuario' },
]);

const stepperRef = ref();

const getAllFormData = () => {
  console.log('Datos de todos los formularios:');
  const children = stepperRef.value?.componentRefs ?? [];
  // children[0] es CardPersonalInfo, children[1] es CardAddressInfo, etc.
  const personalInfo = children[0];
  const addressInfo = children[1];
  // Accede a los datos expuestos
  console.log(personalInfo?.firstName, addressInfo?.street);
};
</script>
<style scoped></style>
