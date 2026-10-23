<template>
  <header
    class="w-full h-full min-h-[70px] bg-gradient-to-r from-primary-950 via-primary-900 to-primary-950 border-b border-primary-500/20 shadow-md shadow-primary-950/20 flex items-center justify-between px-4 sm:px-6 flex-nowrap backdrop-blur-md relative z-40"
  >
    <!-- Izquierda: Botón Hamburguesa y Marca/Logo -->
    <div class="flex items-center gap-3 shrink-0">
      <Button
        v-if="showHamburger"
        id="btn-toggle-sidebar"
        type="button"
        class="bg-white/5 hover:bg-white/15 text-white/90 hover:text-white p-2 rounded-xl transition-all duration-200 border border-white/10 shadow-xs flex items-center justify-center cursor-pointer"
        aria-label="Abrir menú de navegación"
        @click="toggleSidebar"
      >
        <i class="pi pi-bars text-lg"></i>
      </Button>

      <slot name="brand">
        <router-link
          to="/"
          class="flex items-center gap-2.5 group cursor-pointer no-underline select-none"
        >
          <div
            class="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center shadow-md shadow-primary-500/20 group-hover:scale-105 transition-transform duration-200 ring-1 ring-white/20 shrink-0"
          >
            <i class="pi pi-compass text-white text-base"></i>
          </div>
          <div class="hidden sm:flex flex-col">
            <div class="flex items-center gap-2">
              <span
                class="font-bold text-white text-base tracking-tight group-hover:text-primary-200 transition-colors"
              >
                Template
              </span>
              <span
                class="px-1.5 py-0.2 text-[10px] font-semibold uppercase tracking-wider rounded-md bg-primary-500/20 text-primary-300 border border-primary-500/30"
              >
                App
              </span>
            </div>
            <span
              class="text-[11px] text-primary-200/60 font-medium tracking-tight -mt-0.5"
            >
              Enterprise Portal
            </span>
          </div>
        </router-link>
      </slot>
    </div>

    <!-- Centro: Menú horizontal de navegación principal (Desktop) -->
    <div class="flex-1 flex justify-end items-center mx-4 min-w-0">
      <AppNavBarMenu />
    </div>

    <!-- Extremo Derecho: Menú y Perfil de Usuario -->
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
const windowWidth = ref(
  typeof window !== 'undefined' ? window.innerWidth : 1200,
);

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
