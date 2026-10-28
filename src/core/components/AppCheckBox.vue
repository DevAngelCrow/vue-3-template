<template>
  <div :class="['relative flex flex-col', props.class]">
    <div class="flex gap-2 items-center">
      <Checkbox
        v-bind="$attrs"
        :model-value="modelValue"
        @update:model-value="onUpdate"
        :input-id="resolvedInputId"
        :binary="binary"
        :readonly="readonly"
        :disabled="disabled"
        :invalid="invalid"
      />
      <label
        v-if="label"
        :for="resolvedInputId"
        :class="['cursor-pointer select-none', { 'text-danger-600': invalid }]"
      >
        {{ label }}
      </label>
    </div>
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
import { Checkbox, Message } from 'primevue';
import { computed, useId } from 'vue';

import type { AppCheckBoxProps } from '../interfaces';

defineOptions({ inheritAttrs: false, name: 'AppCheckBox' });

const props = withDefaults(defineProps<AppCheckBoxProps>(), {
  id: undefined,
  class: '',
  modelValue: false,
  binary: true,
  readonly: false,
  disabled: false,
  errorMessage: '',
  label: '',
});

const autoId = useId();
const resolvedInputId = computed(() => props.id || autoId);
const invalid = computed(() => Boolean(props.errorMessage?.length));

const emit = defineEmits<{
  'update:modelValue': [value: boolean | unknown[]];
}>();

const onUpdate = (value: boolean | unknown[]) => {
  if (!props.readonly && !props.disabled) {
    emit('update:modelValue', value);
  }
};
</script>
