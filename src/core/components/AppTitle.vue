<template>
  <div class="flex flex-col items-center text-center justify-center w-full">
    <h1 class="text-2xl lg:text-4xl font-semibold text-primary">{{ title }}</h1>
  </div>
</template>
<script setup>
defineOptions({ name: 'AppTitle' });

defineProps({
  title: {
    type: String,
    required: true,
  },
});
</script>
