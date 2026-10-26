<template>
  <div :class="['min-w-[150px]', 'relative', props.class || 'w-auto']">
    <FloatLabel :variant="labelVariant">
      <Textarea
        class="w-full"
        :model-value="modelValue"
        @update:model-value="onUpdate"
        :invalid="invalid"
        v-bind="$attrs"
        :autocomplete
        :placeholder="displayPlaceholder"
        :id="inputId"
        @focus="isFocused = true"
        @blur="isFocused = false"
        :variant="inputVarian"
      />
      <label
        v-if="label"
        :class="{ 'text-danger-600': invalid }"
        :for="inputId"
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
import { Textarea, Message, FloatLabel } from 'primevue';

defineOptions({ inheritAttrs: false, name: 'AppInputTextArea' });

const props = defineProps({
  modelValue: {
    type: String,
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
});

const emit = defineEmits(['update:modelValue']);

const autoId = useId();
const inputId = computed(() => props.id || props.inputId || autoId);

const invalid = ref<boolean>(false);
const isFocused = ref<boolean>(false);

const onUpdate = (value: string | undefined) => {
  emit('update:modelValue', value ?? '');
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
