<template>
  <PickList
    class="w-full"
    v-model="internalValue"
    :data-key="dataKey"
    @update:model-value="onUpdated"
    v-bind="filteredAttrs"
    ref="pickListRef"
    :pt="{
      pcListbox: {
        root: {
          class: 'border-1 border-primary-950',
        },
      },
    }"
  >
    <template #option="{ option }">
      <div
        :ref="el => registerOptionRef(el, option)"
        :class="[
          'p-2 rounded transition-colors duration-300',
          highlightedOption === option ? 'bg-primary-200' : '',
        ]"
      >
        <slot name="option" :option="option">
          {{ getOptionLabel(option) }}
        </slot>
      </div>
    </template>
    <template #sourceheader>
      <slot name="sourceheader">
        <section id="header_app_pick_list" class="flex justify-start flex-col">
          <span>Disponibles</span>
          <AppInputText
            class="w-full"
            input-size="small"
            placeholder="Buscar..."
            v-model="findSourceElementValue"
            @update:model-value="highlightSourceElement"
          />
        </section>
      </slot>
    </template>
    <template #targetheader>
      <slot name="targetheader">
        <section id="header_app_pick_list" class="flex justify-start flex-col">
          <span>Seleccionados</span>
          <AppInputText
            class="w-full"
            input-size="small"
            placeholder="Buscar..."
          />
        </section>
      </slot>
    </template>
  </PickList>
</template>
<script setup lang="ts" generic="T">
import { PickList } from 'primevue';
import { computed, ref, useAttrs } from 'vue';

/**
 * Props genéricas
 * T = tipo de los elementos en las listas
 */
const props = defineProps<{
  modelValue: T[][];
  optionLabel?: keyof T | ((_item: T) => string);
  optionValue?: keyof T;
}>();

const attrs = useAttrs();

const filteredAttrs = computed(() => {
  const { 'data-key': _, ...rest } = attrs;
  return rest;
});

const findSourceElementValue = ref<string>('');
const highlightedOption = ref<T | null>(null);
const optionsRefs = new Map<T, HTMLElement>();

const registerOptionRef = (el: HTMLElement | null, option: T) => {
  if (el) optionsRefs.set(option, el);
};

const highlightSourceElement = () => {
  const searchValue = findSourceElementValue.value.trim().toLocaleLowerCase();
  if (!searchValue) return;

  const found = props.modelValue[0].find(item =>
    getOptionLabel(item).toLocaleLowerCase().includes(searchValue),
  );

  if (found) {
    highlightedOption.value = found;
    const el = optionsRefs.get(found);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });

    setTimeout(() => {
      highlightedOption.value = null;
    }, 1000);
  }
};

const emit = defineEmits(['update:modelValue']);
const onUpdated = (value: T[][]) => {
  return emit('update:modelValue', value);
};

const internalValue = computed<T[][]>({
  get: () => props.modelValue,
  set: value => emit('update:modelValue', value),
});

const getOptionLabel = (item: T): string => {
  const { optionLabel } = props;
  if (!item) return '';

  if (typeof optionLabel === 'function') {
    return optionLabel(item);
  }

  if (typeof optionLabel === 'string') {
    const key = optionLabel as keyof T;
    return String(item[key] ?? '');
  }
  return String(item);
};

const dataKey = computed(() =>
  props.optionValue ? String(props.optionValue) : undefined,
);

// const findSourceElements = (value: string | undefined) => {
//   let _filteredItems = [];
//   for (let i = 0; i < props.modelValue[0].length; i++) {
//     let item = props.modelValue[0][i];
//     if (item?.name.toLowerCase().indexOf(value?.toLocaleLowerCase()) === 0) {
//       _filteredItems.push(item);
//     }
//     findSourceElementValue.array_copy_vmodel_values = _filteredItems;
//     console.log(findSourceElementValue.array_copy_vmodel_values);
//   }
//   console.log(value);
// };
</script>
<style scoped>
.bg-primary-100 {
  background-color: rgba(59, 130, 246, 0.2); /* azul suave */
  transition: background-color 0.3s ease;
}
</style>
