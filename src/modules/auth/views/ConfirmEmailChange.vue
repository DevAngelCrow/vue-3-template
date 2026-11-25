<template>
  <div
    class="relative w-full h-screen flex justify-center items-center overflow-hidden"
  >
    <div
      class="absolute inset-0 bg-gradient-to-br from-surface-950 via-surface-900 to-primary-950 z-0"
    />
    <div
      class="absolute inset-0 z-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_100%,rgba(var(--p-primary-500-rgb),0.15),transparent)]"
    />

    <Transition name="fade-up" appear>
      <Card
        class="relative z-10 w-[95%] xs:w-[85%] sm:w-[60%] md:w-[46%] lg:w-[38%] lg:max-w-[480px] shadow-2xl border border-surface-700/40"
        :pt="{
          root: { class: 'bg-surface-900/80 backdrop-blur-md' },
          body: { class: 'flex flex-col gap-0 p-0' },
          content: { class: 'p-0' },
        }"
      >
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
                  :label="
                    stateConfirmed
                      ? 'Iniciar sesión con nuevo correo'
                      : 'Volver al inicio de sesión'
                  "
                  icon="pi pi-sign-in"
                  :disabled="isChecking"
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
import { useQueryClient } from '@tanstack/vue-query';
import { Card, Button } from 'primevue';

import authServices from '@/core/services/auth.services';
import { useAuthStore } from '@/core/store/useAuthStore';

const { query } = useRoute();
const router = useRouter();
const queryClient = useQueryClient();
const authStore = useAuthStore();

const stateConfirmed = ref<boolean | null>(null);
const errorDetail = ref<string | null>(null);

const confirmChange = async () => {
  const id = typeof query.id === 'string' ? query.id : '';
  const token = typeof query.token === 'string' ? query.token : '';

  if (!id || !token) {
    stateConfirmed.value = false;
    errorDetail.value =
      'Faltan parámetros de verificación en el enlace proporcionado.';
    return;
  }

  try {
    const response = await authServices.confirmEmailChange(id, token);
    if (response?.statusCode === 200) {
      authStore.closeSession();
      queryClient.clear();
      stateConfirmed.value = true;
      setTimeout(() => {
        void router.replace({ name: 'login' });
      }, 2500);
    } else {
      stateConfirmed.value = false;
    }
  } catch (err: unknown) {
    stateConfirmed.value = false;
    if (
      typeof err === 'object' &&
      err !== null &&
      'message' in err &&
      typeof err.message === 'string'
    ) {
      errorDetail.value = err.message;
    }
  }
};

const isChecking = computed(() => stateConfirmed.value === null);

const badgeClasses = computed(() => {
  if (isChecking.value) {
    return 'bg-primary-500/20 border-primary-500/30';
  }
  return stateConfirmed.value
    ? 'bg-success-500/20 border-success-500/30'
    : 'bg-danger-500/20 border-danger-500/30';
});

const iconClass = computed(() => {
  if (isChecking.value) {
    return 'pi pi-spin pi-spinner text-primary-400';
  }
  return stateConfirmed.value
    ? 'pi pi-check-circle text-success-400'
    : 'pi pi-times-circle text-danger-400';
});

const titleMessage = computed(() => {
  if (isChecking.value) return 'Confirmando cambio de correo';
  return stateConfirmed.value
    ? '¡Correo actualizado!'
    : 'No se pudo actualizar el correo';
});

const subtitleMessage = computed(() => {
  if (isChecking.value) {
    return 'Por favor espera mientras validamos tu enlace';
  }
  return stateConfirmed.value
    ? 'Tu dirección de correo electrónico ha sido cambiada'
    : 'El enlace es inválido o ha expirado';
});

const detailMessage = computed(() => {
  if (isChecking.value) {
    return 'Comprobando la solicitud de cambio de correo y actualizando tus credenciales.';
  }
  if (stateConfirmed.value) {
    return 'Por seguridad cerramos tus sesiones activas. Inicia sesión nuevamente con tu cuenta.';
  }
  return (
    errorDetail.value ||
    'El enlace puede haber expirado (15 min) o ya fue utilizado.'
  );
});

onMounted(() => {
  void confirmChange();
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
