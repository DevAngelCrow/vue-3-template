<script setup lang="ts">
import { onMounted, ref } from 'vue';
const model = ref();
onMounted(() => {});
</script>

<template>
  <AppInputNumber
    id="basic"
    v-model="model"
    label="Input number"
    placeholder="0.00"
  />
</template>

<style scoped>
.read-the-docs {
  color: #888;
}
</style>
