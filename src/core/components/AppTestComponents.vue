<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { Button } from 'primevue';
const show = ref<boolean>(false);

const openModal = (value: boolean) => {
  show.value = !value;
};

const closeModal = (value: boolean) => {
  show.value = value;
};

const confirmModal = () => {
  //TODO
  //aca debe hacer algo
  closeModal(false);
};
onMounted(() => {});
</script>

<template>
  <Button @click="openModal(show)">Modal</Button>
  <AppModal
    :show="show"
    @close-modal="closeModal"
    @confirm-modal="confirmModal"
    show-icon-close
    title="AppModal"
  >
    <div>
      <h1>Aca esta el body del modal</h1>
    </div>
  </AppModal>
  <h1>Esto es un texto</h1>
</template>

<style scoped>
.read-the-docs {
  color: #888;
}
</style>
