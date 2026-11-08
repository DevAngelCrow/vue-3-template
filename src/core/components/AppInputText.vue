<template>
  <div :class="rootClass">
    <FloatLabel :variant="labelVariant">
      <IconField class="w-full group">
        <InputIcon
          v-if="prependInnerIcon"
          :class="[prependInnerIcon, { 'text-danger-600': isInvalid }]"
        />
        <InputText
          ref="inputTextRef"
          :class="['w-full', { 'pointer-events-none': readonly }]"
          :input-class="inputClass"
          :type="typeInputLocal"
          :model-value="modelValue != null ? String(modelValue) : ''"
          :invalid="isInvalid"
          :disabled="disabled"
          :readonly="readonly"
          :fluid="fluid"
          :placeholder="displayPlaceholder"
          :id="computedInputId"
          :aria-describedby="ariaDescribedby"
          :aria-invalid="isInvalid"
          :variant="computedVariant"
          :size="inputSize"
          :autocomplete="autocomplete"
          v-bind="$attrs"
          @update:model-value="onUpdate"
          @focus="onFocus"
          @blur="onBlur"
          @change="onChange"
        />
        <InputIcon
          v-if="appendIconLocal"
          :class="[
            appendIconLocal,
            'absolute right-4 top-5.5',
            { 'text-danger-600': isInvalid },
            { 'hover:cursor-pointer': isAppendIconClickable },
          ]"
          :role="isAppendIconClickable ? 'button' : undefined"
          :tabindex="isAppendIconClickable ? 0 : undefined"
          :aria-label="appendIconAriaLabel"
          @click="clickSecondIcon"
          @keydown.enter.prevent="clickSecondIcon"
          @keydown.space.prevent="clickSecondIcon"
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
import { ref, computed, watch, useId } from 'vue';
import { InputText, InputIcon, Message, IconField, FloatLabel } from 'primevue';

import type {
  AppInputTextProps,
  AppInputTextEmits,
} from '../interfaces/input-text.interface';
import { resolveInputRootClass } from '../utils/inputClasses';

defineOptions({
  name: 'AppInputText',
  inheritAttrs: false,
});

const props = withDefaults(defineProps<AppInputTextProps>(), {
  modelValue: '',
  class: '',
  inputClass: '',
  type: 'text',
  placeholder: '',
  severity: 'error',
  size: 'small',
  inputSize: undefined,
  variant: 'simple',
  labelVariant: 'on',
  inputVariant: undefined,
  inputVarian: undefined,
  errorMessages: '',
  appendIcon: '',
  prependInnerIcon: '',
  autocomplete: 'off',
  label: '',
  id: undefined,
  inputId: undefined,
  readonly: false,
  disabled: false,
  fluid: true,
  invalid: false,
});

const emit = defineEmits<AppInputTextEmits>();

const inputTextRef = ref<{ $el?: HTMLInputElement; focus?: () => void }>();
const isFocused = ref<boolean>(false);

const rootClass = computed(() => resolveInputRootClass(props.class));
const autoId = useId();
const computedInputId = computed(() => props.id || props.inputId || autoId);

const typeInputLocal = ref<string>(props.type);
const appendIconLocal = ref<string>(
  props.appendIcon || (props.type === 'password' ? 'pi pi-eye' : ''),
);

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
  if (props.inputVarian === 'outlined' || props.inputVarian === 'filled') {
    return props.inputVarian;
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

const isAppendIconClickable = computed<boolean>(() => {
  return Boolean(props.type === 'password' || props.appendIcon);
});

const appendIconAriaLabel = computed<string | undefined>(() => {
  if (props.type === 'password') {
    return typeInputLocal.value === 'password'
      ? 'Mostrar contraseña'
      : 'Ocultar contraseña';
  }
  return undefined;
});

const onUpdate = (value: string | undefined) => {
  if (props.readonly || props.disabled) return;
  emit('update:modelValue', value ?? '');
};

const clickSecondIcon = (event?: MouseEvent | KeyboardEvent) => {
  if (props.disabled || props.readonly) return;
  if (props.type === 'password') {
    if (appendIconLocal.value === 'pi pi-eye') {
      appendIconLocal.value = 'pi pi-eye-slash';
      typeInputLocal.value = 'text';
    } else {
      appendIconLocal.value = 'pi pi-eye';
      typeInputLocal.value = 'password';
    }
  }
  emit('click-end-icon', event);
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

watch(
  () => props.appendIcon,
  newVal => {
    appendIconLocal.value =
      newVal ||
      (props.type === 'password'
        ? typeInputLocal.value === 'password'
          ? 'pi pi-eye'
          : 'pi pi-eye-slash'
        : '');
  },
);

watch(
  () => props.type,
  newVal => {
    typeInputLocal.value = newVal;
    if (newVal === 'password' && !props.appendIcon) {
      appendIconLocal.value = 'pi pi-eye';
    }
  },
);

defineExpose({
  focus: () => {
    const el =
      inputTextRef.value?.$el ??
      (inputTextRef.value as unknown as HTMLInputElement);
    el?.focus?.();
  },
  input: inputTextRef,
});
</script>
