<template>
  <div class="w-full min-h-screen bg-primary flex justify-center">
    <div class="w-full bg-primary flex justify-center mt-16">
      <AppVerticalStepper
        :components="components"
        :steps="components.length"
        ref="stepperRef"
        @register="onSubmitStepPersonalInfo"
        @next="next"
        @back="back"
      />
    </div>
  </div>
</template>
<script setup lang="ts">
import { reactive, markRaw, ref } from 'vue';

import type { StepperVerticalInterface } from '@/core/interfaces/stepperVertical.interface';
import { getToday } from '@/core/utils/dates';
import authServices from '@/core/services/auth.services';
import { useLoaderStore } from '@/core/store';

import CardPersonalInfo from '../components/CardPersonalInfo.vue';
import CardDocumentsInfo from '../components/CardDocumentsInfo.vue';
import CardUserInfo from '../components/CardUserInfo.vue';
import CardAddressInfo from '../components/CardAddressInfo.vue';
import { useAuth } from '../composables/useAuth';

interface Nationality {
  id: number;
  name: string;
}

const { startLoading, finishLoading } = useLoaderStore();

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

const personalInfoFieldNames = [
  'firstName',
  'middleName',
  'lastName',
  'birthDate',
  'gender',
  'maritalStatus',
  'phoneNumber',
  'status',
  'nationalities',
  'imgFile',
  'email',
];

const addressInfoFieldNames = [
  'street',
  'streetNumber',
  'neighborhood',
  'district',
  'houseNumber',
  'block',
  'pathway',
  'current',
];

const documentInfoFieldNames = ['documentType', 'documentNumber'];

const userInfoFieldNames = ['userName', 'password'];

const { validateField, handleSubmit } = useAuth();
const stepperRef = ref();

const next = async (callback: Function, step: number) => {
  let fieldsToValidate: string[] = [];
  if (step === 1) {
    fieldsToValidate = personalInfoFieldNames;
  } else if (step === 2) {
    fieldsToValidate = addressInfoFieldNames;
  } else if (step === 3) {
    fieldsToValidate = documentInfoFieldNames;
  } else if (step === 4) {
    fieldsToValidate = userInfoFieldNames;
  }

  if (fieldsToValidate.length > 0) {
    const validationResults = await Promise.all(
      fieldsToValidate.map(field => validateField(field)),
    );
    const allValid = validationResults.every(result => result.valid);

    if (allValid) {
      callback(step + 1);
    }
  } else {
    callback(step + 1);
  }
};
const back = (callback: Function, step: number) => {
  callback(step - 1);
};

const onSubmitStepPersonalInfo = handleSubmit(async values => {
  try {
    startLoading();
    let form = new FormData();

    form.append('first_name', values.firstName);
    form.append('middle_name', values.middleName);
    form.append('last_name', values.lastName);
    form.append('birthdate', values.birthDate);
    form.append('id_gender', values.gender);
    form.append('email', values.email);
    form.append('id_marital_status', values.maritalStatus);
    form.append('fileImg', values.imgFile[0]);
    form.append('phone', values.phoneNumber);
    values.nationalities.map((_item: Nationality) => {
      form.append('nationalities[]', _item.id.toString());
    });
    form.append('user_name', values.userName);
    form.append('password', values.password);
    form.append('last_access', getToday());
    form.append('is_validated', '0');
    form.append('street', values.street);
    form.append('street_number', values.streetNumber);
    form.append('neighborhood', values.neighborhood);
    form.append('id_district', values.district.id);
    form.append('house_number', values.houseNumber);
    form.append('block', values.block);
    form.append('pathway', values.pathway);
    form.append('current', values.current ? '1' : '0');
    form.append('id_type_document', values.documentType);
    form.append('document_number', values.documentNumber);
    form.append('active', '1');
    form.append('description', '_');
    await authServices.signUp(form);
  } catch (error: unknown) {
    console.error(error);
  } finally {
    finishLoading();
  }
});
</script>
<style scoped></style>
