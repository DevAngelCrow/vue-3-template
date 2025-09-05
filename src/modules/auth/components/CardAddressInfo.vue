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
        />
        <AppInputText
          v-model="streetNumber"
          class="grow"
          label="No. de calle*"
          id="street_number"
        />
        <AppInputText
          v-model="neighborhood"
          class="grow"
          label="Colonia/Reparto*"
          id="neighborhood"
        />
        <AppInputText
          v-model="pathway"
          class="grow"
          label="Pasaje"
          id="pathway"
        />
      </div>
      <div class="flex gap-6 flex-wrap flex-col justify-between grow">
        <AppSelect
          v-model="district"
          class="grow"
          label="Distrito*"
          id="district"
        />
        <AppInputText
          v-model="houseNumber"
          class="grow"
          label="No. de casa*"
          id="house_number"
        />
        <AppInputText v-model="block" class="grow" label="Block*" id="block" />
        <div class="flex items-center gap-2">
          <Checkbox
            v-model="current"
            id="current"
            binary
            name="Actual"
            value="Actual"
            input-id="actual"
          />
          <label for="actual">Actual</label>
        </div>
      </div>
    </div>
  </section>
</template>
<script setup lang="ts">
import { Checkbox } from 'primevue';

import { useAuth } from '../composables/useAuth';

const {
  street,
  streetNumber,
  neighborhood,
  district,
  houseNumber,
  block,
  pathway,
  current,
} = useAuth();

defineExpose({
  street,
  streetNumber,
  neighborhood,
  district,
  houseNumber,
  block,
  pathway,
  current,
});
</script>
<style scoped></style>
