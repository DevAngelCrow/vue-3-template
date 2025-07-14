<script setup lang="ts">
import { onMounted, ref } from 'vue';

// import AppInputMask from './AppInputMask.vue';
// import AppInputText from './AppInputText.vue';
import { InputNumber } from 'primevue';

import AppInputMoney from './AppInputMoney.vue';
import AppInputNumber from './AppInputNumber.vue';
const pruebaVmodel = ref<number>(0);

onMounted(() => {});
</script>

<template>
  <!-- <div
    class="w-full h-full flex justify-center items-center align-base-line bg-[url(https://picsum.photos/1200/800)]"
  ></div> -->
  <AppInputMoney
    show-buttons
    button-layout="horizontal"
    :min="0"
    label="Dinero"
    v-model="pruebaVmodel"
  />
  <AppInputNumber />
  <InputNumber />
</template>

<style scoped>
.read-the-docs {
  color: #888;
}
</style>
