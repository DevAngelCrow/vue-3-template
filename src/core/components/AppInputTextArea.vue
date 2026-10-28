<template>
  <div :class="['min-w-[150px]', 'relative', props.class || 'w-auto']">
    <FloatLabel :variant="labelVariant">
      <Textarea
        class="w-full"
        :model-value="modelValue"
        @update:model-value="onUpdate"
        :invalid="invalid"
        v-bind="$attrs"
        :autocomplete="autocomplete"
        :placeholder="displayPlaceholder"
        :id="resolvedInputId"
        @focus="isFocused = true"
        @blur="isFocused = false"
        :variant="variant"
        :size="size"
        :fluid="fluid"
        :auto-resize="autoResize"
        :disabled="disabled"
        :readonly="readonly"
      />
      <label
        v-if="label"
        :class="{ 'text-danger-600': invalid }"
        :for="resolvedInputId"
      >
        {{ label }}
      </label>
    </FloatLabel>
    <Message
      v-if="errorMessage?.length"
      class="left-0 top-full mt-1 text-xs z-10"
      severity="error"
      size="small"
      variant="simple"
    >
      {{ errorMessage }}
    </Message>
  </div>
</template>
<script setup lang="ts">
import { ref, computed, useId } from 'vue';
import { Textarea, Message, FloatLabel } from 'primevue';

import type { AppInputTextAreaProps } from '../interfaces';

defineOptions({ inheritAttrs: false, name: 'AppInputTextArea' });

const props = withDefaults(defineProps<AppInputTextAreaProps>(), {
  modelValue: undefined,
  class: 'w-full max-w-[322px]',
  placeholder: '',
  size: undefined,
  variant: 'outlined',
  labelVariant: 'on',
  fluid: true,
  autoResize: false,
  errorMessage: '',
  autocomplete: 'off',
  label: '',
  id: undefined,
  disabled: false,
  readonly: false,
});

const emit = defineEmits<{
  'update:modelValue': [value: string];
}>();

const autoId = useId();
const resolvedInputId = computed(() => props.id || autoId);

const invalid = computed(() => Boolean(props.errorMessage?.length));
const isFocused = ref<boolean>(false);

const onUpdate = (value: string | undefined) => {
  emit('update:modelValue', value ?? '');
};

const displayPlaceholder = computed(() => {
  if (isFocused.value && props.label) {
    return props.placeholder || undefined;
  }
  if (!props.label.length) {
    return props.placeholder || undefined;
  }
  return undefined;
});
</script>

