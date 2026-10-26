<template>
  <div :class="['min-w-37.5', 'relative', props.class || 'w-auto']">
    <div class="p-hidden-accessible" data-p-hidden-accessible="true">
      <input
        :id="inputId"
        type="text"
        readonly
        tabindex="-1"
        :disabled="readonly"
        role="combobox"
        :aria-label="label || placeholder"
        @focus="focusSelect"
      />
    </div>
    <FloatLabel :variant="labelVariant">
      <Select
        ref="selectRef"
        :class="['w-full', { 'pointer-events-none': readonly }]"
        :inputId="`${inputId}-select`"
        :model-value="modelValue"
        @update:model-value="onUpdateReadonly"
        :invalid="invalid"
        v-bind="$attrs"
        :autocomplete
        :placeholder="displayPlaceholder"
        @focus="isFocused = true"
        @blur="isFocused = false"
        :variant="inputVarian"
        :options
        :optionLabel
      />
      <label
        v-if="label"
        :class="{ 'text-danger-600': invalid }"
        :for="inputId"
        @click="focusSelect"
      >
        {{ label }}
      </label>
    </FloatLabel>
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
import { Select, Message, FloatLabel } from 'primevue';

defineOptions({ inheritAttrs: false, name: 'AppSelect' });

const props = defineProps({
  modelValue: {
    type: [String, Number, Object, Boolean],
  },
  class: {
    type: String,
    default: 'w-full max-w-[322px]',
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
  inputVarian: {
    type: String,
    default: 'large',
  },
  errorMessages: {
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
  options: {
    type: Array,
    default: () => [],
  },
  optionLabel: {
    type: String,
    default: '',
  },
  readonly: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(['update:modelValue']);

const selectRef = ref<{ $el?: HTMLElement }>();

const autoId = useId();
const inputId = computed(() => props.id || props.inputId || autoId);

const invalid = ref<boolean>(false);
const isFocused = ref<boolean>(false);

const focusSelect = () => {
  if (!props.readonly && selectRef.value) {
    const el = selectRef.value.$el as HTMLElement | undefined;
    const focusable =
      el?.querySelector<HTMLElement>('.p-select-label') ??
      el?.querySelector<HTMLElement>('[tabindex="0"]') ??
      el;
    focusable?.focus?.();
  }
};

const onUpdateReadonly = (value: string | number | object | undefined) => {
  if (!props.readonly) {
    emit('update:modelValue', value ?? '');
  }
};

const displayPlaceholder = computed(() => {
  if (isFocused.value && props.label) {
    return props.placeholder;
  }
  if (!props.label.length) {
    return props.placeholder;
  }
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
