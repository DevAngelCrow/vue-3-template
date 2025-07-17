<script setup lang="ts">
import { onMounted } from 'vue';

onMounted(() => {});
</script>

<template>
  <AppInputMask label="Input mask" mask="00000000-0" />
  <AppInputText label="Input text" placeholder="00000000-0" />
</template>

<style scoped>
.read-the-docs {
  color: #888;
}
</style>
