<template>
  <Chip
    class="flex justify-center items-center max-w-[100px] min-w-[100px]"
    :style="{
      backgroundColor: `color-mix(in srgb, ${props.backgroundColor} 20%, transparent)`,
      color: props.textColor,
      '--p-chip-icon-color': props.backgroundColor,
    }"
    icon="pi pi-circle-fill"
  >
    <template v-for="(_, name) in $slots" #[name]="slotProps">
      <slot :name="name" v-bind="slotProps || {}"> </slot>
    </template>
  </Chip>
</template>

<script setup lang="ts">
import { Chip } from 'primevue';

const props = defineProps({
  backgroundColor: {
    type: String,
    default: '',
  },
  textColor: {
    type: String,
    default: '',
  },
});
</script>

<style scoped></style>
