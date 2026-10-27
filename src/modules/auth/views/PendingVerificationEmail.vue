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
              class="w-12 h-12 rounded-2xl bg-success-500/20 border border-success-500/30 flex items-center justify-center shadow-lg"
            >
              <i class="pi pi-check-circle text-success-400 text-2xl" />
            </div>
            <div class="text-center">
              <h1 class="text-2xl font-semibold text-white tracking-tight">
                Registro exitoso
              </h1>
              <p class="text-sm text-surface-400 mt-1">
                Verifica tu correo electrónico para continuar
              </p>
            </div>
          </div>
        </template>

        <!-- Content -->
        <template #content>
          <div class="flex flex-col gap-6 px-8 pb-8 pt-4 text-center">
            <div
              class="p-4 rounded-xl bg-surface-800/60 border border-surface-700/50 flex flex-col items-center gap-3"
            >
              <div
                class="w-10 h-10 rounded-full bg-primary-500/10 flex items-center justify-center text-primary-400"
              >
                <i class="pi pi-envelope text-xl" />
              </div>
              <p class="text-sm text-surface-300 leading-relaxed">
                Hemos enviado un enlace de confirmación a:
                <br />
                <span class="font-semibold text-white">{{
                  email || 'tu correo electrónico'
                }}</span>
              </p>
              <p class="text-xs text-surface-400">
                Por favor, revisa tu bandeja de entrada y sigue las instrucciones
                para activar tu cuenta.
              </p>
            </div>

            <div class="flex flex-col gap-3">
              <router-link to="/login">
                <Button
                  class="w-full"
                  size="large"
                  label="Ir al inicio de sesión"
                  icon="pi pi-sign-in"
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
import { onMounted, ref } from 'vue';
import { Card, Button } from 'primevue';

const email = ref<string>('');

onMounted(() => {
  email.value = history.state?.email || '';
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
