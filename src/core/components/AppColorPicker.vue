<template>
  <div
    :class="[
      'min-w-[150px]',
      'relative',
      props.class || 'w-auto',
      'flex',
      'flex-col',
      'gap-1',
    ]"
  >
    <div class="flex flex-row items-center gap-2 w-full">
      <ColorPicker
        name="color"
        :inline="inline"
        :model-value="colorPickerModelValue"
        :format="format"
        :disabled="disabled || readonly"
        @update:model-value="onUpdate"
      />
      <div
        v-if="showInputText"
        id="inputs-color-picker"
        class="flex flex-col items-center flex-1 min-w-0"
      >
        <FloatLabel :variant="labelVariant" class="w-full">
          <IconField class="w-full group">
            <InputMask
              class="w-full"
              :size="size"
              :variant="variant"
              :fluid="fluid"
              :model-value="modelValue"
              :mask="computedMask"
              @update:model-value="onUpdate"
              :id="resolvedInputId"
              :placeholder="displayPlaceholder"
              :disabled="disabled"
              :readonly="readonly"
              v-bind="$attrs"
              @focus="isFocused = true"
              @blur="isFocused = false"
              :invalid="invalid"
            />
            <InputIcon
              v-if="modelValue && !readonly && !disabled"
              class="pi pi-times cursor-pointer"
              @click="clearable"
            />
          </IconField>
          <label
            v-if="label"
            :class="{ 'text-danger-600': invalid }"
            :for="resolvedInputId"
          >
            {{ label }}
          </label>
        </FloatLabel>
      </div>
    </div>
    <Message
      v-if="errorMessage?.length"
      class="left-0 top-full mt-0 text-xs z-10"
      severity="error"
      size="small"
      variant="simple"
    >
      {{ errorMessage }}
    </Message>
  </div>
</template>
<script lang="ts" setup>
import {
  ColorPicker,
  Message,
  InputMask,
  InputIcon,
  IconField,
  FloatLabel,
} from 'primevue';
import { computed, ref, useId } from 'vue';

import type { AppColorPickerProps } from '../interfaces';

defineOptions({ inheritAttrs: false, name: 'AppColorPicker' });

const props = withDefaults(defineProps<AppColorPickerProps>(), {
  modelValue: undefined,
  class: 'w-full max-w-[322px]',
  label: '',
  id: undefined,
  errorMessage: '',
  size: undefined,
  variant: 'outlined',
  labelVariant: 'on',
  fluid: true,
  disabled: false,
  readonly: false,
  showInputText: true,
  inline: false,
  format: 'hex',
  mask: '',
  placeholder: '',
});

const emit = defineEmits<{
  'update:modelValue': [value: string | undefined];
  'click-clear': [];
}>();

const colorPickerModelValue = computed(() => {
  if (props.format === 'hex' && typeof props.modelValue === 'string') {
    return props.modelValue.replace(/^#/, '');
  }
  return props.modelValue ?? undefined;
});

const getDefaultPlaceholder = () => {
  switch (props.format) {
    case 'hex':
      return '#000000';
    case 'rgb':
      return 'rgb(0, 0, 0)';
    case 'hsb':
      return 'hsb(0, 0, 0)';
    default:
      return '#000000';
  }
};

const getDefaultMask = () => {
  switch (props.format) {
    case 'hex':
      return '#******';
    case 'rgb':
      return 'rgb(999, 999, 999)';
    case 'hsb':
      return 'hsb(999, 999, 999)';
    default:
      return '#******';
  }
};

const computedPlaceholder = computed(
  () => props.placeholder || getDefaultPlaceholder(),
);
const computedMask = computed(() => props.mask || getDefaultMask());

const onUpdate = (value: string | undefined) => {
  if (props.readonly || props.disabled) return;
  if (!value) {
    emit('update:modelValue', value);
    return;
  }

  let formattedValue = String(value);

  switch (props.format) {
    case 'hex':
      if (!formattedValue.startsWith('#')) {
        formattedValue = `#${formattedValue}`;
      }
      break;
    default:
      break;
  }

  emit('update:modelValue', formattedValue);
};

const clearable = () => {
  if (props.readonly || props.disabled) return;
  let defaultValue = '#000000';

  switch (props.format) {
    case 'hex':
      defaultValue = '#000000';
      break;
    case 'rgb':
      defaultValue = 'rgb(0, 0, 0)';
      break;
    case 'hsb':
      defaultValue = 'hsb(0, 0, 0)';
      break;
  }

  emit('update:modelValue', defaultValue);
  emit('click-clear');
};

const autoId = useId();
const resolvedInputId = computed(() => props.id || autoId);
const invalid = computed(() => Boolean(props.errorMessage?.length));
const isFocused = ref<boolean>(false);

const displayPlaceholder = computed(() => {
  if (isFocused.value && props.label) {
    return computedPlaceholder.value;
  }
  if (!props.label.length) {
    return computedPlaceholder.value;
  }
  return undefined;
});
</script>
