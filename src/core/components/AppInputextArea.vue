<template>
  <div :class="rootClass">
    <FloatLabel :variant="labelVariant">
      <Textarea
        ref="textareaRef"
        :class="['w-full', { 'pointer-events-none': readonly }]"
        :model-value="modelValue"
        :invalid="isInvalid"
        :disabled="disabled"
        :readonly="readonly"
        :rows="rows"
        :cols="cols"
        :auto-resize="autoResize"
        :fluid="fluid"
        :placeholder="displayPlaceholder"
        :id="computedInputId"
        :aria-describedby="ariaDescribedby"
        :aria-invalid="isInvalid"
        :variant="computedVariant"
        :autocomplete="autocomplete"
        v-bind="$attrs"
        @update:model-value="onUpdate"
        @focus="onFocus"
        @blur="onBlur"
        @change="onChange"
      />
      <label
        v-if="label"
        :class="{ 'text-danger-600': isInvalid }"
        :for="computedInputId"
      >
        {{ label }}
      </label>
    </FloatLabel>
    <Message
      v-if="errorMessageText.length > 0"
      :id="errorId"
      class="left-0 top-full mt-0 text-xs z-10"
      :severity="severity"
      :size="size"
      :variant="variant"
      role="alert"
      aria-live="assertive"
    >
      {{ errorMessageText }}
    </Message>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, useId } from 'vue';
import { Textarea, Message, FloatLabel } from 'primevue';

import type {
  AppInputextAreaProps,
  AppInputextAreaEmits,
} from '../interfaces/inputextarea.interface';
import { resolveInputRootClass } from '../utils/inputClasses';

defineOptions({
  name: 'AppInputextArea',
  inheritAttrs: false,
});

const props = withDefaults(defineProps<AppInputextAreaProps>(), {
  modelValue: '',
  class: '',
  placeholder: '',
  severity: 'error',
  size: 'small',
  variant: 'simple',
  labelVariant: 'on',
  inputVariant: undefined,
  errorMessages: '',
  autocomplete: 'off',
  label: '',
  id: undefined,
  inputId: undefined,
  rows: 3,
  cols: undefined,
  autoResize: false,
  fluid: true,
  readonly: false,
  disabled: false,
  invalid: false,
});

const emit = defineEmits<AppInputextAreaEmits>();

const textareaRef = ref<{ $el?: HTMLTextAreaElement; focus?: () => void }>();
const isFocused = ref<boolean>(false);

const rootClass = computed(() => resolveInputRootClass(props.class));
const autoId = useId();
const computedInputId = computed(() => props.id || props.inputId || autoId);

const errorMessageText = computed<string>(() => {
  if (Array.isArray(props.errorMessages)) {
    return props.errorMessages.filter(Boolean).join(', ');
  }
  return props.errorMessages || '';
});

const isInvalid = computed<boolean>(() => {
  return Boolean(props.invalid || errorMessageText.value.length > 0);
});

const errorId = computed<string>(() => `${computedInputId.value}-error`);

const ariaDescribedby = computed<string | undefined>(() => {
  return errorMessageText.value.length > 0 ? errorId.value : undefined;
});

const computedVariant = computed<'outlined' | 'filled' | undefined>(() => {
  if (props.inputVariant === 'outlined' || props.inputVariant === 'filled') {
    return props.inputVariant;
  }
  return undefined;
});

const displayPlaceholder = computed<string | undefined>(() => {
  if (isFocused.value) {
    return props.placeholder;
  }
  if (!props.label?.length) {
    return props.placeholder;
  }
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

const onChange = (event: Event) => {
  emit('change', event);
};

defineExpose({
  focus: () => {
    const el =
      textareaRef.value?.$el ??
      (textareaRef.value as unknown as HTMLTextAreaElement);
    el?.focus?.();
  },
  textarea: textareaRef,
});
</script>
