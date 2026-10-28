<template>
  <div :class="['min-w-[150px]', 'relative', props.class || 'w-auto']">
    <FloatLabel :variant="labelVariant" class="w-full min-w-[150px]">
      <Select
        ref="selectRef"
        class="w-full min-w-[150px]"
        :input-id="resolvedInputId"
        :aria-labelledby="label ? `${resolvedInputId}-label` : undefined"
        :aria-label="!label ? placeholder || 'Seleccionar' : undefined"
        :model-value="modelValue"
        @update:model-value="onUpdateReadonly"
        :invalid="invalid"
        v-bind="$attrs"
        :placeholder="displayPlaceholder"
        @focus="isFocused = true"
        @blur="isFocused = false"
        :variant="variant"
        :size="size"
        :options="options"
        :option-label="optionLabel || undefined"
        :option-value="optionValue || undefined"
        :disabled="disabled"
        :readonly="readonly"
        :show-clear="showClear"
        :filter="filter"
        :fluid="fluid"
      />
      <label
        v-if="label"
        :id="`${resolvedInputId}-label`"
        :class="{ 'text-danger-600': invalid }"
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
import { Select, Message, FloatLabel } from 'primevue';

import type { AppSelectProps } from '../interfaces';

defineOptions({ inheritAttrs: false, name: 'AppSelect' });

const props = withDefaults(defineProps<AppSelectProps>(), {
  modelValue: undefined,
  class: 'w-full max-w-[322px]',
  placeholder: '',
  size: undefined,
  variant: 'outlined',
  labelVariant: 'on',
  fluid: true,
  errorMessage: '',
  label: '',
  id: undefined,
  options: () => [],
  optionLabel: '',
  optionValue: '',
  disabled: false,
  readonly: false,
  showClear: false,
  filter: false,
});

const emit = defineEmits<{
  'update:modelValue': [value: unknown];
}>();

const selectRef = ref<{ $el?: HTMLElement }>();

const autoId = useId();
const resolvedInputId = computed(() => props.id || autoId);

const invalid = computed(() => Boolean(props.errorMessage?.length));
const isFocused = ref<boolean>(false);

const onUpdateReadonly = (value: unknown) => {
  if (!props.readonly && !props.disabled) {
    emit('update:modelValue', value ?? '');
  }
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
