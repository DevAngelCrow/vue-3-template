<template>
  <div id="scrollable" :class="className" @click="onClick">
    <img
      v-if="!icon"
      class="bg-transparent"
      :alt="alt"
      :src="imageSrc"
    />
    <i
      v-else
      :class="
        icon + ' w-full h-full !flex justify-center items-center text-4xl'
      "
    ></i>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

import type { AppFloatButtonProps } from '../interfaces';

defineOptions({ name: 'AppFloatButton' });

const props = withDefaults(defineProps<AppFloatButtonProps>(), {
  imageSrc: undefined,
  alt: 'Acción flotante',
  icon: '',
  class: undefined,
});

const emit = defineEmits<{
  click: [event: MouseEvent];
}>();

const onClick = (event: MouseEvent) => {
  emit('click', event);
};

const className = computed(() => {
  if (!props.class) {
    return 'flex justify-center items-center fixed bottom-10 right-3 z-50 rounded-full bg-primary p-3 md:p-3 mr-6 md:mr-6 hover:cursor-pointer w-[70px] h-[70px] text-white';
  }
  return `flex fixed z-50 rounded-full bg-primary hover:cursor-pointer min-w-[80px] min-h-[80px] text-white ${props.class}`;
});
</script>
