<template>
  <section
    id="card_direccion_personal"
    class="w-[95%] min-h-[400px] sm:w-[65%] md:w-[55%] lg:w-[55%] bg-surface-200 h-[65%] md:h-[65%] lg:h-[45%] rounded-xl flex flex-col align-top gap-10 lg:gap-12 px-3 py-3 sm:px-10 overflow-y-auto"
  >
    <div class="w-full mt-5 gap-5 flex flex-col">
      <span class="text-xl">Información dirección:</span>
    </div>
    <div class="flex gap-6 w-full flex-col sm:flex-col md:flex-row lg:flex-row">
      <div class="flex gap-6 flex-wrap flex-col justify-between grow">
        <AppInputText
          v-model="street"
          class="grow"
          label="Calle*"
          id="street"
          v-bind="streetAttrs"
          :error-messages="errors.street"
        />
        <AppInputText
          v-model="streetNumber"
          class="grow"
          label="No. de calle*"
          id="street_number"
          v-bind="streetNumberAttrs"
          :error-messages="errors.streetNumber"
        />
        <AppInputText
          v-model="neighborhood"
          class="grow"
          label="Colonia/Reparto*"
          id="neighborhood"
          v-bind="neighborhoodAttrs"
          :error-messages="errors.neighborhood"
        />
        <AppInputText
          v-model="pathway"
          class="grow"
          label="Pasaje"
          id="pathway"
          v-bind="pathwayAttrs"
          :error-messages="errors.pathway"
        />
      </div>
      <div class="flex gap-6 flex-wrap flex-col justify-between grow">
        <AppAutocomplete
          v-model="district"
          class="flex-1"
          label="Distrito*"
          id="district"
          v-bind="districtAttrs"
          :error-messages="errors.district"
          option-label="name"
          :suggestions="districtsFiltered"
          dropdown
          @complete="findAutocomplete"
        />
        <AppInputText
          v-model="houseNumber"
          class="flex-1"
          label="No. de casa*"
          id="house_number"
          v-bind="houseNumberAttrs"
          :error-messages="errors.houseNumber"
        />
        <AppInputText
          v-model="block"
          class="flex-1"
          label="Block*"
          id="block"
          v-bind="blockAttrs"
          :error-messages="errors.block"
        />
        <div class="flex items-center gap-2">
          <Checkbox
            v-model="current"
            id="current"
            binary
            name="Actual"
            value="Actual"
            input-id="actual"
            v-bind="currentAttrs"
            :error-messages="errors.current"
          />
          <label for="actual">Actual</label>
        </div>
      </div>
    </div>
  </section>
</template>
<script setup lang="ts">
import { AutoCompleteCompleteEvent, Checkbox } from 'primevue';
import { onMounted, ref } from 'vue';

import authServices from '@/core/services/auth.services';
import { District } from '@/core/services/interfaces/auth/district.interface';
import { useLoaderStore } from '@/core/store';

import { useAuth } from '../composables/useAuth';

const {
  street,
  streetAttrs,
  streetNumber,
  streetNumberAttrs,
  neighborhood,
  neighborhoodAttrs,
  district,
  districtAttrs,
  houseNumber,
  houseNumberAttrs,
  block,
  blockAttrs,
  pathway,
  pathwayAttrs,
  current,
  currentAttrs,
  errors,
} = useAuth();

const { startLoading, finishLoading } = useLoaderStore();

const districtItems = ref<District[]>([]);
const districtsFiltered = ref<District[]>([]);

const getDistricts = async () => {
  try {
    startLoading();
    const response = await authServices.getDistricts();
    if (response.statusCode === 200) {
      districtItems.value = response.data.items;
    }
  } catch (error: unknown) {
    console.error(error);
  } finally {
    finishLoading();
  }
};

const findAutocomplete = (event: AutoCompleteCompleteEvent) => {
  let query = event?.query;
  let _filteredItems = [];

  for (let i = 0; i < districtItems.value.length; i++) {
    let item = districtItems.value[i];

    if (item?.name?.toLowerCase().indexOf(query.toLowerCase()) === 0) {
      _filteredItems.push(item);
    }
  }

  districtsFiltered.value = _filteredItems;
};

onMounted(async () => {
  await getDistricts();
});

defineExpose({
  street,
  streetAttrs,
  streetNumber,
  streetNumberAttrs,
  neighborhood,
  neighborhoodAttrs,
  district,
  districtAttrs,
  houseNumber,
  houseNumberAttrs,
  block,
  blockAttrs,
  pathway,
  pathwayAttrs,
  current,
  currentAttrs,
  errors,
});
</script>
<style scoped></style>
