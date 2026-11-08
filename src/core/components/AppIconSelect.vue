<template>
  <div :class="rootClass">
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
        @update:model-value="onUpdate"
        :invalid="computedInvalid"
        v-bind="$attrs"
        filter
        :filter-placeholder="filterPlaceholder"
        :filter-fields="['label', 'value', 'keywords', 'category']"
        :options="groupedOptions"
        option-group-label="category"
        option-group-children="items"
        option-label="label"
        option-value="value"
        :placeholder="displayPlaceholder"
        show-clear
        :disabled="disabled"
        :readonly="readonly"
        @focus="isFocused = true"
        @blur="isFocused = false"
        @show="onOuterSelectShow"
      >
        <!-- Header del desplegable: Select de PrimeVue para filtrar por Categoría -->
        <template #header>
          <div
            class="p-2 border-b border-surface-200 bg-surface-50 flex items-center gap-2"
            data-category-select="true"
            @pointerdown.stop
            @mousedown.stop
            @click.stop
          >
            <i class="pi pi-filter text-xs text-primary-600"></i>
            <span class="text-xs font-semibold text-surface-700 shrink-0"
              >Categoría:</span
            >
            <Select
              ref="categorySelectRef"
              v-model="selectedCategory"
              :options="categorySelectOptions"
              option-label="label"
              option-value="value"
              placeholder="Todas las Categorías"
              size="small"
              class="w-full text-xs"
              data-category-select="true"
              overlay-class="category-select-overlay"
              append-to="body"
              @before-show="onCategoryDropdownBeforeShow"
              @hide="onCategoryDropdownHide"
              @click.stop
            />
          </div>
        </template>

        <!-- Cabecera de grupo de categorías nativa de PrimeVue -->
        <template #optiongroup="slotProps">
          <div
            class="flex items-center gap-2 text-xs font-bold text-surface-700 uppercase tracking-wider py-1 px-1"
          >
            <i class="pi pi-folder text-primary-500 text-xs"></i>
            <span>{{ slotProps.option.category }}</span>
            <span class="text-[10px] text-surface-400 font-normal"
              >({{ slotProps.option.items.length }})</span
            >
          </div>
        </template>

        <!-- Preview de la opción seleccionada en el input cerrado -->
        <template #value="slotProps">
          <div
            v-if="slotProps.value"
            class="flex items-center gap-2 text-xs truncate"
          >
            <i
              :class="slotProps.value"
              class="text-base text-primary-600 font-bold shrink-0"
            ></i>
            <span class="font-medium text-surface-900 truncate">{{
              getIconLabel(slotProps.value)
            }}</span>
            <span
              class="text-[11px] text-surface-400 font-mono hidden sm:inline shrink-0"
              >({{ slotProps.value }})</span
            >
          </div>
          <span v-else class="text-surface-400 text-xs">{{
            displayPlaceholder
          }}</span>
        </template>

        <!-- Preview de cada fila en el menú desplegable -->
        <template #option="slotProps">
          <div class="flex items-center justify-between w-full py-1 gap-2">
            <div class="flex items-center gap-2.5 min-w-0">
              <div
                class="w-7 h-7 rounded bg-surface-100 flex items-center justify-center shrink-0 border border-surface-200"
              >
                <i
                  :class="slotProps.option.value"
                  class="text-base text-primary-600"
                ></i>
              </div>
              <div class="flex flex-col min-w-0">
                <span class="text-xs font-semibold text-surface-900 truncate">{{
                  slotProps.option.label
                }}</span>
                <span class="text-[10px] text-surface-400 font-mono truncate">{{
                  slotProps.option.value
                }}</span>
              </div>
            </div>
            <span
              class="text-[10px] font-medium px-1.5 py-0.5 rounded bg-surface-100 text-surface-600 border border-surface-200 shrink-0"
            >
              {{ slotProps.option.category }}
            </span>
          </div>
        </template>
      </Select>

      <label
        v-if="label"
        :class="[
          'truncate max-w-[calc(100%-2.5rem)] select-none cursor-pointer',
          { 'text-danger-600': computedInvalid },
        ]"
        :for="`${computedInputId}-select`"
        :title="label"
      >
        {{ label }}
      </label>
    </FloatLabel>

    <Message
      v-if="errorMessages && errorMessages.length"
      class="left-0 top-full mt-0 text-xs z-10"
      :severity="severity"
      :size="size"
      :variant="variant"
    >
      {{ errorMessages }}
    </Message>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, useId, onMounted, onUnmounted } from 'vue';
import { Select, FloatLabel, Message } from 'primevue';

import { ALL_PRIME_ICONS } from '../constants/primeicons.constants';
import {
  resolveInputRootClass,
  hasCustomMinWidth,
} from '../utils/inputClasses';

defineOptions({ inheritAttrs: false, name: 'AppIconSelect' });

const props = defineProps({
  modelValue: {
    type: String,
    default: '',
  },
  class: {
    type: String,
    default: '',
  },
  placeholder: {
    type: String,
    default: '',
  },
  filterPlaceholder: {
    type: String,
    default: 'Buscar icono (ej: mesa, audio, carpa, tag)...',
  },
  label: {
    type: String,
    default: 'Icono',
  },
  labelVariant: {
    type: String,
    default: 'on',
  },
  errorMessages: {
    type: String,
    default: '',
  },
  invalid: {
    type: Boolean,
    default: false,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  readonly: {
    type: Boolean,
    default: false,
  },
  id: {
    type: String,
    default: undefined,
  },
  inputId: {
    type: String,
    default: undefined,
  },
  minWidth: {
    type: String,
    default: undefined,
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
});

const emit = defineEmits<{
  (_e: 'update:modelValue', _value: string): void;
}>();

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

const selectRef = ref();
const categorySelectRef = ref();

const isFocused = ref(false);
const selectedCategory = ref<string>('ALL');
const isCategoryDropdownOpen = ref(false);

let lastDocumentClickWasCategory = false;
let originalHideFn: ((..._args: any[]) => void) | null = null;

const isClickOnCategorySelect = (target: EventTarget | null): boolean => {
  if (!target || !(target instanceof Element)) return false;
  try {
    return Boolean(
      target.closest('[data-category-select]') ||
      target.closest('.category-select-overlay'),
    );
  } catch {
    return false;
  }
};

const onDocumentPointerOrClick = (event: MouseEvent | TouchEvent) => {
  if (isClickOnCategorySelect(event.target)) {
    lastDocumentClickWasCategory = true;
  } else {
    lastDocumentClickWasCategory = false;
  }
};

const onCategoryDropdownBeforeShow = () => {
  isCategoryDropdownOpen.value = true;
  lastDocumentClickWasCategory = true;
};

const onCategoryDropdownHide = () => {
  // Grace period so any concurrent outside click checks from PrimeVue are safely ignored
  setTimeout(() => {
    isCategoryDropdownOpen.value = false;
    lastDocumentClickWasCategory = false;
  }, 200);
};

const wrapSelectHide = () => {
  if (!selectRef.value || typeof selectRef.value.hide !== 'function') return;
  if (!originalHideFn) {
    originalHideFn = selectRef.value.hide;
    selectRef.value.hide = function (...args: any[]) {
      // Si la interacción actual o el click es en el selector de categoría o sus opciones, NO cerrar el selector de iconos
      if (lastDocumentClickWasCategory || isCategoryDropdownOpen.value) {
        return;
      }
      return originalHideFn?.apply(this, args);
    };
  }
};

const onOuterSelectShow = () => {
  wrapSelectHide();
};

onMounted(() => {
  document.addEventListener('pointerdown', onDocumentPointerOrClick, true);
  document.addEventListener('mousedown', onDocumentPointerOrClick, true);
  document.addEventListener('click', onDocumentPointerOrClick, true);
  wrapSelectHide();
});

onUnmounted(() => {
  document.removeEventListener('pointerdown', onDocumentPointerOrClick, true);
  document.removeEventListener('mousedown', onDocumentPointerOrClick, true);
  document.removeEventListener('click', onDocumentPointerOrClick, true);
});

const computedInvalid = computed(() => {
  return Boolean(
    props.invalid || (props.errorMessages && props.errorMessages.length > 0),
  );
});

const displayPlaceholder = computed(() => {
  if (isFocused.value && props.label) {
    return props.placeholder;
  }
  if (!props.label.length) {
    return props.placeholder;
  }
  return undefined;
});

const availableCategories = computed(() => {
  const map: Record<string, number> = {};
  ALL_PRIME_ICONS.forEach(i => {
    map[i.category] = (map[i.category] || 0) + 1;
  });
  return Object.keys(map)
    .sort()
    .map(name => ({
      name,
      count: map[name],
    }));
});

const categorySelectOptions = computed(() => [
  { label: `Todas las Categorías (${ALL_PRIME_ICONS.length})`, value: 'ALL' },
  ...availableCategories.value.map(cat => ({
    label: `${cat.name} (${cat.count})`,
    value: cat.name,
  })),
]);

const groupedOptions = computed(() => {
  const filtered =
    selectedCategory.value === 'ALL'
      ? ALL_PRIME_ICONS
      : ALL_PRIME_ICONS.filter(i => i.category === selectedCategory.value);

  const groupsMap: Record<string, typeof ALL_PRIME_ICONS> = {};
  filtered.forEach(icon => {
    if (!groupsMap[icon.category]) {
      groupsMap[icon.category] = [];
    }
    groupsMap[icon.category].push(icon);
  });

  return Object.keys(groupsMap).map(category => ({
    category,
    items: groupsMap[category],
  }));
});

const getIconLabel = (val: string): string => {
  const found = ALL_PRIME_ICONS.find(i => i.value === val);
  return found?.label || val;
};

const onUpdate = (val: string | null | undefined) => {
  if (!props.readonly) {
    emit('update:modelValue', val || '');
    // Al seleccionar explícitamente un icono del listado, cerramos de inmediato el selector
    isCategoryDropdownOpen.value = false;
    lastDocumentClickWasCategory = false;
    if (selectRef.value) {
      if (originalHideFn) {
        originalHideFn.call(selectRef.value, true);
      } else if (typeof selectRef.value.hide === 'function') {
        selectRef.value.hide(true);
      }
    }
  }
};
</script>
