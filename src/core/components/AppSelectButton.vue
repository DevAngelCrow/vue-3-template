<template>
  <SelectButton
    :class="[props.class]"
    :model-value="modelValue"
    :options="options"
    :option-label="optionLabel || undefined"
    :option-value="optionValue || undefined"
    :option-disabled="optionDisabled || undefined"
    :multiple="multiple"
    :size="size"
    :invalid="invalid"
    :disabled="disabled"
    :fluid="fluid"
    :allow-empty="allowEmpty"
    v-bind="$attrs"
    @update:model-value="onUpdate"
  />
</template>
<script setup lang="ts">
import { SelectButton } from 'primevue';

import type { AppSelectButtonProps } from '../interfaces';

defineOptions({ inheritAttrs: false, name: 'AppSelectButton' });

const props = withDefaults(defineProps<AppSelectButtonProps>(), {
  modelValue: undefined,
  options: undefined,
  optionLabel: undefined,
  optionValue: undefined,
  optionDisabled: undefined,
  multiple: false,
  size: undefined,
  invalid: false,
  disabled: false,
  fluid: false,
  allowEmpty: true,
  class: 'w-full',
});

const emit = defineEmits<{
  'update:modelValue': [value: unknown];
}>();

const onUpdate = (value: unknown) => {
  emit('update:modelValue', value ?? (props.multiple ? [] : ''));
};
</script>
<style scoped></style>
