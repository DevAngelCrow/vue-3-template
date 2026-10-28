<template>
  <div :class="['w-auto', 'min-w-[150px]', 'relative', props.class]">
    <FloatLabel :variant="labelVariant">
      <DatePicker
        :input-id="resolvedInputId"
        class="w-full"
        v-model="temporal"
        v-bind="$attrs"
        :selection-mode="selectionMode"
        date-format="dd/mm/yy"
        :show-other-months="showOtherMonths"
        show-icon
        :icon="icon"
        :icon-display="iconDisplay"
        :number-of-months="1"
        :min-date="minDate"
        :max-date="maxDate"
        :disabled-dates="disabledDates"
        :disabled-days="disabledDays"
        hour-format="12"
        :disabled="disabled"
        :readonly="readonly"
        :placeholder="displayPlaceholder"
        :manual-input="false"
        :fluid="fluid"
        :show-time="showTime"
        :variant="variant"
        :size="size"
        @focus="isFocused = true"
        @blur="isFocused = false"
        :invalid="invalid"
      />
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
import { DatePicker, FloatLabel, Message } from 'primevue';
import { computed, ref, useId } from 'vue';

import type { AppDatePickerProps } from '../interfaces';
import { CreateDateFromFormat, FormatDate, IsDateAfter } from '../utils/dates';

defineOptions({ inheritAttrs: false, name: 'AppDatePicker' });

const props = withDefaults(defineProps<AppDatePickerProps>(), {
  class: 'w-full max-w-[322px]',
  icon: 'pi pi-calendar',
  selectionMode: 'single',
  showOtherMonths: true,
  minDate: undefined,
  maxDate: undefined,
  disabledDates: () => [],
  disabledDays: undefined,
  disabled: false,
  readonly: false,
  placeholder: 'DD/MM/AAAA',
  iconDisplay: 'input',
  showTime: false,
  labelVariant: 'on',
  variant: 'outlined',
  size: undefined,
  fluid: true,
  errorMessage: '',
  id: undefined,
  label: '',
});

const autoId = useId();
const resolvedInputId = computed(() => props.id || autoId);

const invalid = computed(() => Boolean(props.errorMessage?.length));
const isFocused = ref<boolean>(false);

const dateModel = defineModel<string | string[] | null>({
  default: null,
});

const validation = () => {
  const validSelectionMode: string[] = ['single', 'multiple', 'range'];
  if (!validSelectionMode.includes(props.selectionMode)) {
    return;
  }

  if (props.selectionMode === 'single' && Array.isArray(dateModel.value)) {
    return;
  }

  if (props.selectionMode !== 'single' && typeof dateModel.value === 'string') {
    return;
  }

  if (
    props.selectionMode === 'range' &&
    Array.isArray(dateModel.value) &&
    dateModel.value.length === 2
  ) {
    if (IsDateAfter(dateModel.value[0], dateModel.value[1])) {
      return;
    }
  }
};

const temporal = computed<Date | Date[] | null>({
  get: () => {
    if (typeof dateModel.value === 'string' && dateModel.value !== '') {
      if (props.showTime) {
        return CreateDateFromFormat(dateModel.value, 'DD/MM/YYYY hh:mm a');
      } else {
        return CreateDateFromFormat(dateModel.value);
      }
    } else if (Array.isArray(dateModel.value)) {
      const dias = dateModel.value;
      const diasFormated = dias
        .map(dia => CreateDateFromFormat(dia))
        .filter((d): d is Date => d !== null);
      return diasFormated;
    } else {
      return null;
    }
  },
  set: (value: Date | Date[] | null) => {
    if (!value) {
      dateModel.value = '';
    } else if (Array.isArray(value)) {
      const dias = value
        .map(dia => FormatDate(dia.toISOString(), 'DD/MM/YYYY'))
        .filter((d): d is string => d !== null);
      dateModel.value = dias;
    } else {
      dateModel.value = props.showTime
        ? FormatDate(value.toISOString(), 'DD/MM/YYYY hh:mm a')
        : FormatDate(value.toISOString(), 'DD/MM/YYYY');
    }
  },
});

const displayPlaceholder = computed(() => {
  if (isFocused.value && props.label) {
    return props.placeholder || undefined;
  }
  if (!props.label.length) {
    return props.placeholder || undefined;
  }
  return undefined;
});

validation();
</script>
