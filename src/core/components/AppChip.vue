<template>
  <Chip
    :label="label"
    :icon="icon"
    :image="image"
    :removable="removable"
    :class="computedClasses"
    :style="computedStyle"
    v-bind="$attrs"
    @remove="emit('remove', $event)"
  >
    <template v-for="(_, slotName) in $slots" #[slotName]="slotProps">
      <slot :name="slotName" v-bind="slotProps || {}" />
    </template>
  </Chip>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { Chip } from 'primevue';

defineOptions({ name: 'AppChip' });

export interface AppChipProps {
  label?: string;
  icon?: string;
  image?: string;
  removable?: boolean;
  severity?:
    | 'primary'
    | 'secondary'
    | 'success'
    | 'info'
    | 'warn'
    | 'danger'
    | 'contrast';
  size?: 'small' | 'normal';
  color?: string;
  textColor?: string;
  class?: string;
}

const props = withDefaults(defineProps<AppChipProps>(), {
  label: '',
  icon: undefined,
  image: undefined,
  removable: false,
  severity: undefined,
  size: 'normal',
  color: undefined,
  textColor: undefined,
  class: '',
});

const emit = defineEmits<{
  (e: 'remove', event: Event): void;
}>();

const severityClasses = computed(() => {
  switch (props.severity) {
    case 'primary':
      return 'bg-primary-100 text-primary-800 dark:bg-primary-900/40 dark:text-primary-300';
    case 'secondary':
      return 'bg-surface-100 text-surface-800 dark:bg-surface-800 dark:text-surface-200';
    case 'success':
      return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300';
    case 'info':
      return 'bg-sky-100 text-sky-800 dark:bg-sky-950/50 dark:text-sky-300';
    case 'warn':
      return 'bg-amber-100 text-amber-800 dark:bg-amber-950/50 dark:text-amber-300';
    case 'danger':
      return 'bg-red-100 text-red-800 dark:bg-red-950/50 dark:text-red-300';
    case 'contrast':
      return 'bg-surface-900 text-surface-0 dark:bg-surface-0 dark:text-surface-900';
    default:
      return '';
  }
});

const computedClasses = computed(() => [
  'inline-flex items-center justify-center font-medium transition-colors',
  props.size === 'small' ? 'text-xs py-0.5 px-2' : 'text-xs py-1 px-2.5',
  severityClasses.value,
  props.class,
]);

const computedStyle = computed(() => {
  const styleObj: Record<string, string> = {};
  if (props.color) {
    styleObj.backgroundColor =
      props.color.startsWith('#') || props.color.startsWith('rgb')
        ? `color-mix(in srgb, ${props.color} 30%, transparent)`
        : props.color;
    styleObj['--p-chip-icon-color'] = props.color;
  }
  if (props.textColor) {
    styleObj.color = props.textColor;
  }
  return styleObj;
});
</script>

<style scoped></style>
