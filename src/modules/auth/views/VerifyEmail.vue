<template>
  <div
    class="relative w-full h-screen flex justify-center items-center overflow-hidden"
  >
    <!-- Background -->
    <div
      class="absolute inset-0 bg-gradient-to-br from-surface-950 via-surface-900 to-primary-950 z-0"
    />
    <div
      class="absolute inset-0 z-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_100%,rgba(var(--p-primary-500-rgb),0.15),transparent)]"
    />

    <!-- Card -->
    <Transition name="fade-up" appear>
      <Card
        class="relative z-10 w-[95%] xs:w-[85%] sm:w-[60%] md:w-[46%] lg:w-[38%] lg:max-w-[480px] shadow-2xl border border-surface-700/40"
        :pt="{
          root: { class: 'bg-surface-900/80 backdrop-blur-md' },
          body: { class: 'flex flex-col gap-0 p-0' },
          content: { class: 'p-0' },
        }"
      >
        <!-- Header -->
        <template #header>
          <div class="flex flex-col items-center pt-8 pb-2 px-8 gap-3">
            <div
              :class="[
                'w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg border',
                badgeClasses,
              ]"
            >
              <i :class="[iconClass, 'text-2xl']" />
            </div>
            <div class="text-center">
              <h1 class="text-2xl font-semibold text-white tracking-tight">
                {{ titleMessage }}
              </h1>
              <p class="text-sm text-surface-400 mt-1">
                {{ subtitleMessage }}
              </p>
            </div>
          </div>
        </template>

        <!-- Content -->
        <template #content>
          <div class="flex flex-col gap-6 px-8 pb-8 pt-4 text-center">
            <div
              class="p-4 rounded-xl bg-surface-800/60 border border-surface-700/50 flex flex-col items-center gap-2"
            >
              <p class="text-sm text-surface-300 leading-relaxed">
                {{ detailMessage }}
              </p>
            </div>

            <div class="flex flex-col gap-3 mt-2">
              <router-link to="/login">
                <Button
                  class="w-full"
                  size="large"
                  :label="stateVerified ? 'Iniciar sesión' : 'Volver al inicio de sesión'"
                  icon="pi pi-sign-in"
                  :disabled="isLoading || stateVerified === null"
                />
              </router-link>
            </div>
          </div>
        </template>
      </Card>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { Card, Button } from 'primevue';
import { storeToRefs } from 'pinia';

import { useLoaderStore } from '@/core/store';
import authServices from '@/core/services/auth.services';

const { query } = useRoute();
const router = useRouter();
const useLoader = useLoaderStore();
const { isLoading } = storeToRefs(useLoader);

const stateVerified = ref<boolean | null>(null);

const verifyEmail = async () => {
  try {
    useLoader.startLoading();
    if (query.url && query.id && query.token) {
      const response = await authServices.verifyEmail(
        query.url.toString(),
        query.id.toString(),
        query.token.toString(),
      );
      if (response?.status === 200) {
        stateVerified.value = true;
        setTimeout(() => {
          router.push({ name: 'login' });
        }, 2500);
      } else {
        stateVerified.value = false;
      }
    } else {
      stateVerified.value = false;
    }
  } catch (error: unknown) {
    console.error(error);
    stateVerified.value = false;
  } finally {
    useLoader.finishLoading();
  }
};

const isChecking = computed(
  () => isLoading.value || stateVerified.value === null,
);

const badgeClasses = computed(() => {
  if (isChecking.value) {
    return 'bg-primary-500/20 border-primary-500/30';
  } else if (stateVerified.value) {
    return 'bg-success-500/20 border-success-500/30';
  } else {
    return 'bg-danger-500/20 border-danger-500/30';
  }
});

const iconClass = computed(() => {
  if (isChecking.value) {
    return 'pi pi-spin pi-spinner text-primary-400';
  } else if (stateVerified.value) {
    return 'pi pi-check-circle text-success-400';
  } else {
    return 'pi pi-times-circle text-danger-400';
  }
});

const titleMessage = computed(() => {
  if (isChecking.value) {
    return 'Verificando correo';
  } else if (stateVerified.value) {
    return '¡Cuenta verificada!';
  } else {
    return 'Error de verificación';
  }
});

const subtitleMessage = computed(() => {
  if (isChecking.value) {
    return 'Por favor espera mientras validamos tu enlace';
  } else if (stateVerified.value) {
    return 'Tu dirección de correo ha sido validada con éxito';
  } else {
    return 'No pudimos verificar tu correo electrónico';
  }
});

const detailMessage = computed(() => {
  if (isChecking.value) {
    return 'Comprobando los parámetros de autenticación del enlace recibido.';
  } else if (stateVerified.value) {
    return 'Serás redirigido automáticamente al inicio de sesión en unos momentos.';
  } else {
    return 'El enlace puede haber expirado o los datos de verificación no son válidos.';
  }
});

onMounted(async () => {
  await verifyEmail();
});
</script>

<style scoped>
.fade-up-enter-active {
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}

.fade-up-enter-from {
  opacity: 0;
  transform: translateY(16px);
}
</style>
