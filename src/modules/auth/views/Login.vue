<template>
  <div class="relative w-full h-screen flex justify-center items-center">
    <div
      class="absolute inset-0 blur-xs bg-radial-[at_50%_75%] from-primary-600 to-zinc-900 z-10"
    ></div>
    <Card
      class="relative z-50 w-full xs:w-[90%] sm:w-[60%] md:w-[50%] lg:w-[40%] lg:max-w-[456px] h-[50%]"
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
          novalidate
        >
          <div
            class="flex gap-9 justify-center flex-col items-center w-full xs:w-[90%] md:w-[70%]"
          >
            <AppInputText
              placeholder="Usuario"
              v-model="user"
              show-icon
              icon="pi pi-user"
              :error-messages="errors.user"
              v-bind="userAttrs"
            />
            <AppInputText
              placeholder="Contrasena"
              v-model="password"
              show-icon
              icon="pi pi-lock"
              :error-messages="errors.password"
              v-bind="passwordAttrs"
              append-icon="pi pi-eye"
            />
            <!-- <IconField class="w-full">
              <InputIcon class="pi pi-lock" />
              <InputText
                class="w-full"
                name="password"
                type="text"
                placeholder="Contraseña"
                v-model="password"
                v-bind="passwordAttrs"
                :aria-errormessage="errors.password"
              />
              <InputIcon class="pi pi-eye" />
            </IconField> -->
          </div>
          <div
            class="flex flex-col justify-start w-full xs:w-[90%] md:w-[70%] gap-3"
          >
            <div class="flex justify-star gap-2">
              <Checkbox binary />
              <label>Recordar este dispositivo</label>
            </div>
            <div class="flex justify-center">
              <Button @click="login(user, password)">Iniciar sesion</Button>
            </div>
            <div class="flex justify-center">
              <!-- <a class="underline" href="prueba.com"
                >¿Olvidaste tu contraseña?</a
              > -->
              <!-- <pre>errors: {{ errors }}</pre> -->
            </div>
          </div>
        </form>
      </template>
    </Card>
  </div>
</template>
<script setup lang="ts">
import { Card, Button, Checkbox } from 'primevue';
import { useForm } from 'vee-validate';
import * as yup from 'yup';

import { emailFormat, passwordValidation } from '@/core/utils/validationRules';
import AppInputText from '@/core/components/AppInputText.vue';

import { useAuth } from '../composables/useAuth';

const { errors, defineField } = useForm({
  validationSchema: yup.object({
    user: emailFormat(),
    password: passwordValidation(),
  }),
});

const [user, userAttrs] = defineField('user');
const [password, passwordAttrs] = defineField('password');

const { login } = useAuth();
</script>
