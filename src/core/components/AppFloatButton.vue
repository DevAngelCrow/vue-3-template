<template>
  <div
    id="scrollable"
    class="fixed bottom-10 right-3 z-50 rounded-full bg-primary p-3 md:p-3 mr-6 md:mr-6 hover:cursor-pointer w-[60px]"
    @click="eventoClick"
  >
    <img class="bg-transparent" alt="whatsapp-link" />
  </div>
</template>

<script setup lang="ts">
defineOptions({ name: 'AppFloatButton' });
const eventoClick = () => {
  //aquí se debe colocar la url pertinente
  ///window.open("", "_blank");
};
</script>
