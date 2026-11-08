<template>
  <div :class="rootClass">
    <component
      :is="label ? FloatLabel : 'div'"
      :variant="label ? labelVariant : undefined"
      :class="{ contents: !label }"
    >
      <component
        :is="prependInnerIcon ? IconField : 'div'"
        :class="prependInnerIcon ? 'w-full group' : 'contents'"
      >
        <InputIcon
          v-if="prependInnerIcon"
          :class="[prependInnerIcon, { 'text-danger-600': isInvalid }]"
        />
        <InputNumber
          class="w-full"
          :fluid="fluid"
          :input-class="computedInputClass"
          :increment-button-class="computedIncrementButtonClass"
          :decrement-button-class="computedDecrementButtonClass"
          :model-value="modelValue"
          @update:model-value="onUpdate"
          :invalid="isInvalid"
          v-bind="$attrs"
          :autocomplete="autocomplete"
          :placeholder="displayPlaceholder"
          :input-id="inputId"
          @focus="isFocused = true"
          @blur="isFocused = false"
          :show-buttons="showButtons"
          :min="min"
          :max="max"
          :button-layout="buttonLayout"
          :variant="inputVariant"
          :size="inputSize"
        >
          <template #incrementicon>
            <span
              :class="[
                buttonLayout === 'vertical' ? 'pi pi-chevron-up' : 'pi pi-plus',
                'text-xs',
              ]"
            />
          </template>
          <template #decrementicon>
            <span
              :class="[
                buttonLayout === 'vertical'
                  ? 'pi pi-chevron-down'
                  : 'pi pi-minus',
                'text-xs',
              ]"
            />
          </template>
        </InputNumber>
      </component>
      <label
        v-if="label"
        :class="{ 'text-danger-600': isInvalid }"
        :for="inputId"
      >
        {{ label }}
      </label>
    </component>
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
<script setup lang="ts">
import { ref, computed, watch, useId } from 'vue';
import {
  InputNumber,
  InputIcon,
  Message,
  IconField,
  FloatLabel,
} from 'primevue';

import { resolveInputRootClass } from '../utils/inputClasses';

defineOptions({ inheritAttrs: false, name: 'AppInputNumber' });

const props = defineProps({
  modelValue: {
    type: Number,
    default: null,
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
  inputSize: {
    type: String,
    default: 'normal',
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
    default: undefined,
  },
  errorMessages: {
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
  showButtons: {
    type: Boolean,
    default: false,
  },
  buttonLayout: {
    type: String,
    default: 'vertical',
  },
  min: {
    type: Number,
    default: undefined,
  },
  max: {
    type: Number,
    default: undefined,
  },
  fluid: {
    type: Boolean,
    default: true,
  },
  invalid: {
    type: Boolean,
    default: false,
  },
  inputClass: {
    type: [String, Object, Array],
    default: '',
  },
});

const emit = defineEmits<{
  'update:modelValue': [value: number | null];
}>();

const rootClass = computed(() => resolveInputRootClass(props.class));
const autoId = useId();
const inputId = computed(() => props.id || props.inputId || autoId);

const invalidFromError = ref<boolean>(false);
const isInvalid = computed(
  () => props.invalid || invalidFromError.value || !!props.errorMessages.length,
);

const isHorizontal = computed(
  () => props.showButtons && props.buttonLayout === 'horizontal',
);

const computedInputClass = computed(() => {
  const custom = props.inputClass;
  return [
    'min-w-0',
    isHorizontal.value ? 'text-center !px-1' : 'w-full',
    custom,
  ];
});

const computedIncrementButtonClass = computed(() => {
  if (isHorizontal.value) {
    return '!w-8 shrink-0 flex items-center justify-center hover:bg-surface-100 transition-colors cursor-pointer';
  }
  return undefined;
});

const computedDecrementButtonClass = computed(() => {
  if (isHorizontal.value) {
    return '!w-8 shrink-0 flex items-center justify-center hover:bg-surface-100 transition-colors cursor-pointer';
  }
  return undefined;
});

const isFocused = ref<boolean>(false);

const onUpdate = (value: number | undefined) => {
  emit('update:modelValue', value ?? null);
};

const displayPlaceholder = computed(() => {
  if (isFocused.value) {
    return props.placeholder;
  }
  if (!props.label.length) {
    return props.placeholder;
  }
});

watch(
  () => props.errorMessages,
  newValue => {
    invalidFromError.value = true;
    if (!newValue.length) {
      invalidFromError.value = false;
    }
  },
);
</script>
