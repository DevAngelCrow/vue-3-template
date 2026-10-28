<template>
  <div :class="['min-w-[150px]', 'relative', props.class || 'w-auto']">
    <FloatLabel :variant="labelVariant">
      <IconField class="w-full group">
        <InputIcon
          v-if="prependIcon"
          :class="[prependIcon, { 'text-danger-600': invalid }]"
        />
        <InputText
          class="w-full"
          :type="typeInputLocal"
          :model-value="modelValue"
          @update:model-value="onUpdate"
          :invalid="invalid"
          v-bind="$attrs"
          :autocomplete="autocomplete"
          :placeholder="displayPlaceholder"
          :id="resolvedInputId"
          @focus="isFocused = true"
          @blur="isFocused = false"
          :variant="variant"
          :size="size"
          :fluid="fluid"
          :disabled="disabled"
          :readonly="readonly"
        />
        <InputIcon
          v-if="appendIconLocal"
          :class="[
            appendIconLocal,
            { 'text-danger-600': invalid },
            { 'cursor-pointer': type === 'password' || Boolean(appendIcon) },
          ]"
          @click="clickAppendIcon"
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
import { ref, computed, watch, useId } from 'vue';
import { InputText, InputIcon, Message, IconField, FloatLabel } from 'primevue';

import type { AppInputTextProps } from '../interfaces';

defineOptions({ inheritAttrs: false, name: 'AppInputText' });

const props = withDefaults(defineProps<AppInputTextProps>(), {
  modelValue: undefined,
  class: 'w-full max-w-[322px]',
  type: 'text',
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
});

const emit = defineEmits<{
  'update:modelValue': [value: string];
  'click-append-icon': [];
}>();

const autoId = useId();
const resolvedInputId = computed(() => props.id || autoId);

const invalid = computed(() => Boolean(props.errorMessage?.length));

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
    return props.placeholder || undefined;
  }
  if (!props.label.length) {
    return props.placeholder || undefined;
  }
  return undefined;
});

const clickAppendIcon = () => {
  if (props.type === 'password') {
    if (appendIconLocal.value === 'pi pi-eye') {
      appendIconLocal.value = 'pi pi-eye-slash';
      typeInputLocal.value = 'text';
    } else {
      appendIconLocal.value = 'pi pi-eye';
      typeInputLocal.value = 'password';
    }
  }
  emit('click-append-icon');
};

watch(
  () => props.appendIcon,
  newVal => {
    appendIconLocal.value =
      newVal || (props.type === 'password' ? 'pi pi-eye' : '');
  },
);

watch(
  () => props.type,
  newType => {
    typeInputLocal.value = newType;
    if (newType === 'password' && !props.appendIcon) {
      appendIconLocal.value = 'pi pi-eye';
    }
  },
);
</script>
