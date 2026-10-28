<template>
  <div :class="['min-w-[150px]', 'relative', props.class || 'w-auto']">
    <FloatLabel :variant="labelVariant">
      <IconField class="w-full group">
        <InputIcon
          v-if="prependIcon"
          :class="[prependIcon, { 'text-danger-600': invalid }]"
        />
        <InputMask
          class="w-full"
          :model-value="modelValue"
          @update:model-value="onUpdate"
          :invalid="invalid"
          v-bind="$attrs"
          :autocomplete="autocomplete"
          :placeholder="displayPlaceholder"
          :id="resolvedInputId"
          @focus="isFocused = true"
          @blur="isFocused = false"
          :mask="primeMask"
          :variant="variant"
          :size="size"
          :fluid="fluid"
          :disabled="disabled"
          :readonly="readonly"
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
import { InputMask, InputIcon, Message, IconField, FloatLabel } from 'primevue';

import type { AppInputMaskProps } from '../interfaces';

defineOptions({ inheritAttrs: false, name: 'AppInputMask' });

const props = withDefaults(defineProps<AppInputMaskProps>(), {
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
  autocomplete: 'off',
  label: '',
  id: undefined,
  disabled: false,
  readonly: false,
  mask: '',
});

const emit = defineEmits<{
  'update:modelValue': [value: string];
  'click-append-icon': [];
}>();

const autoId = useId();
const resolvedInputId = computed(() => props.id || autoId);

const invalid = computed(() => Boolean(props.errorMessage?.length));
const isFocused = ref<boolean>(false);

const onUpdate = (value: string | undefined) => {
  emit('update:modelValue', value ?? '');
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

const primeMask = computed(() => {
  if (isFocused.value || !props.label.length || props.modelValue?.length) {
    return props.mask;
  }
  return '';
});
</script>
