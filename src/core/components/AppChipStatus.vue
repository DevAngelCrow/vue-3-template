<template>
  <Chip
    :label="label"
    :icon="computedIcon"
    class="inline-flex justify-center items-center text-xs font-semibold px-2.5 py-0.5 rounded-full min-w-[76px] whitespace-nowrap shadow-2xs"
    :style="computedStyle"
    v-bind="$attrs"
  >
    <template v-for="(_, name) in $slots" #[name]="slotProps">
      <slot :name="name" v-bind="slotProps || {}" />
    </template>
  </Chip>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { Chip } from 'primevue';

defineOptions({ name: 'AppChipStatus' });

const props = defineProps({
  label: {
    type: String,
    default: '',
  },
  backgroundColor: {
    type: String,
    default: '',
  },
  textColor: {
    type: String,
    default: '',
  },
  icon: {
    type: String,
    default: 'pi pi-circle-fill',
  },
  active: {
    type: Boolean,
    default: undefined,
  },
});

const computedIcon = computed(() => props.icon);

const computedStyle = computed(() => {
  const bg = props.backgroundColor?.trim();
  const text = props.textColor?.trim();

  // Si no se provee color pero hay flag active booleano
  if (!bg && props.active !== undefined) {
    return props.active
      ? {
          backgroundColor:
            'color-mix(in srgb, var(--p-emerald-500, #10b981) 25%, transparent)',
          color: 'var(--p-emerald-700, #047857)',
          '--p-chip-icon-color': 'var(--p-emerald-600, #059669)',
        }
      : {
          backgroundColor:
            'color-mix(in srgb, var(--p-surface-400, #94a3b8) 25%, transparent)',
          color: 'var(--p-surface-600, #475569)',
          '--p-chip-icon-color': 'var(--p-surface-400, #94a3b8)',
        };
  }

  // Si no hay background proporcionado, fallback seguro para evitar romper color-mix
  if (!bg) {
    return {
      backgroundColor:
        'color-mix(in srgb, var(--p-primary-500, #10b981) 25%, transparent)',
      color: text || 'var(--p-surface-800, #1e293b)',
      '--p-chip-icon-color': 'var(--p-primary-600, #059669)',
    };
  }

  // Soporte tanto para variables CSS (var(--p-...)) como códigos HEX/RGB
  const safeBg =
    bg.startsWith('var(') || bg.startsWith('#') || bg.startsWith('rgb')
      ? bg
      : `#${bg}`;

  return {
    backgroundColor: `color-mix(in srgb, ${safeBg} 30%, transparent)`,
    color: text || 'var(--p-surface-800, #1e293b)',
    '--p-chip-icon-color': safeBg,
  };
});
</script>

<style scoped></style>
