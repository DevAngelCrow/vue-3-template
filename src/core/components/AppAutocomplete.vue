<template>
  <div :class="rootClass">
    <FloatLabel :variant="labelVariant" class="w-full">
      <IconField class="w-full group">
        <InputIcon
          v-if="prependInnerIcon"
          :class="[prependInnerIcon, { 'text-danger-600': isInvalid }]"
        />
        <AutoComplete
          ref="autoCompleteRef"
          :class="[
            'w-full',
            computedMinWidthClass,
            { 'pointer-events-none': readonly },
          ]"
          :input-class="inputClass"
          :model-value="modelValue"
          :invalid="isInvalid"
          :disabled="disabled"
          :readonly="readonly"
          :fluid="fluid"
          :placeholder="displayPlaceholder"
          :input-id="computedInputId"
          :aria-describedby="ariaDescribedby"
          :aria-invalid="isInvalid"
          :variant="computedVariant"
          :size="inputSize"
          :suggestions="resolvedSuggestions"
          :option-label="optionLabel"
          :multiple="multiple"
          :dropdown="dropdown"
          :autocomplete="autocomplete"
          v-bind="$attrs"
          @update:model-value="onUpdate"
          @complete="onComplete"
          @focus="onFocus"
          @blur="onBlur"
          @change="onChange"
          @option-select="onOptionSelect"
          @option-unselect="onOptionUnselect"
          @item-select="onItemSelect"
          @item-unselect="onItemUnselect"
          @dropdown-click="onDropdownClick"
          @clear="onClear"
        >
          <!-- Reenvío dinámico de todos los slots hacia PrimeVue AutoComplete -->
          <template v-for="(_, slotName) in $slots" #[slotName]="slotProps">
            <slot :name="slotName" v-bind="slotProps ?? {}" />
          </template>
        </AutoComplete>
        <InputIcon
          v-if="appendIcon"
          :class="[
            appendIcon,
            'absolute right-4 top-5.5',
            { 'text-danger-600': isInvalid },
            'hover:cursor-pointer',
          ]"
          role="button"
          tabindex="0"
          @click="onAppendIconClick"
          @keydown.enter.prevent="onAppendIconClick"
          @keydown.space.prevent="onAppendIconClick"
        />
      </IconField>
      <label
        v-if="label"
        :class="[
          'truncate select-none cursor-pointer',
          labelMaxWidthClass,
          { 'text-danger-600': isInvalid },
        ]"
        :for="computedInputId"
        :title="label"
      >
        {{ label }}
      </label>
    </FloatLabel>
    <Message
      v-if="errorMessageText.length"
      :id="errorId"
      class="left-0 top-full mt-0 text-xs z-10"
      :severity="severity"
      :size="size"
      :variant="variant"
      role="alert"
      aria-live="assertive"
    >
      {{ errorMessageText }}
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
import type {
  AutoCompleteChangeEvent,
  AutoCompleteCompleteEvent,
  AutoCompleteDropdownClickEvent,
  AutoCompleteOptionSelectEvent,
  AutoCompleteOptionUnselectEvent,
} from 'primevue';

import type {
  AppAutocompleteProps,
  AppAutocompleteEmits,
} from '../interfaces/autocomplete.interface';
import {
  resolveInputRootClass,
  hasCustomMinWidth,
} from '../utils/inputClasses';

defineOptions({
  name: 'AppAutocomplete',
  inheritAttrs: false,
});

const props = withDefaults(defineProps<AppAutocompleteProps>(), {
  modelValue: null,
  class: '',
  inputClass: '',
  placeholder: '',
  severity: 'error',
  size: 'small',
  inputSize: undefined,
  variant: 'simple',
  labelVariant: 'on',
  inputVariant: undefined,
  errorMessages: '',
  appendIcon: '',
  prependInnerIcon: '',
  label: '',
  id: undefined,
  inputId: undefined,
  suggestions: () => [],
  suggestion: undefined,
  optionLabel: '',
  multiple: false,
  readonly: false,
  disabled: false,
  dropdown: false,
  fluid: true,
  minWidth: undefined,
  invalid: false,
  autocomplete: 'off',
  type: 'text',
});

const emit = defineEmits<AppAutocompleteEmits>();

const autoCompleteRef = ref<{ $el?: HTMLElement; focus?: () => void }>();
const isFocused = ref<boolean>(false);

const computedMinWidthClass = computed<string>(() => {
  if (props.minWidth) return props.minWidth;
  if (hasCustomMinWidth(props.class)) return '';
  return props.dropdown ? 'min-w-40' : '';
});

const rootClass = computed(() =>
  resolveInputRootClass(
    props.class,
    computedMinWidthClass.value ? [computedMinWidthClass.value] : undefined,
  ),
);
const autoId = useId();
const computedInputId = computed(() => props.id || props.inputId || autoId);

const labelMaxWidthClass = computed<string>(() => {
  if (props.dropdown && props.appendIcon) {
    return 'max-w-[calc(100%-4.5rem)]';
  }
  if (props.dropdown || props.appendIcon) {
    return 'max-w-[calc(100%-2.5rem)]';
  }
  return 'max-w-[calc(100%-1.5rem)]';
});

const errorMessageText = computed<string>(() => {
  if (Array.isArray(props.errorMessages)) {
    return props.errorMessages.filter(Boolean).join(', ');
  }
  return props.errorMessages || '';
});

const isInvalid = computed<boolean>(() => {
  return Boolean(props.invalid || errorMessageText.value.length > 0);
});

const errorId = computed<string>(() => `${computedInputId.value}-error`);

const ariaDescribedby = computed<string | undefined>(() => {
  return errorMessageText.value.length > 0 ? errorId.value : undefined;
});

const resolvedSuggestions = computed<unknown[]>(() => {
  if (props.suggestions && props.suggestions.length > 0) {
    return props.suggestions;
  }
  if (props.suggestion && props.suggestion.length > 0) {
    return props.suggestion;
  }
  return props.suggestions ?? props.suggestion ?? [];
});

const computedVariant = computed<'outlined' | 'filled' | undefined>(() => {
  if (props.inputVariant === 'outlined' || props.inputVariant === 'filled') {
    return props.inputVariant;
  }
  return undefined;
});

const displayPlaceholder = computed<string | undefined>(() => {
  if (isFocused.value) {
    return props.placeholder;
  }
  if (!props.label?.length) {
    return props.placeholder;
  }
  return undefined;
});

const onUpdate = (value: AppAutocompleteProps['modelValue']) => {
  if (props.readonly || props.disabled) return;
  emit('update:modelValue', value);
};

const onComplete = (event: AutoCompleteCompleteEvent) => {
  emit('complete', event);
};

const onFocus = (event: Event) => {
  isFocused.value = true;
  emit('focus', event);
};

const onBlur = (event: Event) => {
  isFocused.value = false;
  emit('blur', event);
};

const onChange = (event: AutoCompleteChangeEvent) => {
  emit('change', event);
};

const onOptionSelect = (event: AutoCompleteOptionSelectEvent) => {
  emit('option-select', event);
  emit('item-select', event);
};

const onOptionUnselect = (event: AutoCompleteOptionUnselectEvent) => {
  emit('option-unselect', event);
  emit('item-unselect', event);
};

const onItemSelect = (event: AutoCompleteOptionSelectEvent) => {
  emit('item-select', event);
};

const onItemUnselect = (event: AutoCompleteOptionUnselectEvent) => {
  emit('item-unselect', event);
};

const onDropdownClick = (event: AutoCompleteDropdownClickEvent) => {
  emit('dropdown-click', event);
};

const onClear = () => {
  emit('clear');
};

const onAppendIconClick = (event: MouseEvent | KeyboardEvent) => {
  if (props.disabled || props.readonly) return;
  emit('click-end-icon', event);
};

defineExpose({
  focus: () => {
    const input =
      autoCompleteRef.value?.$el?.querySelector<HTMLInputElement>('input');
    input?.focus();
  },
  autoComplete: autoCompleteRef,
});
</script>
