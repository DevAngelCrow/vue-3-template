<template>
  <div :class="['min-w-[150px]', 'relative', props.class || 'w-auto']">
    <FloatLabel :variant="labelVariant">
      <IconField class="w-full group">
        <InputIcon
          v-if="prependIcon"
          :class="[prependIcon, { 'text-danger-600': invalid }]"
        />
        <InputNumber
          class="w-full"
          :model-value="modelValue"
          @update:model-value="onUpdate"
          :invalid="invalid"
          v-bind="$attrs"
          :autocomplete="autocomplete"
          :placeholder="displayPlaceholder"
          :input-id="resolvedInputId"
          @focus="isFocused = true"
          @blur="isFocused = false"
          mode="currency"
          :currency="currency"
          :locale="locale"
          :show-buttons="showButtons"
          :min="min"
          :max="max"
          :button-layout="buttonLayout"
          :fluid="fluid"
          :variant="variant"
          :size="size"
          :disabled="disabled"
          :readonly="readonly"
        >
          <template #incrementicon>
            <span
              :class="
                buttonLayout === 'stacked' || buttonLayout === 'vertical'
                  ? 'pi pi-chevron-up'
                  : 'pi pi-plus'
              "
            />
          </template>
          <template #decrementicon>
            <span
              :class="
                buttonLayout === 'stacked' || buttonLayout === 'vertical'
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
        :for="resolvedInputId"
      >
        {{ label }}
      </label>
    </FloatLabel>
    <Message
      v-if="errorMessage?.length"
      class="left-0 top-full mt-1 text-xs z-10"
      severity="error"
      size="small"
      variant="simple"
    >
      {{ errorMessage }}
    </Message>
  </div>
</template>
<script setup lang="ts">
import { ref, computed, useId } from 'vue';
import {
  InputNumber,
  InputIcon,
  Message,
  IconField,
  FloatLabel,
} from 'primevue';

import type { AppInputMoneyProps } from '../interfaces';

defineOptions({ inheritAttrs: false, name: 'AppInputMoney' });

const props = withDefaults(defineProps<AppInputMoneyProps>(), {
  modelValue: undefined,
  class: 'w-full max-w-[322px]',
  placeholder: '',
  size: undefined,
  variant: 'outlined',
  labelVariant: 'on',
  fluid: true,
  errorMessage: '',
  prependIcon: '',
  autocomplete: 'off',
  label: '',
  id: undefined,
  disabled: false,
  readonly: false,
  currency: 'USD',
  locale: 'en-US',
  showButtons: false,
  buttonLayout: 'stacked',
  min: undefined,
  max: undefined,
});

const emit = defineEmits<{
  'update:modelValue': [value: number | null | undefined];
}>();

const autoId = useId();
const resolvedInputId = computed(() => props.id || autoId);

const invalid = computed(() => Boolean(props.errorMessage?.length));
const isFocused = ref<boolean>(false);

const onUpdate = (value: number | null | undefined) => {
  emit('update:modelValue', value);
};

const displayPlaceholder = computed(() => {
  if (isFocused.value && props.label) {
    return props.placeholder || undefined;
  }
  if (!props.label.length) {
    return props.placeholder || undefined;
  }
  return undefined;
});
</script>
