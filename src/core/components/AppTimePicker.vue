<template>
  <div :class="['min-w-[150px]', 'relative', props.class]">
    <FloatLabel v-if="label" :variant="labelVariant" class="w-full">
      <DatePicker
        :input-id="resolvedInputId"
        class="w-full"
        v-model="temporal"
        v-bind="$attrs"
        show-icon
        :icon-display="iconDisplay"
        :icon="icon"
        :show-time="true"
        time-only
        hide-on-date-time-select
        :placeholder="displayPlaceholder"
        manual-input
        :disabled="disabled"
        :readonly="readonly"
        :fluid="fluid"
        :variant="variant"
        :size="size"
        :invalid="invalid"
        hour-format="12"
        selection-mode="single"
        @focus="isFocused = true"
        @blur="isFocused = false"
      />
      <label
        :class="{ 'text-danger-600': invalid }"
        :for="resolvedInputId"
      >
        {{ label }}
      </label>
    </FloatLabel>
    <div v-else class="w-full">
      <DatePicker
        :input-id="resolvedInputId"
        class="w-full"
        v-model="temporal"
        v-bind="$attrs"
        show-icon
        :icon-display="iconDisplay"
        :icon="icon"
        :show-time="true"
        time-only
        hide-on-date-time-select
        :placeholder="placeholder"
        manual-input
        :disabled="disabled"
        :readonly="readonly"
        :fluid="fluid"
        :variant="variant"
        :size="size"
        :invalid="invalid"
        hour-format="12"
        selection-mode="single"
      />
    </div>
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
import { DatePicker, FloatLabel, Message } from 'primevue';
import { computed, ref, useId } from 'vue';

import type { AppTimePickerProps } from '../interfaces';
import { CreateDateFromFormat, FormatDate } from '../utils/dates';

defineOptions({ inheritAttrs: false, name: 'AppTimePicker' });

const props = withDefaults(defineProps<AppTimePickerProps>(), {
  class: 'w-full max-w-[322px]',
  icon: 'pi pi-clock',
  placeholder: 'hh:mm a',
  label: '',
  labelVariant: 'on',
  variant: 'outlined',
  size: undefined,
  fluid: true,
  disabled: false,
  readonly: false,
  iconDisplay: 'input',
  errorMessage: '',
  id: undefined,
});

const autoId = useId();
const resolvedInputId = computed(() => props.id || autoId);
const invalid = computed(() => Boolean(props.errorMessage?.length));
const isFocused = ref<boolean>(false);

const displayPlaceholder = computed(() => {
  if (isFocused.value && props.label) {
    return props.placeholder || undefined;
  }
  if (!props.label.length) {
    return props.placeholder || undefined;
  }
  return undefined;
});

const timeValue = defineModel<string | null>({
  default: null,
});

const temporal = computed<Date | null>({
  get: () => {
    if (typeof timeValue.value === 'string' && timeValue.value !== '') {
      return CreateDateFromFormat(timeValue.value, 'hh:mm a');
    }
    return null;
  },
  set: (value: Date | null) => {
    if (!value) {
      timeValue.value = '';
    } else {
      timeValue.value = FormatDate(value.toISOString(), 'hh:mm a');
    }
  },
});
</script>
