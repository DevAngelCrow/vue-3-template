<template>
  <div class="max-h-screen h-screen">
    <AppAlert />
    <router-view />
  </div>
</template>
<script setup lang="ts">
import AppAlert from './core/components/AppAlert.vue';
</script>
<style scoped></style>
