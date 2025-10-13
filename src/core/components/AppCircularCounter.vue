<template>
  <div class="w-full h-full flex justify-center items-center">
    <div class="relative" :style="{ width: '50%', aspectRatio: '1' }">
      <svg class="w-full h-full" viewBox="0 0 200 200">
        <circle
          cx="100"
          cy="100"
          r="90"
          fill="none"
          stroke="#e5e7eb"
          stroke-width="20"
        />

        <circle
          cx="100"
          cy="100"
          r="90"
          fill="none"
          :stroke="resolvedColor"
          stroke-width="20"
          :stroke-dasharray="circumference"
          :stroke-dashoffset="strokeDashoffset"
          stroke-linecap="round"
          style="
            transition: stroke-dashoffset 0.3s ease-in-out;
            transform: rotate(-90deg);
            transform-origin: 100px 100px;
          "
        />
      </svg>

      <div class="absolute inset-0 flex justify-center items-center">
        <div
          class="rounded-full bg-white w-[80%] h-[80%] flex justify-center items-center"
        >
          <span class="text-[10px] font-semibold"
            >{{ selected }} / {{ total }}</span
          >
        </div>
      </div>
    </div>
    <!-- <span class="lg:hidden text-[10px] font-semibold">{{ selected }} / {{ total }}</span> -->
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const { total, selected, color } = defineProps<{
  total: number;
  selected: number;
  color?: string;
}>();

const radius = 90;
const circumference = computed(() => 2 * Math.PI * radius);
//const progress = computed(() => (selected / total) * 100)
const strokeDashoffset = computed(
  () => circumference.value - (selected / total) * circumference.value,
);

const resolvedColor = computed(() => {
  const col = color;
  if (col?.startsWith('#') || col?.startsWith('rgb')) {
    return col;
  }
  const element = document.documentElement;
  const style = getComputedStyle(element);
  const varName = `--color-${col}`;
  const value = style.getPropertyValue(varName).trim();
  return value ? `rgb(${value})` : '#000000';
});
</script>

<style scoped></style>
