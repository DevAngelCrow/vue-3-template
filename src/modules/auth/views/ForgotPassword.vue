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
        class="relative z-10 w-[95%] xs:w-[85%] sm:w-[60%] md:w-[46%] lg:w-[38%] lg:max-w-[460px] shadow-2xl border border-surface-700/40"
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
              class="w-12 h-12 rounded-2xl bg-primary-600 flex items-center justify-center shadow-lg"
            >
              <i class="pi pi-key text-white text-xl" />
            </div>
            <div class="text-center">
              <h1 class="text-2xl font-semibold text-white tracking-tight">
                Recuperar contraseña
              </h1>
              <p class="text-sm text-surface-400 mt-1">
                Ingresa tu correo para recibir un enlace de recuperación
              </p>
            </div>
          </div>
        </template>

        <!-- Content -->
        <template #content>
          <form
            class="flex flex-col gap-5 px-8 pb-8 pt-4"
            @submit.prevent="onSubmit"
          >
            <!-- Error alert -->
            <Transition name="fade">
              <div
                v-if="authError"
                class="flex items-start gap-2 p-3 rounded-lg bg-danger-500/10 border border-danger-500/30 text-danger-400 text-sm"
              >
                <i class="pi pi-exclamation-circle mt-0.5 shrink-0" />
                <span>{{ authError }}</span>
              </div>
            </Transition>

            <!-- Success alert -->
            <Transition name="fade">
              <div
                v-if="successMessage"
                class="flex items-start gap-2 p-3 rounded-lg bg-success-500/10 border border-success-500/30 text-success-400 text-sm"
              >
                <i class="pi pi-check-circle mt-0.5 shrink-0" />
                <span>{{ successMessage }}</span>
              </div>
            </Transition>

            <!-- Inputs -->
            <div class="flex flex-col gap-4">
              <AppInputText
                placeholder="Correo electrónico"
                v-model="email"
                show-icon
                prepend-inner-icon="pi pi-envelope"
                :error-messages="errors.email"
                v-bind="emailAttrs"
                label="Correo electrónico"
                class="w-full"
                :disabled="isLoading || isSuccess"
                @update:modelValue="validationInputEmail(email, 'email')"
              />
            </div>

            <!-- Turnstile (solo cuando está configurado en env) -->
            <div v-if="hasTurnstileSiteKey" class="flex justify-center">
              <div ref="turnstileContainerRef" class="min-h-[65px]" />
            </div>

            <!-- Submit -->
            <Button
              type="submit"
              :loading="isLoading"
              :disabled="isLoading || isSuccess"
              class="w-full mt-1"
              size="large"
            >
              <template #default>
                <span class="flex items-center justify-center gap-2">
                  <i v-if="!isLoading" class="pi pi-send" />
                  {{ isLoading ? 'Enviando enlace...' : 'Enviar enlace' }}
                </span>
              </template>
            </Button>

            <!-- Back to Login link -->
            <p class="text-center text-sm text-surface-400">
              <router-link
                to="/login"
                class="text-primary-400 hover:text-primary-300 transition-colors ml-1"
              >
                Volver al inicio de sesión
              </router-link>
            </p>
          </form>
        </template>
      </Card>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { nextTick, ref, watch } from 'vue';
import { Card, Button } from 'primevue';
import { useForm } from 'vee-validate';
import * as yup from 'yup';

import AppInputText from '@/core/components/AppInputText.vue';
import { useTurnstile } from '@/core/composables/useTurnstile';
import authServices from '@/core/services/auth.services';
import { emailFormat } from '@/core/utils/validationRules';
import { sanitizedValueInput } from '@/core/utils/inputTextValidations';

const { errors, defineField, handleSubmit, setFieldValue } = useForm({
  validationSchema: yup.object({
    email: emailFormat(undefined, true, undefined),
  }),
});

const [email, emailAttrs] = defineField('email');

const validationInputEmail = (
  value: string,
  input: 'email',
  regex: RegExp = /[^a-zA-Z0-9._%+\-@]/g,
) => {
  const sanitizedValue = sanitizedValueInput(value, regex);
  nextTick(() => {
    setFieldValue(input, sanitizedValue);
  });
};

const {
  hasSiteKey: hasTurnstileSiteKey,
  token: turnstileToken,
  containerRef: turnstileContainerRef,
  reset: resetTurnstile,
} = useTurnstile({ theme: 'dark' });

const isLoading = ref(false);
const isSuccess = ref(false);
const authError = ref('');
const successMessage = ref('');

watch(turnstileToken, token => {
  if (token) {
    authError.value = '';
  }
});

const onSubmit = handleSubmit(async values => {
  authError.value = '';
  successMessage.value = '';

  if (hasTurnstileSiteKey.value && !turnstileToken.value) {
    authError.value = 'Por favor, completa la verificación de seguridad.';
    return;
  }

  isLoading.value = true;

  try {
    await authServices.generateLinkResetPassword(
      values.email,
      turnstileToken.value || undefined,
    );

    successMessage.value =
      'Se ha enviado un enlace de recuperación a tu correo electrónico.';
    isSuccess.value = true;
  } catch (error: unknown) {
    if (hasTurnstileSiteKey.value) {
      resetTurnstile();
    }
    authError.value =
      typeof error === 'object' &&
      error !== null &&
      'message' in error &&
      typeof error.message === 'string'
        ? error.message
        : 'Ocurrió un error al enviar el correo. Por favor, inténtalo de nuevo.';
  } finally {
    isLoading.value = false;
  }
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

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
