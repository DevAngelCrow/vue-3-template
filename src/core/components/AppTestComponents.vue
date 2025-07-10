<script setup lang="ts">
import Button from "primevue/button";
import { onMounted, ref } from "vue";
import AppDocumentVisor from "./AppDocumentVisor.vue";
import AppModal from "./AppModal.vue";
import AppDatePicker from "./AppDatePicker.vue";
import AppNavBarMenu from "./AppNavBarMenu.vue";

const show = ref<boolean>(false);

const openModal = (value: boolean) => {
  show.value = true;
};

const closeModal = (value: boolean) => {
  show.value = false;
};

onMounted(() => {
  //pintarAlgo();
  //pruebaPost();
});
</script>

<template>
  <div
    class="w-full h-full flex justify-center items-center align-base-line bg-[url(https://picsum.photos/1200/800)]"
  >
    <!-- <AppDocumentVisor
      :document-name="'prueba'"
      :show="show"
      :file="documento"
      :validType="'application/pdf'"
      @close-visor="(value: boolean) => show = value"
    /> -->
    <!-- <AppModal
      :show="show"
      @close-modal="closeModal"
      @openModal="openModal"
    ></AppModal> -->
    <!-- <AppNavBarMenu :menu="items" /> -->
    <!-- <AppDatePicker /> -->
    <!-- <Button @click="openModal(show)">Modal</Button> -->
  </div>
</template>

<style scoped>
.read-the-docs {
  color: #888;
}
</style>
