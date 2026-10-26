<template>
  <footer
    class="w-full bg-gradient-to-r from-primary-950 via-primary-900 to-primary-950 border-t border-primary-500/20 shadow-[0_-4px_20px_color-mix(in_srgb,var(--p-primary-950)_25%,transparent)] backdrop-blur-md relative z-30 px-4 sm:px-6 py-3 md:py-2.5 flex flex-col md:flex-row items-center justify-between gap-3 text-xs"
  >
    <!-- Izquierda: Marca, Logo y Derechos de autor -->
    <div
      class="flex items-center gap-2.5 shrink-0 flex-wrap justify-center sm:justify-start"
    >
      <slot name="brand">
        <div
          class="w-6 h-6 rounded-lg bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center shadow-xs ring-1 ring-white/20 shrink-0"
        >
          <i class="pi pi-compass text-white text-xs"></i>
        </div>

        <div class="flex items-center gap-2 text-primary-200/80">
          <span class="font-bold text-white tracking-tight">
            {{ appName }}
          </span>
          <span class="text-primary-500/40 hidden sm:inline">|</span>
          <span class="text-primary-200/60 font-medium">
            &copy; {{ currentYear }}
          </span>
          <span class="text-primary-200/40 hidden lg:inline">
            &bull; Todos los derechos reservados
          </span>
        </div>
      </slot>
    </div>

    <!-- Centro: Espacio modular para inserción posterior vía slot -->
    <div class="flex-1 flex items-center justify-center min-w-0">
      <slot name="center">
        <slot />
      </slot>
    </div>

    <!-- Derecha: Espacio modular para inserción posterior vía slot -->
    <div class="flex items-center gap-3 shrink-0">
      <slot name="right">
        <slot name="status" />
      </slot>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { computed } from 'vue';

defineOptions({ name: 'AppFooter' });

withDefaults(
  defineProps<{
    appName?: string;
  }>(),
  {
    appName: 'Template App',
  },
);

const currentYear = computed(() => new Date().getFullYear());
</script>

<style scoped>
@reference "@/core/assets/style.css";
</style>
