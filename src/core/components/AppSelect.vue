<template>
  <div :class="rootClass">
    <div class="p-hidden-accessible" data-p-hidden-accessible="true">
      <input
        :id="computedInputId"
        type="text"
        readonly
        tabindex="-1"
        :disabled="disabled || readonly"
        role="combobox"
        :aria-label="label || placeholder"
        @focus="focusSelect"
      />
    </div>
    <FloatLabel :variant="labelVariant" class="w-full">
      <Select
        ref="selectRef"
        :class="[
          'w-full',
          computedMinWidthClass,
          { 'pointer-events-none': readonly },
        ]"
        :inputId="`${computedInputId}-select`"
        :model-value="modelValue"
        :invalid="isInvalid"
        :disabled="disabled"
        :readonly="readonly"
        :fluid="fluid"
        :options="options"
        :option-label="optionLabel"
        :option-value="optionValue"
        :option-disabled="optionDisabled"
        :option-group-label="optionGroupLabel"
        :option-group-children="optionGroupChildren"
        :filter="filter"
        :filter-placeholder="filterPlaceholder"
        :show-clear="showClear"
        :placeholder="displayPlaceholder"
        :aria-describedby="ariaDescribedby"
        :aria-invalid="isInvalid"
        :variant="computedVariant"
        :size="inputSize"
        :autocomplete="autocomplete"
        v-bind="$attrs"
        @update:model-value="onUpdateReadonly"
        @focus="onFocus"
        @blur="onBlur"
        @change="onChange"
        @filter="onFilter"
        @before-show="onBeforeShow"
        @before-hide="onBeforeHide"
        @show="onShow"
        @hide="onHide"
        @clear="onClear"
      >
        <!-- Reenvío dinámico de todos los slots hacia PrimeVue Select -->
        <template v-for="(_, slotName) in $slots" #[slotName]="slotProps">
          <slot :name="slotName" v-bind="slotProps ?? {}" />
        </template>
      </Select>
      <label
        v-if="label"
        :class="[
          'truncate max-w-[calc(100%-2.5rem)] select-none cursor-pointer',
          { 'text-danger-600': isInvalid },
        ]"
        :for="computedInputId"
        :title="label"
        @click="focusSelect"
      >
        {{ label }}
      </label>
    </FloatLabel>
    <Message
      v-if="errorMessageText.length > 0"
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
import { Select, Message, FloatLabel } from 'primevue';
import type { SelectChangeEvent, SelectFilterEvent } from 'primevue';

import type {
  AppSelectProps,
  AppSelectEmits,
} from '../interfaces/select.interface';
import {
  resolveInputRootClass,
  hasCustomMinWidth,
} from '../utils/inputClasses';

defineOptions({
  name: 'AppSelect',
  inheritAttrs: false,
});

const props = withDefaults(defineProps<AppSelectProps>(), {
  modelValue: null,
  class: '',
  options: () => [],
  optionLabel: '',
  optionValue: undefined,
  optionDisabled: undefined,
  optionGroupLabel: undefined,
  optionGroupChildren: undefined,
  placeholder: '',
  severity: 'error',
  size: 'small',
  inputSize: undefined,
  variant: 'simple',
  labelVariant: 'on',
  inputVariant: undefined,
  inputVarian: undefined,
  errorMessages: '',
  autocomplete: 'off',
  label: '',
  id: undefined,
  inputId: undefined,
  filter: false,
  filterPlaceholder: 'Buscar...',
  showClear: false,
  fluid: true,
  minWidth: undefined,
  readonly: false,
  disabled: false,
  invalid: false,
});

const emit = defineEmits<AppSelectEmits>();

const selectRef = ref<{ $el?: HTMLElement; focus?: () => void }>();
const isFocused = ref<boolean>(false);

const computedMinWidthClass = computed<string>(() => {
  if (props.minWidth) return props.minWidth;
  if (hasCustomMinWidth(props.class)) return '';
  return 'min-w-40';
});

const rootClass = computed(() =>
  resolveInputRootClass(props.class, [computedMinWidthClass.value]),
);
const autoId = useId();
const computedInputId = computed(() => props.id || props.inputId || autoId);

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

const computedVariant = computed<'outlined' | 'filled' | undefined>(() => {
  if (props.inputVariant === 'outlined' || props.inputVariant === 'filled') {
    return props.inputVariant;
  }
  if (props.inputVarian === 'outlined' || props.inputVarian === 'filled') {
    return props.inputVarian;
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

const focusSelect = () => {
  if (!props.readonly && !props.disabled && selectRef.value) {
    const el = selectRef.value.$el as HTMLElement | undefined;
    const focusable =
      el?.querySelector<HTMLElement>('.p-select-label') ??
      el?.querySelector<HTMLElement>('[tabindex="0"]') ??
      el?.querySelector<HTMLElement>('input') ??
      el;
    focusable?.focus?.();
  }
};

const onUpdateReadonly = (value: AppSelectProps['modelValue']) => {
  if (props.readonly || props.disabled) return;
  emit('update:modelValue', value ?? null);
};

const onFocus = (event: Event) => {
  isFocused.value = true;
  emit('focus', event);
};

const onBlur = (event: Event) => {
  isFocused.value = false;
  emit('blur', event);
};

const onChange = (event: SelectChangeEvent) => {
  emit('change', event);
};

const onFilter = (event: SelectFilterEvent) => {
  emit('filter', event);
};

const onBeforeShow = () => {
  emit('before-show');
};

const onBeforeHide = () => {
  emit('before-hide');
};

const onShow = () => {
  emit('show');
};

const onHide = () => {
  emit('hide');
};

const onClear = () => {
  emit('clear');
};

defineExpose({
  focus: focusSelect,
  select: selectRef,
});
</script>
