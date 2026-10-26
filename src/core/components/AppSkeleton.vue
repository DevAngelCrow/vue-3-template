<template>
  <!-- Modo Wrapper: si contiene contenido en el slot por defecto -->
  <template v-if="hasSlotContent">
    <div v-if="loading" :class="rootClass">
      <!-- Variante Card Compuesta -->
      <template v-if="variant === 'card'">
        <div
          v-for="(_, cardIndex) in safeCount"
          :key="cardIndex"
          class="p-4 border border-surface-200 dark:border-surface-700 rounded-lg flex flex-col gap-3 w-full"
        >
          <div class="flex items-center gap-3">
            <Skeleton shape="circle" size="3rem" :animation="animation" />
            <div class="flex-1 flex flex-col gap-2">
              <Skeleton
                width="50%"
                height="1.125rem"
                border-radius="0.25rem"
                :animation="animation"
              />
              <Skeleton
                width="30%"
                height="0.875rem"
                border-radius="0.25rem"
                :animation="animation"
              />
            </div>
          </div>
          <div class="flex flex-col gap-2 mt-1">
            <Skeleton
              width="100%"
              height="0.875rem"
              border-radius="0.25rem"
              :animation="animation"
            />
            <Skeleton
              width="90%"
              height="0.875rem"
              border-radius="0.25rem"
              :animation="animation"
            />
            <Skeleton
              width="60%"
              height="0.875rem"
              border-radius="0.25rem"
              :animation="animation"
            />
          </div>
          <div class="flex justify-end gap-2 mt-2">
            <Skeleton
              width="5.5rem"
              height="2rem"
              border-radius="0.375rem"
              :animation="animation"
            />
          </div>
        </div>
      </template>

      <!-- Variante Acciones (Botones circulares agrupados) -->
      <template v-else-if="variant === 'actions'">
        <div class="flex items-center gap-1.5">
          <Skeleton
            v-for="actionIndex in actionsCount"
            :key="actionIndex"
            shape="circle"
            :size="resolvedSize || '2rem'"
            :animation="animation"
          />
        </div>
      </template>

      <!-- Variantes Estándar (Único elemento) -->
      <template v-else-if="safeCount === 1">
        <Skeleton
          :shape="resolvedShape"
          :size="resolvedSize"
          :width="getItemWidth(0, 1)"
          :height="resolvedHeight"
          :border-radius="resolvedBorderRadius"
          :animation="animation"
        />
      </template>

      <!-- Variantes Estándar Repetidas (count > 1) -->
      <template v-else>
        <div :class="multiItemContainerClass">
          <Skeleton
            v-for="(_, itemIndex) in safeCount"
            :key="itemIndex"
            :shape="resolvedShape"
            :size="resolvedSize"
            :width="getItemWidth(itemIndex, safeCount)"
            :height="resolvedHeight"
            :border-radius="resolvedBorderRadius"
            :animation="animation"
          />
        </div>
      </template>
    </div>
    <slot v-else />
  </template>

  <!-- Modo Directo / Autónomo (sin slot) -->
  <template v-else>
    <div v-if="loading" :class="rootClass">
      <!-- Variante Card Compuesta -->
      <template v-if="variant === 'card'">
        <div
          v-for="(_, cardIndex) in safeCount"
          :key="cardIndex"
          class="p-4 border border-surface-200 dark:border-surface-700 rounded-lg flex flex-col gap-3 w-full"
        >
          <div class="flex items-center gap-3">
            <Skeleton shape="circle" size="3rem" :animation="animation" />
            <div class="flex-1 flex flex-col gap-2">
              <Skeleton
                width="50%"
                height="1.125rem"
                border-radius="0.25rem"
                :animation="animation"
              />
              <Skeleton
                width="30%"
                height="0.875rem"
                border-radius="0.25rem"
                :animation="animation"
              />
            </div>
          </div>
          <div class="flex flex-col gap-2 mt-1">
            <Skeleton
              width="100%"
              height="0.875rem"
              border-radius="0.25rem"
              :animation="animation"
            />
            <Skeleton
              width="90%"
              height="0.875rem"
              border-radius="0.25rem"
              :animation="animation"
            />
            <Skeleton
              width="60%"
              height="0.875rem"
              border-radius="0.25rem"
              :animation="animation"
            />
          </div>
          <div class="flex justify-end gap-2 mt-2">
            <Skeleton
              width="5.5rem"
              height="2rem"
              border-radius="0.375rem"
              :animation="animation"
            />
          </div>
        </div>
      </template>

      <!-- Variante Acciones (Botones circulares agrupados) -->
      <template v-else-if="variant === 'actions'">
        <div class="flex items-center gap-1.5">
          <Skeleton
            v-for="actionIndex in actionsCount"
            :key="actionIndex"
            shape="circle"
            :size="resolvedSize || '2rem'"
            :animation="animation"
          />
        </div>
      </template>

      <!-- Variantes Estándar (Único elemento) -->
      <template v-else-if="safeCount === 1">
        <Skeleton
          :shape="resolvedShape"
          :size="resolvedSize"
          :width="getItemWidth(0, 1)"
          :height="resolvedHeight"
          :border-radius="resolvedBorderRadius"
          :animation="animation"
        />
      </template>

      <!-- Variantes Estándar Repetidas (count > 1) -->
      <template v-else>
        <div :class="multiItemContainerClass">
          <Skeleton
            v-for="(_, itemIndex) in safeCount"
            :key="itemIndex"
            :shape="resolvedShape"
            :size="resolvedSize"
            :width="getItemWidth(itemIndex, safeCount)"
            :height="resolvedHeight"
            :border-radius="resolvedBorderRadius"
            :animation="animation"
          />
        </div>
      </template>
    </div>
  </template>
</template>

<script setup lang="ts">
import { computed, useSlots } from 'vue';
import { Skeleton } from 'primevue';

import type {
  AppSkeletonProps,
  SkeletonShape,
  SkeletonVariant,
} from '../interfaces/skeleton.interface';

defineOptions({ name: 'AppSkeleton' });

const {
  loading = true,
  variant = 'text',
  shape,
  size,
  width,
  height,
  borderRadius,
  animation = 'wave',
  count = 1,
  class: customClass = '',
} = defineProps<AppSkeletonProps>();

const slots = useSlots();
const hasSlotContent = computed(() => Boolean(slots.default));

const safeCount = computed(() => Math.max(1, count || 1));
const actionsCount = computed(() => (count && count > 1 ? count : 3));

interface VariantDefaults {
  shape: SkeletonShape;
  width?: string;
  height?: string;
  size?: string;
  borderRadius?: string;
}

const variantConfig = computed<Record<SkeletonVariant, VariantDefaults>>(
  () => ({
    text: {
      shape: 'rectangle',
      width: '100%',
      height: '1.15rem',
      borderRadius: '0.25rem',
    },
    title: {
      shape: 'rectangle',
      width: '60%',
      height: '1.75rem',
      borderRadius: '0.375rem',
    },
    avatar: {
      shape: 'circle',
      size: '2.5rem',
    },
    button: {
      shape: 'rectangle',
      width: '6rem',
      height: '2.25rem',
      borderRadius: '0.375rem',
    },
    chip: {
      shape: 'rectangle',
      width: '4.5rem',
      height: '1.5rem',
      borderRadius: '9999px',
    },
    input: {
      shape: 'rectangle',
      width: '100%',
      height: '2.625rem',
      borderRadius: '0.375rem',
    },
    card: {
      shape: 'rectangle',
      width: '100%',
      height: 'auto',
    },
    image: {
      shape: 'rectangle',
      width: '100%',
      height: '10rem',
      borderRadius: '0.5rem',
    },
    actions: {
      shape: 'circle',
      size: '2rem',
    },
    custom: {
      shape: 'rectangle',
      width: '100%',
      height: '1.25rem',
    },
  }),
);

const currentConfig = computed(
  () => variantConfig.value[variant] ?? variantConfig.value.text,
);

const resolvedShape = computed<SkeletonShape>(
  () => shape || currentConfig.value.shape,
);
const resolvedSize = computed<string | undefined>(
  () => size || currentConfig.value.size,
);
const resolvedHeight = computed<string | undefined>(() => {
  if (resolvedSize.value) return undefined;
  return height || currentConfig.value.height;
});
const resolvedBorderRadius = computed<string | undefined>(
  () => borderRadius || currentConfig.value.borderRadius,
);

const getItemWidth = (index: number, total: number): string | undefined => {
  if (resolvedSize.value) return undefined;
  if (width) return width;

  // Si es un bloque de texto multi-línea, variar los anchos para simular un párrafo natural
  if (variant === 'text' && total > 1) {
    if (index === total - 1) return '60%';
    if (index % 2 === 1) return '90%';
    return '100%';
  }

  return currentConfig.value.width;
};

const rootClass = computed(() => {
  const isInline =
    variant === 'chip' || variant === 'avatar' || variant === 'actions';
  return [isInline ? 'inline-flex' : 'flex w-full', customClass];
});

const multiItemContainerClass = computed(() => {
  if (variant === 'avatar') {
    return 'flex items-center gap-2';
  }
  return 'flex flex-col gap-2.5 w-full';
});
</script>

<style scoped></style>
