<template>
  <div class="w-full min-h-screen bg-primary flex justify-center">
    <div class="w-full bg-primary flex justify-center mt-16">
      <AppVerticalStepper
        :components="components"
        :steps="components.length"
        ref="stepperRef"
        @register="getAllFormData"
        @next="next"
        @back="back"
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
//import { useAuth } from '../composables/useAuth';

const components = reactive<StepperVerticalInterface[]>([
  {
    component: markRaw(CardPersonalInfo),
    header: 'Información personal',
    ref: 'info_personal_ref',
  },
  {
    component: markRaw(CardAddressInfo),
    header: 'Dirección',
    ref: 'info_direccion_ref',
  },
  {
    component: markRaw(CardDocumentsInfo),
    header: 'Documentos',
    ref: 'info_documentos_ref',
  },
  {
    component: markRaw(CardUserInfo),
    header: 'Información de usuario',
    ref: 'info_user_ref',
  },
]);

// const personalInfoFieldNames = [
//   'firstName', 'middleName', 'lastName', 'birthDate', 'gender',
//   'maritalStatus', 'phoneNumber', 'status', 'nationalities', 'imgFile'
// ];

// const addressInfoFieldNames = [
//   'street', 'streetNumber', 'neighborhood', 'district', 'houseNumber',
//   'block', 'pathway', 'current'
// ];

// const documentInfoFieldNames = ['documentType', 'documentNumber'];

// const userInfoFieldNames = ['email', 'password'];

//const { handleSubmit } = useAuth();
const stepperRef = ref();

const getAllFormData = () => {
  console.log(stepperRef.value.componentRefs[3].email, 'refs');
};

const next = (callback: Function, step: number) => {
  if (step === 1 && components.length > 0) {
    //callback(2)
    return;
  }
  //callback(step + 1);
  return;
};
const back = (callback: Function, step: number) => {
  callback(step - 1);
};

// const onSubmitStepPersonalInfo = handleSubmit(async values => {
//   console.log("Siguiente", values);

//   const nextStepCallback = (step: number) => {
//     step
//   };
//   nextStepCallback(2);
// }
// );
</script>
<style scoped></style>
