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
            v-if="resolvedPrependIcon"
            :class="[resolvedPrependIcon, { 'text-danger-600': isInvalid }]"
          />
          <InputMask
            :class="['w-full', { '!rounded-l-none': !!prefix }]"
            :model-value="modelValue"
            :invalid="isInvalid"
            :disabled="disabled"
            :readonly="readonly"
            :fluid="fluid"
            :aria-invalid="isInvalid"
            :aria-describedby="ariaDescribedby"
            v-bind="$attrs"
            :autocomplete
            :placeholder="displayPlaceholder"
            :id="computedInputId"
            :mask="primeMask"
            :variant="computedVariant"
            @update:model-value="onUpdate"
            @focus="onFocus"
            @blur="onBlur"
          />
          <InputIcon
            v-if="appendIcon"
            :class="[
              appendIcon,
              'absolute right-4 top-5.5',
              { 'text-danger-600': isInvalid },
            ]"
            @click="emit('click-end-icon')"
          />
        </IconField>
        <label
          v-if="label"
          :class="{ 'text-danger-600': isInvalid }"
          :for="computedInputId"
        >
          {{ label }}
        </label>
      </FloatLabel>
    </div>
    <Message
      v-if="errorMessageText.length > 0"
      :id="errorId"
      class="left-0 top-full mt-0 text-xs z-10"
      :severity
      :size
      :variant
      role="alert"
      aria-live="assertive"
    >
      {{ errorMessageText }}
    </Message>
  </div>
</template>
<script setup lang="ts">
import { ref, computed, useId } from 'vue';
import { InputMask, InputIcon, Message, IconField, FloatLabel } from 'primevue';

import type {
  AppInputMaskEmits,
  AppInputMaskProps,
} from '../interfaces/components.interface';
import { resolveInputRootClass } from '../utils/inputClasses';

defineOptions({ inheritAttrs: false, name: 'AppInputMask' });

const props = withDefaults(defineProps<AppInputMaskProps>(), {
  modelValue: undefined,
  class: '',
  placeholder: '',
  severity: 'error',
  size: 'small',
  variant: 'simple',
  labelVariant: 'on',
  inputVariant: undefined,
  errorMessages: '',
  errorMessage: undefined,
  invalid: false,
  appendIcon: '',
  prependIcon: '',
  prependInnerIcon: '',
  autocomplete: 'off',
  label: '',
  id: undefined,
  inputId: undefined,
  mask: '',
  prefix: '',
  fluid: true,
  disabled: false,
  readonly: false,
});

const emit = defineEmits<AppInputMaskEmits>();

const rootClass = computed(() => resolveInputRootClass(props.class));
const autoId = useId();
const computedInputId = computed(() => props.id || props.inputId || autoId);

const isFocused = ref<boolean>(false);

const resolvedPrependIcon = computed<string>(
  () => props.prependInnerIcon || props.prependIcon || '',
);

const errorMessageText = computed<string>(() => {
  if (Array.isArray(props.errorMessages)) {
    return props.errorMessages.filter(Boolean).join(', ');
  }
  return props.errorMessages || props.errorMessage || '';
});

const isInvalid = computed<boolean>(() => {
  return Boolean(props.invalid || errorMessageText.value.length > 0);
});

const errorId = computed<string>(() => `${computedInputId.value}-error`);

const ariaDescribedby = computed<string | undefined>(() => {
  return errorMessageText.value.length > 0 ? errorId.value : undefined;
});

const computedVariant = computed<'outlined' | 'filled' | undefined>(() => {
  if (props.inputVariant === 'outlined') return 'outlined';
  if (props.inputVariant === 'filled') return 'filled';
  return undefined;
});

const onUpdate = (value: string | undefined) => {
  if (props.readonly || props.disabled) return;
  emit('update:modelValue', value ?? '');
};

const onFocus = (event: Event) => {
  isFocused.value = true;
  emit('focus', event);
};

const onBlur = (event: Event) => {
  isFocused.value = false;
  emit('blur', event);
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
</script>
