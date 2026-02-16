<template>
  <section
    id="card_informacion_personal"
    class="w-[95%] min-h-[750px] sm:w-[65%] md:w-[55%] bg-surface-200 h-[85%] rounded-xl flex flex-col align-top gap-5 px-3 py-3 sm:px-10 overflow-y-auto border border-primary-950"
  >
    <div class="w-full mt-5 gap-5 flex flex-col">
      <AppTitle title="Registro" title-position="start" />
      <span class="text-xl">Información personal:</span>
    </div>
    <div class="flex gap-6 flex-wrap flex-row justify-between">
      <AppInputText
        class="flex-1"
        id="first_name"
        v-model="firstName"
        label="Nombre*"
        :error-messages="errors.firstName"
        v-bind="firstNameAttrs"
        @update:modelValue="validationInputAlphanumeric(firstName, 'firstName')"
      />
      <AppInputText
        class="flex-1"
        id="middle_name"
        v-model="middleName"
        label="Segundo nombre"
        :error-messages="errors.middleName"
        v-bind="middleNameAttrs"
        @update:modelValue="
          validationInputAlphanumeric(middleName, 'middleName')
        "
      />
      <AppInputMask
        class="flex-1"
        id="phone_number"
        v-model="phoneNumber"
        label="Teléfono*"
        :error-messages="errors.phoneNumber"
        v-bind="phoneNumberAttrs"
        mask="9999-9999"
        placeholder="2222-2222"
      />
    </div>
    <div class="flex gap-6 flex-wrap flex-row justify-between">
      <AppInputText
        class="flex-1"
        id="last_name"
        v-model="lastName"
        :error-messages="errors.lastName"
        label="Apellidos*"
        v-bind="lastNameAttrs"
        @update:modelValue="validationInputAlphanumeric(lastName, 'lastName')"
      />
      <AppInputText
        class="flex-1"
        id="email"
        v-model="email"
        :error-messages="errors.email"
        label="Email*"
        placeholder="juan@mail.com"
        v-bind="emailAttrs"
        @update:modelValue="validationInputEmail(email, 'email')"
      />
      <AppSelect
        class="flex-1"
        id="marital_status"
        v-model="maritalStatus"
        :error-messages="errors.maritalStatus"
        label="Estado civil*"
        v-bind="maritalStatusAttrs"
        :options="maritalStatuses"
        option-label="name"
        option-value="id"
      />
    </div>
    <div class="flex gap-6 justify-between flex-wrap items-start">
      <AppSelect
        class="flex-1"
        id="gender"
        v-model="gender"
        label="Género*"
        :error-messages="errors.gender"
        v-bind="genderAttrs"
        option-label="name"
        option-value="id"
        :options="genders"
      />
      <AppDatePicker
        class="flex-1"
        id="birthdate"
        v-model="birthDate"
        label="Fecha de nacimiento*"
        :error-messages="errors.birthDate"
        v-bind="birthDateAttrs"
        placeholder="DD/MM/AAAA"
        :max-date="maxDate"
      />
      <AppAutocomplete
        class="flex-1 min-w-[170px]"
        input-id="nationalities"
        v-model="nationalities"
        label="Nacionalidades*"
        :error-messages="errors.nationalities"
        v-bind="nationalitiesAttrs"
        option-label="name"
        :suggestions="countriesFiltered"
        dropdown
        multiple
        @complete="findAutocomplete"
      />
    </div>
    <div>
      <AppDragDropFile
        accept="image/*"
        v-model="file_img"
        v-bind="file_imgAttrs"
        :error-messages="errors.file_img"
      />
    </div>
  </section>
</template>
<script setup lang="ts">
import { computed, ref, toRefs } from 'vue';
import { AutoCompleteCompleteEvent } from 'primevue';
import dayjs from 'dayjs';

import { Gender } from '@/core/services/interfaces/auth/gender.interface';
import { Country } from '@/core/services/interfaces/auth/country.interface';
import { MaritalStatus } from '@/core/services/interfaces/auth/maritalStatus.interface';

import { useAuth } from '../composables/useAuth';

interface Props {
  countries: Country[];
  genders: Gender[];
  maritalStatuses: MaritalStatus[];
}

const props = defineProps<Props>();
const { countries, genders, maritalStatuses } = toRefs(props);

const {
  email,
  emailAttrs,
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
  file_img,
  file_imgAttrs,
  errors,
  validationInputAlphanumeric,
  validationInputEmail,
} = useAuth();

const countriesFiltered = ref<Country[]>([]);

const findAutocomplete = (event: AutoCompleteCompleteEvent) => {
  let query = event?.query;
  let _filteredItems = [];

  for (let i = 0; i < countries.value.length; i++) {
    let item = countries.value[i];

    if (item?.name?.toLowerCase().indexOf(query.toLowerCase()) === 0) {
      _filteredItems.push(item);
    }
  }
  countriesFiltered.value = _filteredItems;
};

const maxDate = computed(() => {
  const date = dayjs();
  const limitDate = date.subtract(18, 'years');
  return limitDate.toDate();
});

defineExpose({
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
  file_img,
  file_imgAttrs,
  errors,
});
</script>
<style scoped></style>
