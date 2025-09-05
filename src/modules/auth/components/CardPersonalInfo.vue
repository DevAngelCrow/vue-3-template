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
      />
      <AppInputText
        class="grow"
        id="middle_name"
        v-model="middleName"
        label="Segundo nombre"
      />
      <AppInputText
        class="grow"
        id="phone_number"
        v-model="phoneNumber"
        label="Teléfono*"
      />
    </div>
    <div class="flex gap-6 flex-wrap flex-row justify-between">
      <AppInputText
        class="grow w-full lg:w-auto"
        id="last_name"
        v-model="lastName"
        label="Apellidos*"
      />

      <AppSelect
        class="grow"
        id="marital_status"
        v-model="maritalStatus"
        label="Estado civil*"
      />
    </div>
    <div class="flex gap-6 justify-between flex-wrap">
      <AppSelect class="grow" id="gender" v-model="gender" label="Género*" />
      <AppSelect
        class="grow"
        id="birthdate"
        v-model="birthDate"
        label="Fecha de nacimiento*"
      />
      <AppSelect
        class="grow"
        input-id="nationalities"
        v-model="nationalities"
        label="Nacionalidades*"
      />
    </div>
    <div>
      <AppDragDropFile accept="image/*" v-model="imgFile" />
    </div>
  </section>
</template>
<script setup lang="ts">
import { useAuth } from '../composables/useAuth';
const {
  firstName,
  middleName,
  lastName,
  birthDate,
  gender,
  maritalStatus,
  phoneNumber,
  nationalities,
  imgFile,
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
