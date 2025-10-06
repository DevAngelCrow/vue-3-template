<template>
  <section
    id="card_documentos_personales"
    class="w-[95%] min-h-[290px] sm:w-[65%] md:w-[55%] lg:w-[55%] bg-surface-200 h-[25%] sm:h-[35%] md:h-[30%] rounded-xl flex flex-col align-top gap-10 lg:gap-12 px-3 py-3 sm:px-10 overflow-y-auto border border-primary-950"
  >
    <div class="w-full mt-5 gap-5 flex flex-col">
      <span class="text-xl">Información de usuario:</span>
    </div>
    <form class="flex gap-6 flex-wrap flex-row justify-between">
      <AppInputText
        class="flex-1"
        id="user_name"
        label="Nombre usuario*"
        v-model="userName"
        v-bind="userNameAttrs"
        :error-messages="errors.userName"
        show-icon
        prepend-inner-icon="pi pi-user"
        @update:modelValue="validationInputAlphanumeric(userName, 'userName')"
      />
      <AppInputText
        class="flex-1"
        id="password"
        label="Contraseña*"
        v-model="password"
        v-bind="passwordAttrs"
        :error-messages="errors.password"
        icon="pi pi-lock"
        show-icon
        prepend-inner-icon="pi pi-lock"
        autocomplete="current-password"
        type="password"
        @update:modelValue="validationInputPassword(password, 'password')"
      />
    </form>
    <div class="flex justify-center items-center w-full">
      <Button class="w-[140px]" @click="signUpUser">Registrar</Button>
    </div>
  </section>
</template>
<script setup lang="ts">
import { Button } from 'primevue';

import { useAuth } from '../composables/useAuth';

const {
  userName,
  userNameAttrs,
  password,
  passwordAttrs,
  errors,
  validationInputAlphanumeric,
  validationInputPassword,
} = useAuth();

const emits = defineEmits(['register']);

const signUpUser = () => {
  emits('register');
};

defineExpose({
  userName,
  userNameAttrs,
  password,
  passwordAttrs,
  errors,
});
</script>
<style scoped></style>
