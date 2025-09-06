<template>
  <section
    id="card_documentos_personales"
    class="w-[95%] min-h-[290px] sm:w-[65%] md:w-[55%] lg:w-[55%] bg-surface-200 h-[25%] sm:h-[35%] md:h-[30%] rounded-xl flex flex-col align-top gap-10 lg:gap-12 px-3 py-3 sm:px-10 overflow-y-auto"
  >
    <div class="w-full mt-5 gap-5 flex flex-col">
      <span class="text-xl">Información de usuario:</span>
    </div>
    <div class="flex gap-6 flex-wrap flex-row justify-between">
      <AppInputText
        class="grow min-w-[200px]"
        id="email"
        label="Correo electrónico*"
        v-model="email"
      />
      <AppInputText
        class="grow"
        id="password"
        label="Contraseña*"
        v-model="password"
      />
    </div>
    <div class="flex justify-center items-center w-full">
      <Button class="w-[140px]" @click="registerData">Registrar</Button>
    </div>
  </section>
</template>
<script setup lang="ts">
import { Button } from 'primevue';

import { useAuth } from '../composables/useAuth';

const { email, password } = useAuth();

const emits = defineEmits(['register']);

const registerData = () => {
  emits('register');
};

defineExpose({
  email,
  password,
});
</script>
<style scoped></style>
