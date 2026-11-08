<template>
  <div :class="rootClass">
    <div class="flex flex-row items-center gap-2">
      <div
        :class="[
          'relative flex items-center',
          {
            'pointer-events-none opacity-80 cursor-not-allowed':
              readonly || disabled,
          },
        ]"
      >
        <ColorPicker
          name="color"
          :inline="inline"
          :model-value="modelValue"
          :format="format"
          :disabled="disabled || readonly"
          @update:model-value="onUpdate"
        />
      </div>
      <div id="inputs-color-picker" class="flex flex-col items-center">
        <FloatLabel v-if="showInputText" :variant="variantLabel">
          <IconField class="w-full group">
            <InputMask
              :size="size"
              :model-value="modelValue"
              :mask="computedMask"
              :id="inputId"
              :placeholder="displayPlaceholder"
              :invalid="invalid"
              :disabled="disabled"
              :readonly="readonly"
              :class="{ 'pointer-events-none': readonly }"
              @update:model-value="onUpdate"
              @focus="isFocused = true"
              @blur="isFocused = false"
            />
            <InputIcon
              v-if="appendIconDynamic"
              :class="appendIconDynamic"
              @click="clearable"
            />
          </IconField>
          <label
            v-if="label"
            :class="{ 'text-danger-600': invalid }"
            :for="inputId"
          >
            {{ label }}
          </label>
        </FloatLabel>
      </div>
    </div>
    <Message
      v-if="errorMessages.length"
      class="left-0 top-full mt-0 text-xs z-10"
      :severity="severity"
      :size="size"
      :variant="variant"
    >
      {{ errorMessages }}
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
import { computed, ref, watch, useId } from 'vue';

import { resolveInputRootClass } from '../utils/inputClasses';

defineOptions({ name: 'AppColorPicker' });

const props = defineProps({
  modelValue: {
    type: String,
  },
  class: {
    type: String,
    default: '',
  },
  label: {
    type: String,
    default: '',
  },
  id: {
    type: String,
    default: undefined,
  },
  inputId: {
    type: String,
    default: undefined,
  },
  errorMessages: {
    type: String,
    default: '',
  },
  severity: {
    type: String,
    default: 'error',
  },
  size: {
    type: String,
    default: 'normal',
  },
  variant: {
    type: String,
    default: 'simple',
  },
  variantLabel: {
    type: String,
    default: 'on',
  },
  showInputText: {
    type: Boolean,
    default: true,
  },
  inline: {
    type: Boolean,
    default: false,
  },
  format: {
    type: String,
    default: 'hex',
  },
  mask: {
    type: String,
    default: '',
  },
  placeholder: {
    type: String,
    default: '',
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  readonly: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(['update:modelValue', 'click-clear']);

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
  if (props.readonly || props.disabled) {
    return;
  }

  if (!value) {
    emit('update:modelValue', value);
    return;
  }

  let formattedValue = value;

  switch (props.format) {
    case 'hex':
      // Asegurar que el valor hex siempre tenga el '#'
      if (!value.startsWith('#')) {
        formattedValue = `#${value}`;
      }
      break;
    case 'rgb':
      if (!value.startsWith('rgb')) {
        formattedValue = value;
      }
      break;
    case 'hsb':
      if (!value.startsWith('hsb')) {
        formattedValue = value;
      }
      break;
    default:
      formattedValue = value;
  }

  emit('update:modelValue', formattedValue);
};

const clearable = () => {
  if (props.readonly || props.disabled) {
    return;
  }

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

const rootClass = computed(() =>
  resolveInputRootClass(props.class, ['flex', 'flex-col', 'gap-0']),
);
const autoId = useId();
const inputId = computed(() => props.id || props.inputId || autoId);
const invalid = ref<boolean>(false);
const isFocused = ref<boolean>(false);

const appendIconDynamic = computed(() => {
  if (props.readonly || props.disabled) {
    return '';
  }
  if (props.modelValue) {
    return 'pi pi-times cursor-pointer';
  }
  return '';
});

const displayPlaceholder = computed(() => {
  if (isFocused.value && props.label) {
    return computedPlaceholder.value;
  }
  if (!props.label.length) {
    return computedPlaceholder.value;
  }
  return '';
});

watch(
  () => props.errorMessages,
  newValue => {
    invalid.value = true;
    if (!newValue.length) {
      invalid.value = false;
    }
  },
);
</script>
