<template>
  <div class="w-full px-0 sm:px-10 bg-primary-950">
    <Stepper :value="1">
      <StepItem v-for="(step, index) in steps" :key="index" :value="step">
        <Step>
          <span class="text-white hover:text-gray-300">{{
            components[index].header
          }}</span></Step
        >
        <StepPanel class="rounded-xl h-auto" v-slot="{ activateCallback }">
          <div
            class="flex flex-col h-auto w-full max-w-full flex-wrap justify-center items-center py-5 gap-6"
          >
            <component
              :is="components[index].component"
              v-bind="attrs"
              v-on="attrs"
              :ref="el => setComponentRefs(el, index)"
            />
            <div class="flex flex-row gap-6 flex-wrap justify-center">
              <Button
                v-if="step !== 1"
                label="Anterior"
                icon="pi pi-arrow-left"
                icon-pos="left"
                @click="customActivateCallBack(activateCallback, step, false)"
              ></Button>
              <Button
                v-if="step !== components.length"
                label="Siguiente"
                icon="pi pi-arrow-right"
                icon-pos="right"
                @click="customActivateCallBack(activateCallback, step, true)"
              ></Button>
            </div>
          </div>
        </StepPanel>
      </StepItem>
    </Stepper>
  </div>
</template>
<script setup lang="ts">
import { Stepper, StepItem, Step, StepPanel, Button } from 'primevue';
import { type PropType } from 'vue';
import { useAttrs, ref } from 'vue';

import type { StepperVerticalInterface } from '../interfaces/stepperVertical.interface';

defineOptions({ inheritAttrs: false });

defineEmits(); // No declares eventos específicos para permitir todos

const attrs = useAttrs();

const props = defineProps({
  steps: {
    type: Number,
    default: 1,
  },
  components: {
    type: Array as PropType<StepperVerticalInterface[]>,
    required: true,
  },
});

const componentRefs = ref();
const setComponentRefs = (element: any, index: number) => {
  if (element) {
    if (componentRefs.value) {
      componentRefs.value[index] = element;
    }
  }
};

const customActivateCallBack = (
  callback: Function,
  step: number,
  direction: boolean,
) => {
  if (step === 1 && props.components.length > 0 && direction) {
    callback(2);
    return;
  }
  if (direction) {
    callback(step + 1);
    return;
  } else {
    callback(step - 1);
    return;
  }
};

defineExpose({
  componentRefs,
});
</script>
<style scoped></style>
