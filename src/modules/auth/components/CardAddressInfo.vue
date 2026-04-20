<template>
  <section
    id="card_direccion_personal"
    class="w-[95%] min-h-[400px] sm:w-[65%] md:w-[55%] lg:w-[55%] bg-surface-200 h-[65%] md:h-[65%] lg:h-[45%] rounded-xl flex flex-col align-top gap-5 px-3 py-3 sm:px-10 overflow-y-auto border border-primary-950"
  >
    <div class="w-full mt-5 gap-5 flex flex-col">
      <span class="text-xl">Información dirección:</span>
    </div>
    <div class="flex gap-6 flex-wrap flex-row justify-between">
      <AppInputText
        v-model="street"
        class="flex-1"
        label="Calle*"
        id="street"
        v-bind="streetAttrs"
        :error-messages="errors.street"
        @update:modelValue="validationInputAlphanumeric(street, 'street')"
      />
      <AppAutocomplete
        v-model="geographicDivisions"
        class="flex-1"
        label="División Geográfica*"
        id="geographic_divisions"
        v-bind="geographicDivisionsAttrs"
        :error-messages="errors.geographic_divisions"
        option-label="name"
        :suggestions="geographicDivisionsFiltered"
        dropdown
        @complete="findAutocomplete"
      />
    </div>
    <div class="flex gap-6 flex-wrap flex-row justify-between">
      <AppInputText
        v-model="streetNumber"
        class="flex-1"
        label="No. de calle*"
        id="street_number"
        v-bind="streetNumberAttrs"
        :error-messages="errors.streetNumber"
        @update:modelValue="
          validationInputAlphanumeric(streetNumber, 'streetNumber')
        "
      />
      <AppInputText
        v-model="houseNumber"
        class="flex-1"
        label="No. de casa*"
        id="house_number"
        v-bind="houseNumberAttrs"
        :error-messages="errors.houseNumber"
        @update:modelValue="
          validationInputAlphanumeric(houseNumber, 'houseNumber')
        "
      />
    </div>
    <div class="flex gap-6 flex-wrap flex-row justify-between">
      <AppInputText
        v-model="neighborhood"
        class="flex-1"
        label="Colonia/Reparto*"
        id="neighborhood"
        v-bind="neighborhoodAttrs"
        :error-messages="errors.neighborhood"
        @update:modelValue="
          validationInputAlphanumeric(neighborhood, 'neighborhood')
        "
      />
      <AppInputText
        v-model="block"
        class="flex-1"
        label="Block*"
        id="block"
        v-bind="blockAttrs"
        :error-messages="errors.block"
        @update:modelValue="
          validationInputAlphanumeric(streetNumber, 'streetNumber')
        "
      />
    </div>
    <div class="flex gap-6 flex-wrap flex-row justify-between">
      <AppInputText
        v-model="pathway"
        class="flex-1"
        label="Pasaje"
        id="pathway"
        v-bind="pathwayAttrs"
        :error-messages="errors.pathway"
        @update:modelValue="validationInputAlphanumeric(pathway, 'pathway')"
      />
      <div class="flex items-center gap-2 flex-1">
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
  </section>
</template>
<script setup lang="ts">
import { AutoCompleteCompleteEvent, Checkbox } from 'primevue';
import { ref, toRefs } from 'vue';

import { GeographicDivisionResponse } from '@/modules/catalogs/interfaces/geographic-division/geographic-division.response.interface';

import { useAuth } from '../composables/useAuth';

interface Props {
  geographicDivisions: GeographicDivisionResponse[];
}

const props = defineProps<Props>();
const { geographicDivisions: geographicDivisionsProp } = toRefs(props);

const {
  street,
  streetAttrs,
  streetNumber,
  streetNumberAttrs,
  neighborhood,
  neighborhoodAttrs,
  geographicDivisions,
  geographicDivisionsAttrs,
  houseNumber,
  houseNumberAttrs,
  block,
  blockAttrs,
  pathway,
  pathwayAttrs,
  current,
  currentAttrs,
  errors,
  validationInputAlphanumeric,
} = useAuth();

const geographicDivisionsFiltered = ref<GeographicDivisionResponse[]>([]);

const findAutocomplete = (event: AutoCompleteCompleteEvent) => {
  const query = event?.query;
  const filtered: GeographicDivisionResponse[] = [];
  for (const item of geographicDivisionsProp.value) {
    if (item?.name?.toLowerCase().indexOf(query.toLowerCase()) === 0) {
      filtered.push(item);
    }
  }
  geographicDivisionsFiltered.value = filtered;
};

defineExpose({
  street,
  streetAttrs,
  streetNumber,
  streetNumberAttrs,
  neighborhood,
  neighborhoodAttrs,
  geographicDivisions,
  geographicDivisionsAttrs,
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
