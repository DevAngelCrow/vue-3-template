<template>
  <Checkbox v-bind="$attrs" @update:model-value="onUpdate" />
  <Message>
    {{ messageErrorField }}
  </Message>
</template>
<script setup lang="ts">
import { Checkbox } from 'primevue';
import { ref, computed } from 'vue';

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false,
  },
  errorMessages: {
    type: String,
    default: '',
  },
});

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
