<template>
  <section
    id="card_informacion_personal"
    class="w-[95%] min-h-[750px] sm:w-[65%] md:w-[55%] bg-surface-200 h-[85%] rounded-xl flex flex-col align-top gap-10 px-3 py-3 sm:px-10 overflow-y-auto"
  >
    <div class="w-full mt-5 gap-5 flex flex-col">
      <AppTitle title="Registro" title-position="start" />
      <span class="text-xl">Información personal:</span>
    </div>
    <div class="flex gap-6 flex-wrap flex-row justify-between">
      <AppInputText
        class="grow"
        id="first_name"
        v-model="firstName"
        label="Nombre*"
        :error-messages="errors.firstName"
        v-bind="firstNameAttrs"
      />
      <AppInputText
        class="grow"
        id="middle_name"
        v-model="middleName"
        label="Segundo nombre"
        :error-messages="errors.middleName"
        v-bind="middleNameAttrs"
      />
      <AppInputText
        class="grow"
        id="phone_number"
        v-model="phoneNumber"
        label="Teléfono*"
        :error-messages="errors.phoneNumber"
        v-bind="phoneNumberAttrs"
      />
    </div>
    <div class="flex gap-6 flex-wrap flex-row justify-between">
      <AppInputText
        class="grow w-full lg:w-auto"
        id="last_name"
        v-model="lastName"
        :error-messages="errors.lastName"
        label="Apellidos*"
        v-bind="lastNameAttrs"
      />

      <AppSelect
        class="grow"
        id="marital_status"
        v-model="maritalStatus"
        :error-messages="errors.maritalStatus"
        label="Estado civil*"
        v-bind="maritalStatusAttrs"
      />
    </div>
    <div class="flex gap-6 justify-between flex-wrap">
      <AppSelect
        class="grow"
        id="gender"
        v-model="gender"
        label="Género*"
        :error-messages="errors.gender"
        v-bind="genderAttrs"
      />
      <AppSelect
        class="grow"
        id="birthdate"
        v-model="birthDate"
        label="Fecha de nacimiento*"
        :error-messages="errors.birthDate"
        v-bind="birthDateAttrs"
      />
      <AppSelect
        class="grow"
        input-id="nationalities"
        v-model="nationalities"
        label="Nacionalidades*"
        :error-messages="errors.nationalities"
        v-bind="nationalitiesAttrs"
      />
    </div>
    <div>
      <AppDragDropFile
        accept="image/*"
        v-model="imgFile"
        v-bind="imgFileAttrs"
      />
    </div>
  </section>
</template>
<script setup lang="ts">
import { useAuth } from '../composables/useAuth';
const {
  firstName,
  firstNameAttrs,
  middleName,
  middleNameAttrs,
  lastName,
  lastNameAttrs,
  birthDate,
  birthDateAttrs,
  gender,
  genderAttrs,
  maritalStatus,
  maritalStatusAttrs,
  phoneNumber,
  phoneNumberAttrs,
  nationalities,
  nationalitiesAttrs,
  imgFile,
  imgFileAttrs,
  errors,
} = useAuth();

defineExpose({
  firstName,
  middleName,
  lastName,
  birthDate,
  gender,
  maritalStatus,
  phoneNumber,
  nationalities,
  imgFile,
});
</script>
<style scoped></style>
