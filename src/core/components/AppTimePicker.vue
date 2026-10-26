<template>
  <div :class>
    <div class="w-auto">
      <DatePicker
        :inputId="inputId"
        v-model="temporal"
        show-icon
        :icon-display
        :icon
        :show-time="true"
        time-only
        hide-on-date-time-select
        :placeholder
        manual-input
        :disabled
        :readonly
        hour-format="12"
        selection-mode="single"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, useId } from 'vue';

import { CreateDateFromFormat, FormatDate } from '../utils/dates';

defineOptions({ name: 'AppTimePicker' });

const props = defineProps({
  class: {
    type: String,
    default: 'flex justify-center',
  },
  icon: {
    type: String,
    default: 'pi pi-clock',
  },
  placeholder: {
    type: String,
    default: 'hh:mm a',
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  readonly: {
    type: Boolean,
    default: false,
  },
  iconDisplay: {
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

const autoId = useId();
const inputId = computed(() => props.id || props.inputId || autoId);

const timeValue = defineModel<string | null>({
  type: String,
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
