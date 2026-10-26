<template>
  <div class="flex gap-2 items-center">
    <Checkbox
      v-bind="$attrs"
      :model-value="modelValue"
      @update:model-value="onUpdate"
      :input-id="inputId"
    />
    <label v-if="label" :for="inputId">{{ label }}</label>
  </div>
  <Message
    class="left-0 top-full mt-0 text-xs z-10"
    v-if="errorMessages.length"
    severity="error"
    size="small"
    variant="simple"
    >{{ messageErrorField }}</Message
  >
</template>
<script setup lang="ts">
import { Checkbox, Message } from 'primevue';
import { ref, computed, useId } from 'vue';

const props = defineProps({
  id: {
    type: String,
    default: undefined,
  },
  inputId: {
    type: String,
    default: undefined,
  },
  modelValue: {
    type: Boolean,
    default: false,
  },
  errorMessages: {
    type: String,
    default: '',
  },
  label: {
    type: String,
    default: '',
  },
});

const autoId = useId();
const inputId = computed(() => props.id || props.inputId || autoId);

const errors = ref<string>();
const emit = defineEmits(['update:modelValue']);

const messageErrorField = computed(() => {
  if (props.errorMessages.length) {
    errors.value = props.errorMessages;
  }
  return errors.value;
});

const onUpdate = (value: boolean) => {
  return emit('update:modelValue', value);
};
</script>
