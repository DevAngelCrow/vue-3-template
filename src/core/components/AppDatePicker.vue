<template>
  <div :class="['w-auto', 'min-w-[150px]', 'relative', props.class]">
    <FloatLabel
    :variant="labelVariant"
    
  >
    <IconField class="w-full group">
      <InputIcon
        :class="invalid ? `${prependInnerIcon} text-red-600` : prependInnerIcon"
        v-if="showIcon"
        id="append-icon"
      />
      <DatePicker
        class="w-full"
        v-model="temporal"
        :selection-mode
        date-format="dd/mm/yy"
        :show-other-months
        show-icon
        :icon
        :icon-display
        :number-of-months="1"
        :min-date
        :max-date
        :disabled-dates
        :disabled-days
        hour-format="12"
        :disabled
        :readonly
        :placeholder="displayPlaceholder"
        :manual-input="false"
        fluid
        :show-time
        @focus="isFocused = true"
        @blur="isFocused = false"
        :invalid="invalid"
      />
      <InputIcon
        v-if="showIcon"
        :class="
          invalid
            ? ` ${appendIconLocal} text-red-600 ${passwordInputType} absolute right-4 top-5.5`
            : `${appendIconLocal} ${passwordInputType} absolute right-4 top-5.5`
        "
        id="append-icon"
        @click="clickSecondIcon"
      />
      
    </IconField>
    <label :class="invalid ? 'text-red-600' : ''" :for="inputId">{{
      label
    }}</label>
  </FloatLabel>
  <Message
        class="left-0 top-full mt-0 text-xs z-10"
        v-if="errorMessages.length"
        :severity
        :size
        :variant
      >
        {{ messageErrorField }}
      </Message>
  </div>
  
</template>
<script setup lang="ts">
import {
  DatePicker,
  FloatLabel,
  IconField,
  Message,
  InputIcon,
} from 'primevue';
import { computed, onMounted, ref, watch, type PropType } from 'vue';

import { CreateDateFromFormat, FormatDate, IsDateAfter } from '../utils/dates';

defineOptions({ name: 'AppDatePicker' });

const props = defineProps({
  class: {
    type: String,
    default: 'w-full max-w-[322px]',
  },
  icon: {
    type: String,
    default: 'pi pi-calendar',
  },
  selectionMode: {
    type: String,
    default: 'single',
  },
  showOtherMonths: {
    type: Boolean,
    default: true,
  },
  minDate: {
    type: Date,
    default: null,
  },
  maxDate: {
    type: Date,
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
  // dateFormated: {
  //   type: String,
  //   default: 'dd/mm/yy'
  // },
  placeholder: {
    type: String,
    default: 'DD/MM/AAAA',
  },
  iconDisplay: {
    type: String,
    default: '',
  },
  showTime: {
    type: Boolean,
    default: false,
  },
  labelVariant: {
    type: String,
    default: 'simple',
  },
  prependInnerIcon: {
    //Inicio dentro y al principio del input
    type: String,
    default: '',
  },
  appendIcon: {
    //final, dentro del input
    type: String,
    default: '',
  },
  showIcon: {
    type: Boolean,
    default: false,
  },
  type: {
    type: String,
    default: 'datepicker',
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
  id: {
    type: String,
  },
  label: {
    type: String,
    default: '',
  },
});

const invalid = ref<boolean>();
const appendIconLocal = ref<string>(props.appendIcon);
const typeInputLocal = ref<string>(props.type);
const errors = ref<string>();
const inputId = ref<string>(props.id || '');
const isFocused = ref<boolean>(false);

const dateModel = defineModel<string | string[] | null>({
  type: [String, Array],
  default: null,
});

const emit = defineEmits(['update:modelValue', 'click-end-icon']);
const validation = () => {
  const validSelectionMode: string[] = ['single', 'multiple', 'range'];
  if (!validSelectionMode.includes(props.selectionMode)) {
    //console.error("Modo de selección no válido: ", props.selectionMode);
  } else {
    if (props.selectionMode === 'single') {
      if (Array.isArray(dateModel.value)) {
        //console.error("El valor inicial debe ser un string: ", dateModel.value);
      }
    } else {
      if (typeof dateModel.value === 'string') {
        //console.error("El valor inicial debe ser un array: ", dateModel.value);
      }
      if (props.showTime) {
        // console.error(
        //   "No se puede seleccionar hora en modos de selección múltiple: ",
        //   props.showTime,
        //   props.selectionMode
        // );
      }
      if (
        props.selectionMode === 'range' &&
        Array.isArray(dateModel.value) &&
        dateModel.value.length === 2
      ) {
        if (IsDateAfter(dateModel.value[0], dateModel.value[1])) {
          //console.error("Rango de fechas inválido: ", dateModel.value);
        }
      }
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
        .filter((d): d is Date => d !== null); // filtra los null
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

const passwordInputType = computed(() => {
  if (props.type === 'password') {
    appendIconLocal.value = 'pi pi-eye';
    return 'hover:cursor-pointer';
  }
  return '';
});

const clickSecondIcon = () => {
  if (props.type === 'password' && appendIconLocal.value === 'pi pi-eye') {
    appendIconLocal.value = 'pi pi-eye-slash';
    typeInputLocal.value = 'text';
  } else if (
    appendIconLocal.value === 'pi pi-eye-slash' &&
    props.type === 'password'
  ) {
    appendIconLocal.value = 'pi pi-eye';
    typeInputLocal.value = 'password';
  }
  emit('click-end-icon');
};

const messageErrorField = computed(() => {
  if (props.errorMessages.length) {
    errors.value = props.errorMessages;
  }
  return errors.value;
});

const displayPlaceholder = computed(() => {
  return isFocused.value ? props.placeholder : undefined;
});

onMounted(() => {
  if (!props.id) {
    inputId.value = `input-${Math.random().toString(36).substring(2, 9)}`;
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

validation();
</script>
