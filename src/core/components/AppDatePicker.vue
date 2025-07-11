<template>
  <div class="flex justify-center">
    <div class="w-auto">
      <DatePicker
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
        :placeholder
        :manual-input="false"
        fluid
        :show-time
      />
    </div>
  </div>
</template>
<script setup lang="ts">
import { DatePicker } from 'primevue';
import { CreateDateFromFormat, FormatDate, IsDateAfter } from '../utils/dates';
import { computed, type PropType } from 'vue';

const props = defineProps({
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
});

const dateModel = defineModel<string | string[] | null>({
  type: [String, Array],
  default: null,
});

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
        .map((dia) => CreateDateFromFormat(dia))
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
        .map((dia) => FormatDate(dia.toISOString(), 'DD/MM/YYYY'))
        .filter((d): d is string => d !== null);
      dateModel.value = dias;
    } else {
      dateModel.value = props.showTime
        ? FormatDate(value.toISOString(), 'DD/MM/YYYY hh:mm a')
        : FormatDate(value.toISOString(), 'DD/MM/YYYY');
    }
  },
});

validation();
</script>
