<template>
  <div :class="['min-w-[150px]', 'relative', props.class || 'w-auto']">
    <FloatLabel :variant="labelVariant">
      <IconField class="w-full group">
        <InputIcon
          v-if="prependInnerIcon"
          :class="[prependInnerIcon, { 'text-danger-600': invalid }]"
        />
        <AutoComplete
          :class="['w-full', { 'pointer-events-none': readonly }]"
          :type="typeInputLocal"
          :model-value="modelValue"
          @update:model-value="onUpdate"
          :invalid="invalid"
          v-bind="$attrs"
          :placeholder="displayPlaceholder"
          :input-id="inputId"
          @focus="isFocused = true"
          @blur="isFocused = false"
          :variant="inputVarian"
          :optionLabel
          :multiple
          @complete="complete"
        />
        <InputIcon
          v-if="appendIconLocal"
          :class="[
            appendIconLocal,
            'absolute right-4 top-5.5',
            { 'text-danger-600': invalid },
            { 'hover:cursor-pointer': type === 'password' },
          ]"
          @click="clickSecondIcon"
        />
      </IconField>
      <label
        v-if="label"
        :class="{ 'text-danger-600': invalid }"
        :for="inputId"
      >
        {{ label }}
      </label>
    </FloatLabel>
    <Message
      v-if="errorMessages.length"
      class="left-0 top-full mt-0 text-xs z-10"
      :severity
      :size
      :variant
    >
      {{ errorMessages }}
    </Message>
  </div>
</template>
<script setup lang="ts">
import { ref, computed, watch, useId } from 'vue';
import {
  AutoComplete,
  InputIcon,
  Message,
  IconField,
  FloatLabel,
} from 'primevue';
import type { AutoCompleteCompleteEvent } from 'primevue';

defineOptions({ inheritAttrs: false, name: 'AppAutocomplete' });

const props = defineProps({
  modelValue: {
    type: [Array, String, Object],
  },
  class: {
    type: String,
    default: 'w-full max-w-[322px]',
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
  inputVarian: {
    type: String,
    default: 'large',
  },
  errorMessages: {
    type: String,
    default: '',
  },
  appendIcon: {
    type: String,
    default: '',
  },
  prependInnerIcon: {
    type: String,
    default: '',
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
  suggestion: {
    //Opciones que apareceran en el desplegable del select
    type: Array,
    default: () => [],
  },
  optionLabel: {
    //Campo que aparecera si se envia un arreglo de objetos
    type: String,
    default: '',
  },
  multiple: {
    type: Boolean,
    default: false,
  },
  readonly: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(['update:modelValue', 'click-end-icon', 'complete']);

const autoId = useId();
const inputId = computed(() => props.id || props.inputId || autoId);

const invalid = ref<boolean>(false);
const appendIconLocal = ref<string>(
  props.appendIcon || (props.type === 'password' ? 'pi pi-eye' : ''),
);
const typeInputLocal = ref<string>(props.type);
const isFocused = ref<boolean>(false);

const onUpdate = (value: string | undefined) => {
  emit('update:modelValue', value ?? '');
};

const displayPlaceholder = computed(() => {
  if (isFocused.value && props.label) {
    return props.placeholder;
  }
  if (!props.label.length) {
    return props.placeholder;
  }
});

const clickSecondIcon = () => {
  if (props.type === 'password') {
    if (appendIconLocal.value === 'pi pi-eye') {
      appendIconLocal.value = 'pi pi-eye-slash';
      typeInputLocal.value = 'text';
    } else {
      appendIconLocal.value = 'pi pi-eye';
      typeInputLocal.value = 'password';
    }
  }
  emit('click-end-icon');
};

const complete = (event: AutoCompleteCompleteEvent) => {
  emit('complete', event);
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
