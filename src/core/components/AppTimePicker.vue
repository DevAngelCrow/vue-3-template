<template>
  <div class="flex justify-center">
    <div class="w-auto">
      <DatePicker
        v-model="temporal"
        show-icon
        :icon-display
        icon="pi pi-clock"
        :show-time="true"
        time-only
        hide-on-date-time-select
        :placeholder
        manual-input
        :disabled
        :readonly
        hour-format="12"
        selection-mode="single"
      >
      </DatePicker>
    </div>
  </div>
</template>

<script setup lang="ts">
import { CreateDateFromFormat, FormatDate } from '../utils/dates';
import { computed } from "vue";
defineProps({
  icon: {
    type: String,
    default: 'pi pi-clock'
  },
  placeholder: {
    type: String,
    default: 'hh:mm a'
  },
  disabled: {
    type: Boolean,
    default: false
  },
  readonly: {
    type: Boolean,
    default: false
  },
  iconDisplay: {
    type: String,
    default: ''
  }
})

const timeValue = defineModel<string | string[] | null>({ type: [String, Array], default: null })

const temporal = computed<Date | null>({
  get: () => {
    if (typeof timeValue.value === 'string' && timeValue.value !== '') {
      return CreateDateFromFormat(timeValue.value, 'hh:mm a')
    } else {
      return null
    }
  },
  set: (value: Date | null) => {
    if (!value) {
      timeValue.value = ''
    } else {
      timeValue.value = FormatDate(value.toISOString(), 'hh:mm a')
    }
  }
})
</script>
