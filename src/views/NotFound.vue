<template>
  <div
    class="w-full min-h-[calc(100vh-140px)] flex items-center justify-center p-4 sm:p-6 lg:p-8"
  >
    <div
      class="w-full max-w-lg mx-auto bg-white/80 dark:bg-surface-900/80 backdrop-blur-xl border border-surface-200/80 dark:border-surface-800/80 rounded-2xl shadow-xl shadow-surface-200/50 dark:shadow-black/40 p-8 sm:p-10 text-center relative overflow-hidden transition-all duration-300"
    >
      <!-- Glow ambiental sutil -->
      <div
        class="absolute -top-24 -left-24 w-48 h-48 bg-primary-500/15 rounded-full blur-3xl pointer-events-none"
      />
      <div
        class="absolute -bottom-24 -right-24 w-48 h-48 bg-primary-400/15 rounded-full blur-3xl pointer-events-none"
      />

      <!-- Ilustración / Badge numérico -->
      <div class="relative mb-6 flex flex-col items-center justify-center">
        <div
          class="w-20 h-20 rounded-2xl bg-gradient-to-tr from-primary-100 to-primary-50 dark:from-primary-950/50 dark:to-primary-900/40 border border-primary-200 dark:border-primary-800/50 flex items-center justify-center shadow-inner mb-4"
        >
          <i
            class="pi pi-compass text-3xl text-primary-600 dark:text-primary-400 animate-pulse"
          />
        </div>
        <span
          class="text-6xl sm:text-7xl font-extrabold tracking-tight bg-gradient-to-r from-primary-600 via-primary-500 to-surface-700 dark:from-primary-400 dark:via-primary-300 dark:to-surface-300 bg-clip-text text-transparent select-none"
        >
          404
        </span>
      </div>

      <!-- Título y Descripción -->
      <h1
        class="text-2xl sm:text-3xl font-bold text-surface-800 dark:text-surface-100 tracking-tight mb-3"
      >
        Página no encontrada
      </h1>
      <p
        class="text-sm sm:text-base text-surface-600 dark:text-surface-400 leading-relaxed mb-8 max-w-md mx-auto"
      >
        El recurso al que intentas acceder no existe, ha cambiado de ubicación o
        no cuentas con los permisos necesarios para visualizarlo.
      </p>

      <!-- Botones de Acción -->
      <div
        class="flex flex-col sm:flex-row items-center justify-center gap-3 w-full"
      >
        <Button
          type="button"
          :icon="primaryActionIcon"
          :label="primaryActionLabel"
          class="w-full sm:w-auto px-6 py-2.5 !bg-primary-600 hover:!bg-primary-700 !border-primary-600 !text-white !font-medium !rounded-xl shadow-md shadow-primary-600/20 transition-all duration-200"
          @click="handlePrimaryAction"
        />

        <Button
          type="button"
          icon="pi pi-arrow-left"
          label="Regresar"
          variant="outlined"
          class="w-full sm:w-auto px-6 py-2.5 !border-surface-300 dark:!border-surface-700 !text-surface-700 dark:!text-surface-300 hover:!bg-surface-100 dark:hover:!bg-surface-800 !font-medium !rounded-xl transition-all duration-200"
          @click="handleGoBack"
        />
      </div>

      <!-- Pie de tarjeta con sugerencia de soporte -->
      <div
        class="mt-8 pt-6 border-t border-surface-100 dark:border-surface-800/80 flex items-center justify-center gap-2 text-xs text-surface-400 dark:text-surface-500"
      >
        <i class="pi pi-info-circle text-xs" />
        <span>Si crees que esto es un error, contacta al administrador del sistema.</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import Button from 'primevue/button';

import { useAuthStore } from '@/core/store/useAuthStore';

defineOptions({ name: 'NotFoundView' });

const router = useRouter();
const authStore = useAuthStore();

const isAuthenticated = computed<boolean>(() => {
  return authStore.validSession();
});

const primaryActionLabel = computed<string>(() => {
  return isAuthenticated.value ? 'Ir al Dashboard' : 'Iniciar Sesión';
});

const primaryActionIcon = computed<string>(() => {
  return isAuthenticated.value ? 'pi pi-home' : 'pi pi-sign-in';
});

const handlePrimaryAction = () => {
  if (isAuthenticated.value) {
    router.push('/dashboard');
  } else {
    router.push('/login');
  }
};

const handleGoBack = () => {
  if (window.history.length > 1) {
    router.back();
  } else {
    handlePrimaryAction();
  }
};
</script>
