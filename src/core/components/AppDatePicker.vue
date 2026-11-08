<template>
  <div :class="rootClass">
    <FloatLabel :variant="labelVariant">
      <DatePicker
        :inputId="computedInputId"
        class="w-full"
        v-model="temporal"
        :selection-mode="selectionMode"
        date-format="dd/mm/yy"
        :show-other-months="showOtherMonths"
        show-icon
        :icon="icon"
        :icon-display="iconDisplay"
        :number-of-months="1"
        :min-date="computedMinDate"
        :max-date="computedMaxDate"
        :disabled-dates="disabledDates"
        :disabled-days="disabledDays"
        :hour-format="hourFormat"
        :disabled="disabled"
        :readonly="readonly"
        :placeholder="displayPlaceholder"
        :manual-input="manualInput"
        fluid
        :show-time="showTime"
        :show-button-bar="showButtonBar"
        @focus="isFocused = true"
        @blur="isFocused = false"
        :invalid="computedInvalid"
        v-bind="$attrs"
      >
        <template v-for="(_, slotName) in $slots" #[slotName]="slotProps">
          <slot :name="slotName" v-bind="slotProps" />
        </template>
      </DatePicker>
      <label
        v-if="label"
        :class="{ 'text-danger-600': computedInvalid }"
        :for="computedInputId"
      >
        {{ label }}
      </label>
    </FloatLabel>
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
import { computed, ref, useId, type PropType } from 'vue';
import { DatePicker, FloatLabel, Message } from 'primevue';

import { CreateDateFromFormat, FormatDate } from '../utils/dates';
import { resolveInputRootClass } from '../utils/inputClasses';

defineOptions({ inheritAttrs: false, name: 'AppDatePicker' });

const props = defineProps({
  class: {
    type: String,
    default: '',
  },
  icon: {
    type: String,
    default: 'pi pi-calendar',
  },
  selectionMode: {
    type: String as PropType<'single' | 'multiple' | 'range'>,
    default: 'single',
  },
  showOtherMonths: {
    type: Boolean,
    default: true,
  },
  minDate: {
    type: [Date, String] as PropType<Date | string | null>,
    default: null,
  },
  maxDate: {
    type: [Date, String] as PropType<Date | string | null>,
    default: null,
  },
  disabledDates: {
    type: Array as PropType<Date[]>,
    default: () => [],
  },
  disabledDays: {
    type: Array as PropType<number[]>,
    default: null,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  readonly: {
    type: Boolean,
    default: false,
  },
  placeholder: {
    type: String,
    default: '',
  },
  iconDisplay: {
    type: String,
    default: '',
  },
  showTime: {
    type: Boolean,
    default: false,
  },
  hourFormat: {
    type: String,
    default: '12',
  },
  showButtonBar: {
    type: Boolean,
    default: false,
  },
  manualInput: {
    type: Boolean,
    default: false,
  },
  labelVariant: {
    type: String,
    default: 'on',
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
  errorMessages: {
    type: String,
    default: '',
  },
  invalid: {
    type: Boolean,
    default: false,
  },
  id: {
    type: String,
    default: undefined,
  },
  inputId: {
    type: String,
    default: undefined,
  },
  label: {
    type: String,
    default: '',
  },
});

const rootClass = computed(() => resolveInputRootClass(props.class));
const autoId = useId();
const computedInputId = computed(() => props.id || props.inputId || autoId);

const isFocused = ref<boolean>(false);

const computedInvalid = computed(() => {
  return Boolean(
    props.invalid || (props.errorMessages && props.errorMessages.length > 0),
  );
});

const computedMinDate = computed<Date | undefined>(() => {
  if (!props.minDate) return undefined;
  return CreateDateFromFormat(props.minDate) || undefined;
});

const computedMaxDate = computed<Date | undefined>(() => {
  if (!props.maxDate) return undefined;
  return CreateDateFromFormat(props.maxDate) || undefined;
});

const defaultPlaceholder = computed(() => {
  if (props.placeholder) return props.placeholder;
  return props.showTime ? 'DD/MM/AAAA hh:mm am/pm' : 'DD/MM/AAAA';
});

const displayPlaceholder = computed(() => {
  return isFocused.value ? defaultPlaceholder.value : undefined;
});

const dateModel = defineModel<string | string[] | Date | Date[] | null>({
  default: null,
});

/**
 * Parsea con tolerancia multiformato (DD/MM/YYYY, ISO, Date) a un Date válido
 */
const parseSingleDate = (
  val: string | Date | null | undefined,
): Date | null => {
  if (!val) return null;
  if (val instanceof Date) {
    return isNaN(val.getTime()) ? null : val;
  }
  if (typeof val === 'string' && val.trim() !== '') {
    if (props.showTime) {
      const fromWithTime12 = CreateDateFromFormat(val, 'DD/MM/YYYY hh:mm a');
      if (fromWithTime12 && !isNaN(fromWithTime12.getTime()))
        return fromWithTime12;

      const fromWithTime24 = CreateDateFromFormat(val, 'DD/MM/YYYY HH:mm');
      if (fromWithTime24 && !isNaN(fromWithTime24.getTime()))
        return fromWithTime24;
    }
    const fromDateOnly = CreateDateFromFormat(val, 'DD/MM/YYYY');
    if (fromDateOnly && !isNaN(fromDateOnly.getTime())) return fromDateOnly;

    // Fallback ISO / nativo gestionado por CreateDateFromFormat
    return CreateDateFromFormat(val);
  }
  return null;
};

/**
 * Formatea un objeto Date preservando la fecha y hora local del usuario
 */
const formatSingleDate = (val: Date): string => {
  if (props.showTime) {
    const timePattern =
      props.hourFormat === '24' ? 'DD/MM/YYYY HH:mm' : 'DD/MM/YYYY hh:mm a';
    return FormatDate(val, timePattern) || '';
  }
  return FormatDate(val, 'DD/MM/YYYY') || '';
};

const temporal = computed<Date | Date[] | null>({
  get: () => {
    if (Array.isArray(dateModel.value)) {
      return dateModel.value
        .map(d => parseSingleDate(d))
        .filter((d): d is Date => d !== null);
    }
    return parseSingleDate(dateModel.value);
  },
  set: (value: Date | (Date | null)[] | null) => {
    if (!value) {
      dateModel.value = '';
    } else if (Array.isArray(value)) {
      dateModel.value = value
        .filter(
          (d): d is Date =>
            d !== null && d instanceof Date && !isNaN(d.getTime()),
        )
        .map(d => formatSingleDate(d));
    } else if (value instanceof Date && !isNaN(value.getTime())) {
      dateModel.value = formatSingleDate(value);
    } else {
      dateModel.value = '';
    }
  },
});
</script>
