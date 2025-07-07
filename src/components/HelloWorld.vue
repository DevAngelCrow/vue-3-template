<script setup lang="ts">
import { ref } from 'vue'
import { Button } from 'primevue'
defineProps<{ msg: string }>()

const count = ref(0)
</script>

<template>
  <div class="w-full">
  <Button class="bg-red-500 border-none">Hola</Button>
  </div>
  
</template>

<style scoped>
.read-the-docs {
  color: #888;
}
</style>
