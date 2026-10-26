<template>
  <Drawer
    v-model:visible="isVisible"
    class="bg-white/95 backdrop-blur-xl border-r border-surface-200 shadow-2xl w-80 max-w-[85vw]"
    dismissable
    block-scroll
    :pt="{
      header: {
        class: 'hidden',
      },
      content: {
        class: 'p-0 h-full flex flex-col',
      },
    }"
  >
    <template #container="{ closeCallback }">
      <div
        class="flex flex-col h-full bg-gradient-to-b from-primary-50/30 via-white to-white"
      >
        <!-- Encabezado del Sidebar con estilo moderno y badge de marca -->
        <div
          class="flex items-center justify-between px-5 py-4 border-b border-surface-200/80 bg-gradient-to-r from-primary-950 via-primary-900 to-primary-950 text-white shrink-0 shadow-xs"
        >
          <div class="flex items-center gap-3">
            <div
              class="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center shadow-md shadow-primary-500/20 ring-1 ring-white/20"
            >
              <i class="pi pi-compass text-white text-base"></i>
            </div>
            <div class="flex flex-col">
              <span
                class="font-bold text-base tracking-tight text-white leading-tight"
              >
                Navegación
              </span>
              <span
                class="text-[11px] text-primary-200/70 font-medium leading-none mt-0.5"
              >
                Menú del sistema
              </span>
            </div>
          </div>

          <Button
            type="button"
            icon="pi pi-times"
            rounded
            variant="text"
            class="text-white/80 hover:text-white bg-white/10 hover:bg-white/20 w-8 h-8 rounded-full border border-white/10 p-0 flex items-center justify-center transition-all cursor-pointer"
            aria-label="Cerrar menú"
            @click="closeCallback"
          />
        </div>

        <!-- Contenido / Lista de enlaces con scroll estilizado -->
        <div class="flex-1 overflow-y-auto px-4 py-4 space-y-1">
          <AppMenuItemSideBar :mapped-menu="sidebarItems" />
        </div>

        <!-- Pie del Drawer con indicador de versión y estado -->
        <div
          class="p-3.5 border-t border-surface-200/80 bg-surface-50/80 flex items-center justify-between text-xs text-surface-500 shrink-0"
        >
          <span class="font-medium text-[11px]">Template Suite</span>
          <span
            class="flex items-center gap-1.5 text-[11px] font-semibold text-primary-700 bg-primary-100/70 px-2 py-0.5 rounded-full"
          >
            <span
              class="w-1.5 h-1.5 rounded-full bg-primary-500 animate-pulse"
            ></span>
            Sistema Activo
          </span>
        </div>
      </div>
    </template>
  </Drawer>
</template>

<script setup lang="ts">
import { computed, ref, onMounted, onBeforeUnmount, type PropType } from 'vue';
import { Button, Drawer } from 'primevue';

import { useLayoutStore } from '../store/useLayoutStore';
import { useNavigationMenu } from '../composables/useNavigationMenu';
import AppMenuItemSideBar from './AppMenuItemSideBar.vue';
import type { NavigationItem } from '../interfaces/navigation.interface';

defineOptions({ name: 'AppSideBar' });

const props = defineProps({
  menu: {
    type: Array as PropType<NavigationItem[]>,
    default: null,
  },
});

const layoutStore = useLayoutStore();
const { systemRoutes } = useNavigationMenu();
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

const isVisible = computed({
  get: () => layoutStore.sideBar,
  set: (val: boolean) => layoutStore.showSideBar(val),
});

const sidebarItems = computed<NavigationItem[]>(() => {
  if (props.menu) {
    return props.menu;
  }
  if (isMobile.value) {
    return systemRoutes.value;
  }
  return layoutStore.overflowMenuItems;
});
</script>

<style scoped>
@reference "@/core/assets/style.css";
</style>
