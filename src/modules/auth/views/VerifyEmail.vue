<template>
  <div class="flex justify-center items-center h-screen w-screen">
    <div class="flex justify-center items-center flex-col flex-wrap gap-40">
      <i :key="loading" :class="loading" style="font-size: 12rem"></i>
      <span class="text-5xl">{{ message }}</span>
    </div>
  </div>
</template>
<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import { storeToRefs } from 'pinia';

import { useLoaderStore } from '@/core/store';
import authServices from '@/core/services/auth.services';

const { query } = useRoute();
const useLoader = useLoaderStore();
const { isLoading } = storeToRefs(useLoader);

const stateVerified = ref<boolean | null>(null);

const verifyEmail = async () => {
  try {
    useLoader.startLoading();
    if (query.url) {
      const response = await authServices.verifyEmail(query.url);
      if (response?.status === 200) {
        stateVerified.value = true;
      } else {
        stateVerified.value = false;
      }
    }
  } catch (error: unknown) {
    console.error(error);
    stateVerified.value = false;
  } finally {
    useLoader.finishLoading();
  }
};

const loading = computed(() => {
  if (isLoading.value || stateVerified.value === null) {
    // Mientras se verifica
    return 'pi pi-envelope animate-bounce';
  } else if (stateVerified.value) {
    // Ya terminó la verificación
    return 'pi pi-verified animate-none text-green-800'; // éxito
  } else {
    return 'pi pi-times-circle animate-none text-red-500'; // fallo
  }
});

const message = computed(() => {
  if (isLoading.value || stateVerified.value === null) {
    // Mientras se verifica
    return 'Verificando correo electrónico';
  } else if (stateVerified.value) {
    // Ya terminó la verificación
    return 'Correo electrónico verificado'; // éxito
  } else {
    return 'Error en la verificación del correo electrónico'; // fallo
  }
});

onMounted(async () => {
  await verifyEmail();
});
</script>
<style scoped></style>
