<template>
  <div v-if="loading" :class="rootClass">
    <!-- Variante Table Compuesta -->
    <template v-if="variant === 'table'">
      <div
        class="w-full flex flex-col overflow-hidden border border-surface-200 dark:border-surface-700 rounded-md bg-surface-0 dark:bg-surface-900 shadow-xs"
      >
        <!-- Encabezados de Columna -->
        <div
          class="flex items-center border-b border-surface-200 dark:border-surface-700 bg-surface-50 dark:bg-surface-800/60 py-3.5 px-4 gap-4"
        >
          <div
            v-for="(col, colIdx) in tableColumns"
            :key="'th-' + colIdx"
            :style="col.style"
            :class="['flex', col.alignClass]"
          >
            <Skeleton
              :width="col.headerWidth"
              height="1.1rem"
              border-radius="0.25rem"
              :animation="animation"
            />
          </div>
        </div>

        <!-- Filas del Cuerpo (Tbody) -->
        <div class="divide-y divide-surface-200 dark:divide-surface-700">
          <div
            v-for="rowIdx in tableRowsCount"
            :key="'tr-' + rowIdx"
            class="flex items-center py-3.5 px-4 gap-4 hover:bg-surface-50/50 dark:hover:bg-surface-800/30 transition-colors"
          >
            <div
              v-for="(col, colIdx) in tableColumns"
              :key="'td-' + rowIdx + '-' + colIdx"
              :style="col.style"
              :class="['flex', col.alignClass]"
            >
              <!-- Inferencia según tipo de columna -->
              <template v-if="col.type === 'actions'">
                <div class="flex items-center gap-1.5 justify-center">
                  <Skeleton
                    v-for="btnIdx in 3"
                    :key="btnIdx"
                    shape="circle"
                    size="2rem"
                    :animation="animation"
                  />
                </div>
              </template>
              <template v-else-if="col.type === 'chip'">
                <Skeleton
                  width="4.5rem"
                  height="1.5rem"
                  border-radius="9999px"
                  :animation="animation"
                />
              </template>
              <template v-else-if="col.type === 'avatar'">
                <Skeleton
                  shape="circle"
                  size="2.25rem"
                  :animation="animation"
                />
              </template>
              <template v-else>
                <Skeleton
                  :width="getCellWidth(rowIdx, colIdx)"
                  height="1rem"
                  border-radius="0.25rem"
                  :animation="animation"
                />
              </template>
            </div>
          </div>
        </div>

        <!-- Simulación del Paginador Inferior -->
        <div
          v-if="showPaginator"
          class="flex items-center justify-between border-t border-surface-200 dark:border-surface-700 py-3 px-4 bg-surface-50/50 dark:bg-surface-800/40"
        >
          <div class="flex items-center gap-2">
            <Skeleton
              width="4.5rem"
              height="1.75rem"
              border-radius="0.375rem"
              :animation="animation"
            />
            <Skeleton
              width="6rem"
              height="1rem"
              border-radius="0.25rem"
              :animation="animation"
            />
          </div>
          <div class="flex items-center gap-1.5">
            <Skeleton shape="circle" size="2rem" :animation="animation" />
            <Skeleton shape="circle" size="2rem" :animation="animation" />
            <Skeleton shape="circle" size="2rem" :animation="animation" />
            <Skeleton shape="circle" size="2rem" :animation="animation" />
          </div>
        </div>
      </div>
    </template>

    <!-- Variante Card Compuesta -->
    <template v-else-if="variant === 'card'">
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
  <slot v-else-if="hasSlotContent" />
</template>

<script setup lang="ts">
import { computed, useSlots, type CSSProperties } from 'vue';
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
  rows = 5,
  columns = 4,
  headers = [],
  showPaginator = true,
  class: customClass = '',
} = defineProps<AppSkeletonProps>();

const slots = useSlots();
const hasSlotContent = computed(() => Boolean(slots.default));

const safeCount = computed(() => Math.max(1, count || 1));
const actionsCount = computed(() => (count && count > 1 ? count : 3));

const tableRowsCount = computed(() => {
  if (rows && rows > 0) return rows;
  if (count && count > 1) return count;
  return 5;
});

interface ProcessedColumn {
  style: CSSProperties;
  alignClass: string;
  headerWidth: string;
  type: 'text' | 'chip' | 'actions' | 'avatar';
}

const tableColumns = computed<ProcessedColumn[]>(() => {
  if (headers && headers.length > 0) {
    return headers.map(h => {
      const colWidth =
        typeof h.width === 'number'
          ? `${h.width}%`
          : h.width
            ? String(h.width)
            : 'auto';
      const fieldLower = (h.field || '').toLowerCase();
      let type: 'text' | 'chip' | 'actions' | 'avatar' = 'text';

      if (fieldLower.includes('accion') || fieldLower.includes('action')) {
        type = 'actions';
      } else if (
        fieldLower.includes('active') ||
        fieldLower.includes('status') ||
        fieldLower.includes('estado')
      ) {
        type = 'chip';
      } else if (
        fieldLower.includes('avatar') ||
        fieldLower.includes('image') ||
        fieldLower.includes('foto') ||
        fieldLower.includes('flag')
      ) {
        type = 'avatar';
      }

      const align = h.alignItems || h.alignHeaders || 'start';
      const alignClass =
        align === 'center'
          ? 'justify-center text-center'
          : align === 'end'
            ? 'justify-end text-end'
            : 'justify-start text-start';

      return {
        style:
          colWidth !== 'auto'
            ? { width: colWidth, flexShrink: '0' }
            : { flex: '1 1 0%' },
        alignClass,
        headerWidth:
          type === 'actions' ? '4rem' : type === 'chip' ? '3.5rem' : '5rem',
        type,
      };
    });
  }

  const colCount = Math.max(1, columns || 4);
  return Array.from({ length: colCount }, (_, idx) => {
    const isLast = idx === colCount - 1;
    const isPenultimate = idx === colCount - 2;
    let type: 'text' | 'chip' | 'actions' | 'avatar' = 'text';
    if (isLast && colCount > 2) type = 'actions';
    else if (isPenultimate && colCount > 3) type = 'chip';

    return {
      style: { flex: '1 1 0%' },
      alignClass:
        type === 'actions' || type === 'chip'
          ? 'justify-center text-center'
          : 'justify-start text-start',
      headerWidth: '4.5rem',
      type,
    };
  });
});

const cellWidths = ['60%', '75%', '90%', '50%', '80%', '70%'];
const getCellWidth = (rowIdx: number, colIdx: number): string => {
  const hash = (rowIdx * 7 + colIdx * 11) % cellWidths.length;
  return cellWidths[hash];
};

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
    table: {
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
