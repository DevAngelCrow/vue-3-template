<template>
  <header class="w-full h-full max-h-[70px] bg-primary flex items-center justify-between px-4 shadow-sm overflow-hidden flex-nowrap">
    <!-- Izquierda: Botón Hamburguesa (si hay overflow o en móvil) y Brand -->
    <div class="flex items-center gap-3 shrink-0">
      <Button
        v-if="showHamburger"
        id="btn-toggle-sidebar"
        type="button"
        class="bg-transparent border-none text-white hover:text-white/80 p-2 flex items-center justify-center cursor-pointer"
        aria-label="Abrir menú de navegación"
        @click="toggleSidebar"
      >
        <i class="pi pi-bars text-xl"></i>
      </Button>

      <slot name="brand">
        <span class="font-bold text-white text-lg tracking-wide hidden sm:inline-block">
          Template App
        </span>
      </slot>
    </div>

    <!-- Centro / Derecha: Menú horizontal de navegación principal (Desktop) -->
    <div class="flex-1 flex justify-end items-center mr-3 overflow-hidden">
      <AppNavBarMenu />
    </div>

    <!-- Extremo Derecho: Avatar y menú de usuario -->
    <div class="flex items-center shrink-0">
      <AppUserMenu />
    </div>
  </header>
</template>

<script setup lang="ts">
import { computed, ref, onMounted, onBeforeUnmount } from 'vue';
import { Button } from 'primevue';

import { useLayoutStore } from '../store/useLayoutStore';
import AppNavBarMenu from './AppNavBarMenu.vue';
import AppUserMenu from './AppUserMenu.vue';

defineOptions({ name: 'AppHeader' });

const layoutStore = useLayoutStore();
const windowWidth = ref(typeof window !== 'undefined' ? window.innerWidth : 1200);

const handleResize = () => {
  windowWidth.value = window.innerWidth;
};

onMounted(() => {
  window.addEventListener('resize', handleResize);
});

onBeforeUnmount(() => {
  window.removeEventListener('resize', handleResize);
});

const isMobile = computed(() => windowWidth.value < 768);

const showHamburger = computed(() => {
  return isMobile.value || layoutStore.hasOverflow;
});

const toggleSidebar = () => {
  layoutStore.showSideBar(!layoutStore.sideBar);
};
</script>

<style scoped>
@reference "@/core/assets/style.css";
</style>
