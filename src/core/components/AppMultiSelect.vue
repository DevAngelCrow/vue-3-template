<template>
  <div :class="['min-w-[150px]', 'relative', props.class || 'w-auto']">
    <FloatLabel :variant="labelVariant">
      <IconField class="w-full group">
        <InputIcon
          :class="
            invalid ? `${prependInnerIcon} text-danger-600` : prependInnerIcon
          "
          v-if="showIcon"
          id="append-icon"
        />
        <MultiSelect
          class="w-full"
          :inputId="inputId"
          :type="typeInputLocal"
          :model-value="modelValue"
          @update:model-value="onUpdate"
          :invalid="invalid"
          v-bind="$attrs"
          :autocomplete
          :placeholder="displayPlaceholder"
          @focus="() => (isFocused = true)"
          @blur="() => (isFocused = false)"
          :variant="inputVarian"
          :options
          :optionLabel
        />
        <InputIcon
          v-if="showIcon"
          :class="
            invalid
              ? ` ${appendIconLocal} text-danger-600 ${passwordInputType} absolute right-4 top-5.5`
              : `${appendIconLocal} ${passwordInputType} absolute right-4 top-5.5`
          "
          id="append-icon"
          @click="clickSecondIcon"
        />
      </IconField>
      <label
        v-if="label"
        :class="invalid ? 'text-danger-600' : ''"
        :for="inputId"
        >{{ label }}</label
      >
    </FloatLabel>
    <Message
      class="left-0 top-full mt-0 text-xs z-10"
      v-if="errorMessages.length"
      :severity
      :size
      :variant
      >{{ messageErrorField }}</Message
    >
  </div>
</template>
<script setup lang="ts">
import { ref, computed, watch, useId } from 'vue';
import {
  MultiSelect,
  InputIcon,
  Message,
  IconField,
  FloatLabel,
} from 'primevue';

defineOptions({ inheritAttrs: false, name: 'AppMultiSelect' });

const props = defineProps({
  modelValue: {
    type: Array,
  },
  class: {
    type: String,
    default: 'w-full max-w-[322px]',
  },
  type: {
    type: String,
    default: 'select',
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
    default: 'simple',
  },
  inputVarian: {
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
    default: undefined,
  },
  inputId: {
    type: String,
    default: undefined,
  },
  options: {
    //Opciones que apareceran en el desplegable del select
    type: Array,
    default: () => [],
  },
  optionLabel: {
    //Campo que aparecera si se envia un arreglo de objetos
    type: String,
    default: '',
  },
});

const emit = defineEmits(['update:modelValue', 'click-end-icon']);

const autoId = useId();
const inputId = computed(() => props.id || props.inputId || autoId);

const errors = ref<string>();
const invalid = ref<boolean>();
const appendIconLocal = ref<string>(
  props.appendIcon || (props.type === 'password' ? 'pi pi-eye' : ''),
);
const typeInputLocal = ref<string>(props.type);
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
  if (isFocused.value && props.label) {
    return props.placeholder;
  }
  if (!props.label.length) {
    return props.placeholder;
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

watch(
  () => props.appendIcon,
  newVal => {
    appendIconLocal.value = newVal;
  },
);

watch(
  () => props.errorMessages,
  newValue => {
    invalid.value = true;
    if (!newValue.length) {
      invalid.value = false;
    }
  },
);
</script>
