<template>
  <AppInputextArea v-bind="$attrs">
    <template v-for="(_, slotName) in $slots" #[slotName]="slotProps">
      <slot :name="slotName" v-bind="slotProps || {}" />
    </template>
  </AppInputextArea>
</template>

<script setup lang="ts">
import AppInputextArea from './AppInputextArea.vue';

defineOptions({ name: 'AppInputTextArea', inheritAttrs: false });
</script>
