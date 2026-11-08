<template>
  <Stepper
    :value="active ?? ''"
    :linear="linear"
    :class="['w-full min-w-0 flex flex-col gap-6', props.class]"
    v-bind="$attrs"
    @update:value="onStepperUpdate"
  >
    <StepList
      class="grid! grid-cols-1! md:grid-flow-col! md:auto-cols-fr! gap-3 p-2 bg-surface-100 rounded-xl"
    >
      <Step
        v-for="(step, index) in visibleSteps"
        :key="step.value"
        v-slot="{ active: isActive, a11yAttrs }"
        :value="step.value"
        :disabled="step.disabled"
        as-child
      >
        <div
          v-bind="a11yAttrs.root"
          v-tooltip.bottom="step.tooltip"
          class="min-w-0 flex"
        >
          <button
            v-bind="a11yAttrs.header"
            type="button"
            :tabindex="step.disabled ? -1 : undefined"
            class="w-full flex items-center gap-3 p-3 rounded-lg text-left transition-all border min-w-0 disabled:cursor-not-allowed disabled:opacity-60"
            :class="headerClass(step, isActive)"
          >
            <slot
              :name="`step-${step.value}`"
              :step="step"
              :index="index"
              :active="isActive"
            >
              <span
                class="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 transition-colors"
                :class="circleClass(step, isActive)"
              >
                <i
                  v-if="step.invalid"
                  class="pi pi-exclamation-circle text-xs"
                  role="img"
                  aria-label="Con errores"
                />
                <i
                  v-else-if="step.completed && !isActive"
                  class="pi pi-check text-xs"
                />
                <i v-else-if="step.icon" :class="[step.icon, 'text-xs']" />
                <span v-else>{{ index + 1 }}</span>
              </span>
              <span class="flex flex-col min-w-0">
                <span class="text-xs font-bold truncate">{{ step.label }}</span>
                <span
                  v-if="step.description"
                  class="text-[11px] text-surface-500 truncate"
                >
                  {{ step.description }}
                </span>
              </span>
            </slot>
          </button>
        </div>
      </Step>
    </StepList>

    <StepPanels class="p-0! bg-transparent!">
      <StepPanel
        v-for="(step, index) in visibleSteps"
        :key="step.value"
        v-slot="{ active: isActive }"
        :value="step.value"
        class="bg-transparent! text-inherit!"
      >
        <slot
          :name="`panel-${step.value}`"
          v-bind="panelProps(step, index, isActive)"
        >
          <slot name="panel" v-bind="panelProps(step, index, isActive)" />
        </slot>
      </StepPanel>
    </StepPanels>
  </Stepper>
</template>

<script setup lang="ts">
import { computed, watch } from 'vue';
import { Step, StepList, StepPanel, StepPanels, Stepper } from 'primevue';

import type {
  AppStepperEmits,
  AppStepperExposed,
  AppStepperHeaderSlot,
  AppStepperItem,
  AppStepperPanelSlot,
  AppStepperPanelSlotProps,
  AppStepperProps,
  AppStepperValue,
} from '../interfaces/stepper.interface';

defineOptions({ name: 'AppStepper', inheritAttrs: false });

const props = withDefaults(defineProps<AppStepperProps>(), {
  class: '',
  linear: false,
});

const emit = defineEmits<AppStepperEmits>();

defineSlots<{
  /** Contenido genérico de panel */
  panel?: AppStepperPanelSlot;
  /** Contenido de un panel específico: `#panel-<value>` */
  [key: `panel-${string}`]: AppStepperPanelSlot | undefined;
  /** Cabecera personalizada de un paso: `#step-<value>` */
  [key: `step-${string}`]: AppStepperHeaderSlot | undefined;
}>();

/** Paso activo; funciona con v-model o sin él */
const active = defineModel<AppStepperValue>();

const visibleSteps = computed<AppStepperItem[]>(() =>
  props.steps.filter(step => step.visible !== false),
);

const indexOfStep = (value?: AppStepperValue): number =>
  visibleSteps.value.findIndex(step => step.value === value);

const onStepperUpdate = (value: AppStepperValue): void => {
  active.value = value;
};

// --- Navegación programática ------------------------------------------------

const goTo: AppStepperExposed['goTo'] = value => {
  const step = visibleSteps.value.find(item => item.value === value);
  if (!step || step.disabled) return false;
  active.value = step.value;
  return true;
};

const next: AppStepperExposed['next'] = () => {
  const currentIndex = indexOfStep(active.value);
  if (currentIndex < 0) return false;
  const target = visibleSteps.value[currentIndex + 1];
  return target ? goTo(target.value) : false;
};

const prev: AppStepperExposed['prev'] = () => {
  const currentIndex = indexOfStep(active.value);
  if (currentIndex <= 0) return false;
  const target = visibleSteps.value[currentIndex - 1];
  return target ? goTo(target.value) : false;
};

// --- Paso activo válido -----------------------------------------------------

watch(
  visibleSteps,
  steps => {
    if (!steps.some(step => step.value === active.value)) {
      active.value = steps[0]?.value;
    }
  },
  { immediate: true },
);

watch(active, (value, previousValue) => {
  if (value === undefined) return;
  emit('change', {
    value,
    previousValue,
    step: visibleSteps.value.find(step => step.value === value),
  });
});

// --- Estilos por estado (tokens obligatorios de AGENTS.md) ------------------

const headerClass = (step: AppStepperItem, isActive: boolean): string => {
  if (isActive) {
    return 'bg-white border-primary-500 shadow-xs text-primary-900';
  }
  if (step.invalid) {
    return 'bg-danger-50 border-danger-200 text-danger-700';
  }
  if (step.completed) {
    return 'bg-success-50 border-success-200 text-success-800';
  }
  return 'bg-transparent border-transparent text-surface-500';
};

const circleClass = (step: AppStepperItem, isActive: boolean): string => {
  if (isActive) {
    return 'bg-primary-600 text-white';
  }
  if (step.invalid) {
    return 'bg-danger-600 text-white';
  }
  if (step.completed) {
    return 'bg-success-600 text-white';
  }
  return 'bg-surface-300 text-surface-700';
};

const panelProps = (
  step: AppStepperItem,
  index: number,
  isActive: boolean,
): AppStepperPanelSlotProps => ({
  step,
  index,
  active: isActive,
  isFirst: index === 0,
  isLast: index === visibleSteps.value.length - 1,
  next,
  prev,
  goTo,
});

defineExpose<AppStepperExposed>({ next, prev, goTo });
</script>
