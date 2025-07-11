<template>
  <div class="flex justify-center">
    <div class="w-auto">
      <InputNumber
        v-model="inputModel"
        input-id="currency-us"
        mode="currency"
        currency="USD"
        locale="en-US"
        fluid
        placeholder=""
        :min
        :max
      />
    </div>
  </div>
</template>
<script setup lang="ts">
const inputModel = defineModel({
  type: Number,
});
defineProps({
  min: {
    type: Number,
    default: 0,
  },
  max: {
    type: Number,
    default: null,
  },
  placeholder: {
    type: String,
    default: '',
  },
});
</script>
