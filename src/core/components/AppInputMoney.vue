<template>
  <div :class="['min-w-[150px]', 'relative', props.class || 'w-auto']">
    <FloatLabel :variant="labelVariant">
      <IconField class="w-full group">
        <InputIcon
          v-if="prependInnerIcon"
          :class="[prependInnerIcon, { 'text-danger-600': invalid }]"
        />
        <InputNumber
          class="w-full"
          type="text"
          :model-value="modelValue"
          @update:model-value="onUpdate"
          :invalid="invalid"
          v-bind="$attrs"
          :autocomplete
          :placeholder="displayPlaceholder"
          :inputId="inputId"
          @focus="isFocused = true"
          @blur="isFocused = false"
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
                buttonLayout === 'vertical'
                  ? 'pi pi-chevron-down'
                  : 'pi pi-minus'
              "
            />
          </template>
        </InputNumber>
      </IconField>
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
  inputVariant: {
    type: String,
    default: 'large',
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

const emit = defineEmits(['update:modelValue']);

const autoId = useId();
const inputId = computed(() => props.id || props.inputId || autoId);

const invalid = ref<boolean>(false);
const isFocused = ref<boolean>(false);

const onUpdate = (value: number | undefined) => {
  emit('update:modelValue', value);
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
    invalid.value = true;
    if (!newValue.length) {
      invalid.value = false;
    }
  },
);
</script>
