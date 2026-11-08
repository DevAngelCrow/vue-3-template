<template>
  <button
    type="button"
    :class="buttonClasses"
    :title="title"
    :aria-label="ariaLabel || title || 'Botón flotante'"
    :disabled="disabled"
    @click="handleClick"
  >
    <slot>
      <i
        v-if="icon"
        :class="[icon, 'leading-none', 'text-4xl']"
        aria-hidden="true"
      />
      <img
        v-else-if="multimedia_source || imageSrc"
        :src="multimedia_source || imageSrc"
        :alt="title || ariaLabel || 'Acción flotante'"
        class="w-full h-full object-contain p-2 rounded-full pointer-events-none"
      />
    </slot>
  </button>
</template>

<script setup lang="ts">
import { computed } from 'vue';

defineOptions({ name: 'AppFloatButton' });

export type FloatButtonPosition =
  'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';

export type FloatButtonSize = 'sm' | 'md' | 'lg';

interface Props {
  icon?: string;
  imgSize?: string;
  multimedia_source?: string;
  imageSrc?: string;
  position?: FloatButtonPosition;
  size?: FloatButtonSize;
  title?: string;
  ariaLabel?: string;
  disabled?: boolean;
  offsetClass?: string;
}

const props = withDefaults(defineProps<Props>(), {
  icon: '',
  multimedia_source: '',
  imageSrc: '',
  position: 'bottom-right',
  size: 'md',
  title: '',
  ariaLabel: '',
  disabled: false,
  offsetClass: '',
});

const emit = defineEmits<{
  click: [event: MouseEvent];
  'event-click': [event: MouseEvent];
}>();

const POSITION_CLASSES: Record<FloatButtonPosition, string> = {
  'bottom-right': 'bottom-6 right-6 md:bottom-8 md:right-8',
  'bottom-left': 'bottom-6 left-6 md:bottom-8 md:left-8',
  'top-right': 'top-6 right-6 md:top-8 md:right-8',
  'top-left': 'top-6 left-6 md:top-8 md:left-8',
};

const SIZE_CLASSES: Record<FloatButtonSize, string> = {
  sm: 'w-12 h-12 text-xl',
  md: 'w-14 h-14 md:w-16 md:h-16 text-2xl md:text-3xl',
  lg: 'w-16 h-16 md:w-20 md:h-20 text-3xl md:text-4xl',
};

const buttonClasses = computed(() => {
  const baseClasses =
    'fixed z-50 flex items-center justify-center rounded-full bg-primary text-white shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none';
  const positionClass =
    props.offsetClass ||
    POSITION_CLASSES[props.position] ||
    POSITION_CLASSES['bottom-right'];
  const sizeClass = SIZE_CLASSES[props.size] || SIZE_CLASSES.md;

  return [baseClasses, positionClass, sizeClass];
});

const handleClick = (event: MouseEvent) => {
  if (props.disabled) return;
  emit('click', event);
  emit('event-click', event);
};
</script>
