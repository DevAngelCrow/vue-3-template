<template>
  <div :class="rootClass">
    <div class="flex items-stretch w-full">
      <span
        v-if="prefix"
        class="inline-flex items-center px-3 text-sm font-semibold text-surface-600 bg-surface-100 border border-surface-300 border-r-0 rounded-l-md select-none shrink-0"
      >
        {{ prefix }}
      </span>
      <FloatLabel :variant="labelVariant" class="w-full flex-1 min-w-0">
        <IconField class="w-full group">
          <InputIcon
            v-if="prependInnerIcon"
            :class="[prependInnerIcon, { 'text-danger-600': invalid }]"
          />
          <InputMask
            :class="['w-full', { '!rounded-l-none': !!prefix }]"
            :model-value="modelValue"
            @update:model-value="onUpdate"
            :invalid="invalid"
            v-bind="$attrs"
            :autocomplete
            :placeholder="displayPlaceholder"
            :id="inputId"
            @focus="isFocused = true"
            @blur="isFocused = false"
            :mask="primeMask"
            :variant="inputVariant"
          />
          <InputIcon
            v-if="appendIcon"
            :class="[
              appendIcon,
              'absolute right-4 top-5.5',
              { 'text-danger-600': invalid },
            ]"
            @click="emit('click-end-icon')"
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
    <Message
      v-if="errorMessages.length"
      class="left-0 top-full mt-0 text-xs z-10"
      :severity
      :size
      :variant
    >
      {{ errorMessages }}
    </Message>
  </div>
</template>
<script setup lang="ts">
import { ref, computed, watch, useId } from 'vue';
import { InputMask, InputIcon, Message, IconField, FloatLabel } from 'primevue';

import { resolveInputRootClass } from '../utils/inputClasses';
defineOptions({ inheritAttrs: false, name: 'AppInputMask' });

const props = defineProps({
  modelValue: {
    type: String,
  },
  class: {
    type: String,
    default: '',
  },
  placeholder: {
    type: String,
    default: '',
  },
  severity: {
    type: String,
    default: 'error',
  },
  size: {
    type: String,
    default: 'small',
  },
  variant: {
    type: String,
    default: 'simple',
  },
  labelVariant: {
    type: String,
    default: 'on',
  },
  inputVariant: {
    type: String,
    default: 'large',
  },
  errorMessages: {
    type: String,
    default: '',
  },
  appendIcon: {
    type: String,
    default: '',
  },
  prependInnerIcon: {
    type: String,
    default: '',
  },
  autocomplete: {
    type: String,
    default: 'off',
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
  mask: {
    type: String,
    default: '',
  },
  prefix: {
    type: String,
    default: '',
  },
});

const emit = defineEmits(['update:modelValue', 'click-end-icon']);

const rootClass = computed(() => resolveInputRootClass(props.class));
const autoId = useId();
const inputId = computed(() => props.id || props.inputId || autoId);

const invalid = ref<boolean>(false);
const isFocused = ref<boolean>(false);

const onUpdate = (value: string | undefined) => {
  emit('update:modelValue', value ?? '');
};

const displayPlaceholder = computed(() => {
  if (isFocused.value) {
    return props.placeholder;
  }
  if (!props.label.length) {
    return props.placeholder;
  }
});

const primeMask = computed(() => {
  if (isFocused.value || !props.label?.length || props.modelValue?.length) {
    return props.mask;
  }
  return undefined;
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
