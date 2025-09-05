<template>
  <div class="relative w-full h-screen flex justify-center items-center">
    <div
      class="absolute inset-0 blur-xs bg-radial-[at_50%_75%] from-primary-600 to-zinc-900 z-10"
    ></div>
    <Card
      class="relative z-50 w-[95%] xs:w-[90%] sm:w-[60%] md:w-[50%] lg:w-[40%] lg:max-w-[500px] h-[50%] min-h-[360px]"
      :pt="{
        body: { class: 'flex flex-col flex-grow' },
        content: {
          class: 'flex flex-col flex-grow items-center justify-center gap-6',
        },
      }"
    >
      <template #title>
        <div class="flex justify-center items-center h-full !grow">
          <h1 class="text-5xl font-bold">Login</h1>
        </div>
      </template>
      <template #content>
        <form
          class="flex flex-col justify-center items-center gap-10 w-full"
          @submit.prevent="onSubMit"
        >
          <div v-if="authError" class="w-full xs:w-[90%] md:w-[70%]">
            <div
              class="p-3 bg-red-100 text-red-700 rounded border border-red-300 text-sm"
            >
              {{ authError }}
            </div>
          </div>

          <div
            class="flex gap-9 justify-center flex-col items-center w-full xs:w-[90%] md:w-[70%]"
          >
            <AppInputText
              placeholder="nombre_usuario"
              v-model="user"
              show-icon
              prepend-inner-icon="pi pi-user"
              :error-messages="errors.user"
              v-bind="userAttrs"
              label="Usuario"
              class="w-full"
              :disabled="isLoading"
            />
            <AppInputText
              placeholder="Contraseña"
              v-model="password"
              show-icon
              icon="pi pi-lock"
              :error-messages="errors.password"
              v-bind="passwordAttrs"
              prepend-inner-icon="pi pi-lock"
              autocomplete="current-password"
              type="password"
              label="Contraseña"
              class="w-full"
              :disabled="isLoading"
            />
          </div>
          <div
            class="flex flex-col justify-start w-full xs:w-[90%] md:w-[70%] gap-3"
          >
            <div class="flex justify-start gap-2">
              <Checkbox binary v-model="rememberDevice" :disabled="isLoading" />
              <label>Recordar este dispositivo</label>
            </div>
            <div class="flex justify-center">
              <Button
                type="submit"
                :loading="isLoading"
                :disabled="isLoading"
                class="w-full"
              >
                {{ isLoading ? 'Iniciando sesión...' : 'Iniciar sesión' }}
              </Button>
            </div>
            <div class="flex justify-center">
              <a
                class="underline text-sm hover:text-primary-600"
                href="/forgot-password"
              >
                ¿Olvidaste tu contraseña?
              </a>
            </div>
          </div>
        </form>
      </template>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { Card, Button, Checkbox } from 'primevue';
import { useForm } from 'vee-validate';
import * as yup from 'yup';

import AppInputText from '@/core/components/AppInputText.vue';

import { useAuth } from '../composables/useAuth';

const { errors, defineField, handleSubmit } = useForm({
  validationSchema: yup.object({
    user: yup
      .string()
      .required('El nombre de usuario es requerido')
      .min(3, 'El nombre de usuario debe tener al menos 3 caracteres'),
    password: yup
      .string()
      .required('La contraseña es requerida')
      .min(6, 'La contraseña debe tener al menos 6 caracteres'),
  }),
});

const [user, userAttrs] = defineField('user');
const [password, passwordAttrs] = defineField('password');
const rememberDevice = ref(false);

const { login, isLoading, error: authError } = useAuth();

const onSubMit = handleSubmit(async values => {
  await login(values.user, values.password);
});
</script>
