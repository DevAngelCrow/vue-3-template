<template>
  <section class="w-full h-full bg-primary-800">
    <div
      class="w-full h-full bg-transparent flex justify-start items-center align-middle"
    >
      <Button
        class="bg-transparent border-none"
        @click="sideBar.showSideBar(!sideBar.sideBar)"
      >
        <i class="pi pi-bars"></i>
      </Button>
    </div>
  </section>
</template>
<script setup>
import { Button } from "primevue";
import { useLayoutStore } from "../store/useLayoutStore";

const sideBar = useLayoutStore();
</script>
<style scoped></style>
