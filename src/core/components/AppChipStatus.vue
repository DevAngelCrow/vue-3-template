<template>
  <Chip
    class="flex justify-center items-center min-w-[100px] max-w-[140px]"
    :label="label"
    :icon="icon"
    :style="chipStyle"
    v-bind="$attrs"
  >
    <template v-for="(_, name) in $slots" #[name]="slotProps">
      <slot :name="name" v-bind="slotProps || {}"></slot>
    </template>
  </Chip>
</template>

<script setup lang="ts">
import { Chip } from 'primevue';
import { computed, type CSSProperties } from 'vue';

import type { AppChipStatusProps } from '../interfaces';

defineOptions({ inheritAttrs: false, name: 'AppChipStatus' });

const props = withDefaults(defineProps<AppChipStatusProps>(), {
  label: undefined,
  icon: 'pi pi-circle-fill',
  backgroundColor: '',
  textColor: '',
});

const chipStyle = computed<CSSProperties>(() => {
  const styles: CSSProperties & Record<string, string> = {};
  if (props.backgroundColor) {
    styles.backgroundColor = `color-mix(in srgb, ${props.backgroundColor} 40%, transparent)`;
    styles['--p-chip-icon-color'] = props.backgroundColor;
  }
  if (props.textColor) {
    styles.color = props.textColor;
  }
  return styles;
});
</script>

<style scoped></style>
