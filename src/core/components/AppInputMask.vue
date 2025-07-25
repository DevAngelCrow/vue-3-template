<template>
  <FloatLabel :variant="labelVariant" class="w-full max-w-[322px]">
    <IconField class="w-full group">
      <InputIcon
        :class="invalid ? `${prependInnerIcon} text-red-600` : prependInnerIcon"
        v-if="showIcon"
        id="append-icon"
      />
      <InputMask
        :class
        :type="typeInputLocal"
        :model-value="modelValue"
        @update:model-value="onUpdate"
        :invalid="invalid"
        v-bind="$attrs"
        :autocomplete
        :placeholder="displayPlaceholder"
        :id="inputId"
        @focus="() => (isFocused = true)"
        @blur="() => (isFocused = false)"
        :mask="primeMask"
        :variant="inputVariant"
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
      <Message
        class="absolute left-0 top-full mt-1 text-xs z-10"
        v-if="errorMessages.length"
        :severity
        :size
        :variant
        >{{ messageErrorField }}</Message
      >
    </IconField>
    <label :class="invalid ? 'text-red-600' : ''" :for="inputId">{{
      label
    }}</label>
  </FloatLabel>
</template>
<script setup lang="ts">
import { ref, computed, defineEmits, watch, onMounted } from 'vue';
import { InputMask, InputIcon, Message, IconField, FloatLabel } from 'primevue';

defineOptions({ inheritAttrs: false, name: 'AppInputMask' });

const props = defineProps({
  modelValue: {
    type: String,
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
  labelVariant: {
    type: String,
    default: 'on',
  },
  inputVariant: {
    type: String,
    default: 'large',
  },
  errorMessages: {
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
  prependInnerIcon: {
    //Inicio dentro y al principio del input
    type: String,
    default: '',
  },
  clearIcon: {
    type: String,
    default: '',
  },
  autocomplete: {
    type: String,
    default: 'off',
  },
  label: {
    type: String,
    default: '',
  },
  id: {
    type: String,
  },
  mask: {
    type: String,
    default: '',
  },
});

const emit = defineEmits(['update:modelValue', 'click-end-icon']);

const errors = ref<string>();
const invalid = ref<boolean>();
const appendIconLocal = ref<string>(props.appendIcon);
const typeInputLocal = ref<string>(props.type);
const inputId = ref<string>(props.id || '');
const isFocused = ref<boolean>(false);

const onUpdate = (value: string | undefined) => {
  return emit('update:modelValue', value ?? '');
};
const messageErrorField = computed(() => {
  if (props.errorMessages.length) {
    errors.value = props.errorMessages;
  }
  return errors.value;
});

const passwordInputType = computed(() => {
  if (props.type === 'password') {
    appendIconLocal.value = 'pi pi-eye';
    return 'hover:cursor-pointer';
  }
  return '';
});

const displayPlaceholder = computed(() => {
  if (isFocused.value) {
    return props.placeholder;
  }
  if (!props.label.length) {
    return props.placeholder;
  }
});

const primeMask = computed(() => {
  if (isFocused.value) {
    return props.mask;
  }
  if (!props.label.length) {
    return '';
  }
  if (props.modelValue?.length) {
    return props.mask;
  }
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

onMounted(() => {
  if (!props.id) {
    inputId.value = `input-${Math.random().toString(36).substring(2, 9)}`;
  }
});

watch(
  () => props.errorMessages,
  (newValue) => {
    invalid.value = true;
    if (!newValue.length) {
      invalid.value = false;
    }
  },
);
</script>
