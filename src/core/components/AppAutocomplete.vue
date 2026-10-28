<template>
  <div :class="['min-w-[150px]', 'relative', props.class || 'w-auto']">
    <FloatLabel :variant="labelVariant" class="w-full">
      <IconField v-if="prependIcon || appendIcon" class="w-full group">
        <InputIcon
          v-if="prependIcon"
          :class="[prependIcon, { 'text-danger-600': invalid }]"
        />
        <AutoComplete
          :class="['w-full', { 'pointer-events-none': readonly }]"
          :model-value="modelValue"
          @update:model-value="onUpdate"
          :invalid="invalid"
          v-bind="$attrs"
          :placeholder="displayPlaceholder"
          :input-id="resolvedInputId"
          @focus="isFocused = true"
          @blur="isFocused = false"
          :variant="variant"
          :size="size"
          :suggestions="suggestions"
          :option-label="optionLabel || undefined"
          :multiple="multiple"
          :dropdown="dropdown"
          :disabled="disabled"
          :readonly="readonly"
          :fluid="fluid"
          @complete="complete"
        />
        <InputIcon
          v-if="appendIcon"
          :class="[
            appendIcon,
            'cursor-pointer',
            { 'text-danger-600': invalid },
          ]"
          @click="emit('click-append-icon')"
        />
      </IconField>
      <AutoComplete
        v-else
        :class="['w-full', { 'pointer-events-none': readonly }]"
        :model-value="modelValue"
        @update:model-value="onUpdate"
        :invalid="invalid"
        v-bind="$attrs"
        :placeholder="displayPlaceholder"
        :input-id="resolvedInputId"
        @focus="isFocused = true"
        @blur="isFocused = false"
        :variant="variant"
        :size="size"
        :suggestions="suggestions"
        :option-label="optionLabel || undefined"
        :multiple="multiple"
        :dropdown="dropdown"
        :disabled="disabled"
        :readonly="readonly"
        :fluid="fluid"
        @complete="complete"
      />
      <label
        v-if="label"
        :class="{ 'text-danger-600': invalid }"
        :for="resolvedInputId"
      >
        {{ label }}
      </label>
    </FloatLabel>
    <Message
      v-if="errorMessage?.length"
      class="left-0 top-full mt-1 text-xs z-10"
      severity="error"
      size="small"
      variant="simple"
    >
      {{ errorMessage }}
    </Message>
  </div>
</template>
<script setup lang="ts">
import { ref, computed, useId } from 'vue';
import {
  AutoComplete,
  InputIcon,
  Message,
  IconField,
  FloatLabel,
} from 'primevue';
import type { AutoCompleteCompleteEvent } from 'primevue';

import type { AppAutocompleteProps } from '../interfaces';

defineOptions({ inheritAttrs: false, name: 'AppAutocomplete' });

const props = withDefaults(defineProps<AppAutocompleteProps>(), {
  modelValue: undefined,
  class: 'w-full max-w-[322px]',
  placeholder: '',
  size: undefined,
  variant: 'outlined',
  labelVariant: 'on',
  fluid: true,
  errorMessage: '',
  appendIcon: '',
  prependIcon: '',
  label: '',
  id: undefined,
  suggestions: () => [],
  optionLabel: '',
  multiple: false,
  dropdown: false,
  disabled: false,
  readonly: false,
});

const emit = defineEmits<{
  'update:modelValue': [value: unknown];
  'click-append-icon': [];
  complete: [event: AutoCompleteCompleteEvent];
}>();

const autoId = useId();
const resolvedInputId = computed(() => props.id || autoId);

const invalid = computed(() => Boolean(props.errorMessage?.length));
const isFocused = ref<boolean>(false);

const onUpdate = (value: unknown) => {
  if (!props.readonly && !props.disabled) {
    emit('update:modelValue', value ?? (props.multiple ? [] : ''));
  }
};

const displayPlaceholder = computed(() => {
  if (isFocused.value && props.label) {
    return props.placeholder || undefined;
  }
  if (!props.label.length) {
    return props.placeholder || undefined;
  }
  return undefined;
});

const complete = (event: AutoCompleteCompleteEvent) => {
  emit('complete', event);
};
</script>
