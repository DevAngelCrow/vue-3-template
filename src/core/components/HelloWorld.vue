<script setup lang="ts">

import { Button } from "primevue";
import AppPaginator from "./AppPaginator.vue";

const prueba = (value: number) => { console.log()}
</script>

<template>
  <div class="w-full h-full flex justify-center items-center align-base-line">
    <Button>Bills Team!</Button>
    <AppPaginator @pageUpdate="prueba" />
  </div>
</template>

<style scoped>
.read-the-docs {
  color: #888;
}
</style>
