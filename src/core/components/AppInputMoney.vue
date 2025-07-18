<template>
  <FloatLabel :variant="labelVariant" class="w-full max-w-[322px]">
    <IconField class="w-full group">
      <InputIcon
        :class="invalid ? `${prependInnerIcon} text-red-600` : prependInnerIcon"
        v-if="showIcon"
      />
      <InputNumber
        :class
        type="text"
        :model-value="modelValue"
        @update:model-value="onUpdate"
        :invalid="invalid"
        v-bind="$attrs"
        :autocomplete
        :placeholder="displayPlaceholder"
        :id="inputId"
        @focus="() => (isFocused = true)"
        @blur="() => (isFocused = false)"
        mode="currency"
        :currency
        :locale
        :show-buttons
        :min
        :max
        :button-layout
        fluid
        :variant="inputVariant"
      >
        <template #incrementicon>
          <span
            :class="
              buttonLayout === 'vertical' ? 'pi pi-chevron-up' : 'pi pi-plus'
            "
          />
        </template>
        <template #decrementicon>
          <span
            :class="
              buttonLayout === 'vertical' ? 'pi pi-chevron-down' : 'pi pi-minus'
            "
          />
        </template>
      </InputNumber>
      <Message
        class="absolute left-0 top-full mt-1 text-xs z-10"
        v-if="errorMessages.length"
        :severity
        :size
        :variant
        >{{ messageErrorField }}</Message
      >
    </IconField>
    <label :class="invalid ? 'text-red-600' : ''" :for="inputId">{{
      label
    }}</label>
  </FloatLabel>
</template>
<script setup lang="ts">
import { ref, computed, defineEmits, watch, onMounted } from 'vue';
import {
  InputNumber,
  InputIcon,
  Message,
  IconField,
  FloatLabel,
} from 'primevue';

defineOptions({ inheritAttrs: false, name: 'AppInputMoney' });

const props = defineProps({
  modelValue: {
    type: Number,
  },
  class: {
    type: String,
    default: 'w-full',
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
  showIcon: {
    type: Boolean,
    default: false,
  },
  appendIcon: {
    //final, dentro del input
    type: String,
    default: '',
  },
  prependInnerIcon: {
    //Inicio dentro y al principio del input
    type: String,
    default: '',
  },
  clearIcon: {
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
  },
  currency: {
    type: String,
    default: 'USD',
  },
  locale: {
    type: String,
    default: 'en-US',
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
  },
  max: {
    type: Number,
  },
});

const emit = defineEmits(['update:modelValue', 'click-end-icon']);

const errors = ref<string>();
const invalid = ref<boolean>();
const inputId = ref<string>(props.id || '');
const isFocused = ref<boolean>(false);

const onUpdate = (value: number | undefined) => {
  return emit('update:modelValue', value);
};
const messageErrorField = computed(() => {
  if (props.errorMessages.length) {
    errors.value = props.errorMessages;
  }
  return errors.value;
});

const displayPlaceholder = computed(() => {
  if (isFocused.value) {
    return props.placeholder;
  }
  if (!props.label.length) {
    return props.placeholder;
  }
});

onMounted(() => {
  if (!props.id) {
    inputId.value = `input-${Math.random().toString(36).substring(2, 9)}`;
  }
});

watch(
  () => props.errorMessages,
  (newValue) => {
    invalid.value = true;
    if (!newValue.length) {
      invalid.value = false;
    }
  },
);
</script>
