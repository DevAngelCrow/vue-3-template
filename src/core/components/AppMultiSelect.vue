<template>
  <div :class="rootClass">
    <FloatLabel :variant="labelVariant" class="w-full">
      <IconField class="w-full group">
        <InputIcon
          v-if="hasPrependIcon"
          :class="[prependInnerIcon, { 'text-danger-600': isInvalid }]"
        />
        <MultiSelect
          ref="multiSelectRef"
          :class="[
            'w-full',
            computedMinWidthClass,
            { 'pointer-events-none': readonly },
          ]"
          :input-id="computedInputId"
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
          :display="display"
          :max-selected-labels="maxSelectedLabels"
          :selected-items-label="selectedItemsLabel"
          :show-clear="showClear"
          :placeholder="displayPlaceholder"
          :aria-describedby="ariaDescribedby"
          :aria-invalid="isInvalid"
          :variant="computedVariant"
          :size="inputSize"
          :autocomplete="autocomplete"
          v-bind="$attrs"
          @update:model-value="onUpdate"
          @focus="onFocus"
          @blur="onBlur"
          @change="onChange"
          @filter="onFilter"
          @selectall-change="onSelectAllChange"
          @before-show="onBeforeShow"
          @before-hide="onBeforeHide"
          @show="onShow"
          @hide="onHide"
        >
          <!-- Reenvío dinámico de todos los slots hacia PrimeVue MultiSelect -->
          <template v-for="(_, slotName) in $slots" #[slotName]="slotProps">
            <slot :name="slotName" v-bind="slotProps ?? {}" />
          </template>
        </MultiSelect>
        <InputIcon
          v-if="hasAppendIcon"
          :class="[
            appendIcon,
            'absolute right-4 top-5.5',
            { 'text-danger-600': isInvalid },
            { 'hover:cursor-pointer': isAppendIconClickable },
          ]"
          :role="isAppendIconClickable ? 'button' : undefined"
          :tabindex="isAppendIconClickable ? 0 : undefined"
          @click="clickSecondIcon"
          @keydown.enter.prevent="clickSecondIcon"
          @keydown.space.prevent="clickSecondIcon"
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
import {
  MultiSelect,
  InputIcon,
  Message,
  IconField,
  FloatLabel,
} from 'primevue';
import type {
  MultiSelectAllChangeEvent,
  MultiSelectChangeEvent,
  MultiSelectFilterEvent,
} from 'primevue';

import type {
  AppMultiSelectProps,
  AppMultiSelectEmits,
} from '../interfaces/multiselect.interface';
import {
  resolveInputRootClass,
  hasCustomMinWidth,
} from '../utils/inputClasses';

defineOptions({
  name: 'AppMultiSelect',
  inheritAttrs: false,
});

const props = withDefaults(defineProps<AppMultiSelectProps>(), {
  modelValue: () => [],
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
  showIcon: true,
  appendIcon: '',
  prependInnerIcon: '',
  autocomplete: 'off',
  label: '',
  id: undefined,
  inputId: undefined,
  filter: false,
  filterPlaceholder: 'Buscar...',
  display: 'comma',
  maxSelectedLabels: undefined,
  selectedItemsLabel: '{0} seleccionados',
  showClear: false,
  fluid: true,
  minWidth: undefined,
  readonly: false,
  disabled: false,
  invalid: false,
  type: 'select',
});

const emit = defineEmits<AppMultiSelectEmits>();

const multiSelectRef = ref<{ $el?: HTMLElement; focus?: () => void }>();
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

const hasPrependIcon = computed<boolean>(() => {
  return Boolean(props.prependInnerIcon && props.showIcon);
});

const hasAppendIcon = computed<boolean>(() => {
  return Boolean(props.appendIcon && props.showIcon);
});

const isAppendIconClickable = computed<boolean>(() =>
  Boolean(props.appendIcon),
);

const labelMaxWidthClass = computed<string>(() => {
  if (hasAppendIcon.value) {
    return 'max-w-[calc(100%-4.5rem)]';
  }
  return 'max-w-[calc(100%-2.5rem)]';
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

const onUpdate = (value: unknown[] | null | undefined) => {
  if (props.readonly || props.disabled) return;
  emit('update:modelValue', value ?? []);
};

const clickSecondIcon = (event?: MouseEvent | KeyboardEvent) => {
  if (props.disabled || props.readonly) return;
  emit('click-end-icon', event);
};

const onFocus = (event: Event) => {
  isFocused.value = true;
  emit('focus', event);
};

const onBlur = (event: Event) => {
  isFocused.value = false;
  emit('blur', event);
};

const onChange = (event: MultiSelectChangeEvent) => {
  emit('change', event);
};

const onFilter = (event: MultiSelectFilterEvent) => {
  emit('filter', event);
};

const onSelectAllChange = (event: MultiSelectAllChangeEvent) => {
  emit('selectall-change', event);
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

defineExpose({
  focus: () => {
    const el = multiSelectRef.value?.$el?.querySelector<HTMLElement>(
      '.p-multiselect-label, [tabindex="0"], input',
    );
    el?.focus?.();
  },
  multiSelect: multiSelectRef,
});
</script>
