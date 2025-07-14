<template>
  <IconField class="w-full group">
    <InputIcon
      :class="icon + ' text-red-600 group-focus-within:text-primary'"
      v-if="showIcon"
      id="prepend-icon"
    />
    <InputText
      :class
      :type="type"
      :placeholder="placeholder"
      :model-value="modelValue"
      @update:model-value="onUpdate"
      :invalid="invalid"
      v-bind="$attrs"
    />
    <InputIcon
      v-if="showIcon"
      :class="`${appendIcon} hover:cursor-pointer absolute right-4 top-5.5 `"
      id="append-icon"
      @click=""
    />
    <Message
      class="absolute left-0 top-full mt-1 text-xs z-10"
      v-if="errorMessages.length"
      :severity
      :size
      :variant
      >{{ messageErrorField }}</Message
    >
  </IconField>
</template>
<script setup lang="ts">
import { ref, computed, defineEmits, watch } from 'vue';
import { InputText, InputIcon, Message, IconField } from 'primevue';

defineOptions({ inheritAttrs: false });

const props = defineProps({
  modelValue: {
    type: String,
    default: '',
    required: true,
  },
  class: {
    type: String,
    default: 'w-full',
  },
  type: {
    type: String,
    default: 'text',
  },
  placeholder: {
    type: String,
    default: '',
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
  icon: {
    type: String,
    default: '',
  },
  showIcon: {
    type: Boolean,
    default: false,
  },
  appendIcon: {
    //final, dentro del input
    type: String,
    default: '',
  },
  appendOuterIcon: {
    // final, fuera y despues del input
    type: String,
    default: '',
  },
  prependIcon: {
    ///inicio fuera y antes del input
    type: String,
    default: '',
  },
  prependInnerIcon: {
    //Inicio dentro y al principio del input
    type: String,
    default: '',
  },
  clearIcon: {
    type: String,
    default: '',
  },
});

const emit = defineEmits(['update:modelValue']);

const errors = ref<string>();
const invalid = ref<boolean>();

const onUpdate = (value: string | undefined) => {
  return emit('update:modelValue', value ?? '');
};
const messageErrorField = computed(() => {
  if (props.errorMessages.length) {
    errors.value = props.errorMessages;
  }
  return errors.value;
});

watch(
  () => props.errorMessages,
  (newValue) => {
    invalid.value = true;
    if (!newValue.length) {
      invalid.value = false;
    }
    console.log(newValue, 'nuevo valor');
  },
);
</script>
<style scoped></style>
