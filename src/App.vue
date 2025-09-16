<template>
  <div class="max-h-screen h-screen">
    <AppLoader v-if="showLoader" />
    <AppAlert />
    <router-view />
  </div>
</template>
<script setup lang="ts">
import { computed } from 'vue';

import AppAlert from './core/components/AppAlert.vue';
import AppLoader from './core/components/AppLoader.vue';
import { useLoaderStore } from './core/store';

const storeLoader = useLoaderStore();

const showLoader = computed(() => storeLoader.isLoading);
</script>
<style scoped></style>
