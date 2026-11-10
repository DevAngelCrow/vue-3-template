<template>
  <nav class="h-full flex items-center min-w-0">
    <Menubar
      ref="menuBarRef"
      class="bg-transparent border-none p-0 h-full hidden md:flex items-center flex-nowrap"
      breakpoint="767px"
      :model="visibleItems"
    >
      <template #item="{ item, props, hasSubmenu, root }">
        <!-- Enlaces directos navegables (sin submenú en raíz, o ítems hoja en submenú) -->
        <router-link
          v-if="item.uri && !(root && hasSubmenu) && !hasSubmenu"
          v-slot="{ href, navigate, isActive }"
          :to="item.uri"
          custom
        >
          <!-- Ítem RAÍZ directo (Barra superior oscura) -->
          <a
            v-if="root"
            ripple
            :href="href"
            v-bind="props.action"
            :class="[
              'group flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-sm font-medium transition-all duration-200 whitespace-nowrap select-none cursor-pointer',
              isRootActive(item, isActive)
                ? 'bg-white/15 text-white shadow-xs border border-white/20 font-semibold'
                : 'text-primary-100/90 hover:text-white hover:bg-white/10 border border-transparent hover:border-white/10',
            ]"
            @click="navigate($event)"
          >
            <i
              v-if="item.icon"
              :class="[
                item.icon,
                'text-sm transition-colors',
                isRootActive(item, isActive)
                  ? 'text-primary-300'
                  : 'text-primary-300/80 group-hover:text-primary-200',
              ]"
            ></i>
            <span class="text-primary-100 group-hover:text-white">{{
              item.label
            }}</span>
          </a>

          <!-- Ítem SUBMENÚ hoja (Dentro del desplegable blanco flotante) -->
          <a
            v-else
            ripple
            :href="href"
            v-bind="props.action"
            :class="[
              'group flex items-center justify-between w-full px-3.5 py-2.5 rounded-xl text-sm font-medium transition-colors select-none cursor-pointer',
              isSubItemActive(item, isActive)
                ? 'bg-primary-100/80 text-primary-950 font-semibold'
                : 'text-surface-700 hover:text-primary-950 hover:bg-primary-50',
            ]"
            @click="navigate($event)"
          >
            <div class="flex items-center gap-2.5">
              <i
                v-if="item.icon"
                :class="[
                  item.icon,
                  'text-base transition-colors',
                  isSubItemActive(item, isActive)
                    ? 'text-primary-700'
                    : 'text-primary-600 group-hover:text-primary-700',
                ]"
              ></i>
              <span
                class="text-surface-800 group-hover:text-primary-950 font-medium"
              >
                {{ item.label }}
              </span>
            </div>
            <i
              class="pi pi-angle-right text-xs text-surface-300 group-hover:text-primary-500 transition-colors"
            ></i>
          </a>
        </router-link>

        <!-- Contenedores RAÍZ con submenú o sin URI navegable -->
        <a
          v-else-if="root"
          ripple
          v-bind="props.action"
          :class="[
            'group flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-sm font-medium transition-all duration-200 whitespace-nowrap select-none cursor-pointer',
            isRootActive(item, false)
              ? 'bg-white/15 text-white shadow-xs border border-white/20 font-semibold'
              : 'text-primary-100/90 hover:text-white hover:bg-white/10 border border-transparent hover:border-white/10',
          ]"
        >
          <i
            v-if="item.icon"
            :class="[
              item.icon,
              'text-sm transition-colors',
              isRootActive(item, false)
                ? 'text-primary-300'
                : 'text-primary-300/80 group-hover:text-primary-200',
            ]"
          ></i>
          <span class="text-primary-100 group-hover:text-white">{{
            item.label
          }}</span>
          <i
            v-if="hasSubmenu"
            class="pi pi-chevron-down ml-1.5 text-[10px] text-primary-200/70 transition-transform duration-200 group-hover:rotate-180"
          ></i>
        </a>

        <!-- Submenú contenedor o sin URI (incluye niveles N anidados) -->
        <a
          v-else
          ripple
          v-bind="props.action"
          :class="[
            'group flex items-center justify-between w-full px-3.5 py-2.5 rounded-xl text-sm font-medium transition-colors select-none cursor-pointer',
            isSubItemActive(item, false)
              ? 'bg-primary-100/80 text-primary-950 font-semibold'
              : 'text-surface-700 hover:text-primary-950 hover:bg-primary-50',
          ]"
        >
          <div class="flex items-center gap-2.5">
            <i
              v-if="item.icon"
              :class="[
                item.icon,
                'text-base transition-colors',
                isSubItemActive(item, false)
                  ? 'text-primary-700'
                  : 'text-primary-600 group-hover:text-primary-700',
              ]"
            ></i>
            <span class="text-surface-800 font-medium">{{ item.label }}</span>
          </div>
          <i
            v-if="hasSubmenu"
            class="pi pi-angle-right text-xs text-surface-400 group-hover:text-primary-500 transition-colors"
          ></i>
        </a>
      </template>
    </Menubar>
  </nav>
</template>

<script setup lang="ts">
import {
  ref,
  watch,
  nextTick,
  onMounted,
  onBeforeUnmount,
  type ComponentPublicInstance,
} from 'vue';
import { useRoute } from 'vue-router';
import { Menubar } from 'primevue';

import type { NavigationItem } from '../interfaces/navigation.interface';
import {
  hasActiveChild,
  isNavigationUriActive,
  type NavigableMenuNode,
  useNavigationMenu,
} from '../composables/useNavigationMenu';
import { useMobileViewport } from '../composables/useMobileViewport';
import { useLayoutStore } from '../store/useLayoutStore';

defineOptions({ name: 'AppNavBarMenu' });

const route = useRoute();
const { systemRoutes } = useNavigationMenu();
const { isMobile } = useMobileViewport();
const layoutStore = useLayoutStore();

const menuBarRef = ref<ComponentPublicInstance>();
const visibleItems = ref<NavigationItem[]>([]);
let navResizeObserver: ResizeObserver | null = null;

const isRootActive = (
  item: NavigableMenuNode,
  routerActive: boolean,
): boolean => {
  return (
    routerActive ||
    hasActiveChild(item, route.path) ||
    isNavigationUriActive(item.uri, route.path)
  );
};

const isSubItemActive = (
  item: NavigableMenuNode,
  routerActive: boolean,
): boolean => {
  return (
    routerActive ||
    isNavigationUriActive(item.uri, route.path) ||
    hasActiveChild(item, route.path)
  );
};

const checkWrapMenu = () => {
  if (isMobile.value) {
    visibleItems.value = [];
    layoutStore.setOverflowMenuItems(systemRoutes.value);
    return;
  }

  // Cargamos primero todas las rutas para medir su ancho
  visibleItems.value = [...systemRoutes.value];

  nextTick(() => {
    window.requestAnimationFrame(() => {
      const root = menuBarRef.value?.$el?.querySelector?.(
        '.p-menubar-root-list',
      ) as HTMLElement | null;

      const navContainer = menuBarRef.value?.$el
        ?.parentElement as HTMLElement | null;

      if (!root || !navContainer) {
        layoutStore.setOverflowMenuItems([]);
        return;
      }

      const availableWidth = navContainer.clientWidth;
      const children = Array.from(root.children) as HTMLElement[];
      let wrapIndex: number | null = null;
      let accumulatedWidth = 0;

      for (let i = 0; i < children.length; i++) {
        const itemWidth = children[i].offsetWidth || 140;
        accumulatedWidth += itemWidth + 8; // ancho del elemento + gap

        if (accumulatedWidth > availableWidth) {
          wrapIndex = i;
          break;
        }
      }

      if (wrapIndex !== null && wrapIndex < systemRoutes.value.length) {
        visibleItems.value = systemRoutes.value.slice(0, wrapIndex);
        layoutStore.setOverflowMenuItems(systemRoutes.value.slice(wrapIndex));
      } else {
        visibleItems.value = [...systemRoutes.value];
        layoutStore.setOverflowMenuItems([]);
      }
    });
  });
};

watch(
  () => systemRoutes.value,
  () => {
    checkWrapMenu();
  },
  { immediate: true },
);

watch(isMobile, () => {
  checkWrapMenu();
});

onMounted(() => {
  const navContainer = menuBarRef.value?.$el
    ?.parentElement as HTMLElement | null;
  if (navContainer && typeof ResizeObserver !== 'undefined') {
    navResizeObserver = new ResizeObserver(() => {
      checkWrapMenu();
    });
    navResizeObserver.observe(navContainer);
  }
  checkWrapMenu();
});

onBeforeUnmount(() => {
  navResizeObserver?.disconnect();
  navResizeObserver = null;
});
</script>

<style scoped>
@reference "@/core/assets/style.css";

/* Evita que los ítems del menubar se estiren y asegura el contexto de posicionamiento */
:deep(.p-menubar-root-list > li),
:deep(.p-menubar-root-list > .p-menuitem),
:deep(.p-menubar-root-list > .p-menubar-item) {
  flex: 0 0 auto !important;
  position: relative !important;
}

:deep(.p-menubar-root-list) {
  display: flex !important;
  align-items: center !important;
  flex-wrap: nowrap !important;
  gap: 0.25rem !important;
  background: transparent !important;
  border: none !important;
}

/* Anular fondos blancos y estilos por defecto de PrimeVue en la barra superior */
:deep(.p-menubar-root-list > .p-menubar-item > .p-menubar-item-content),
:deep(.p-menubar-root-list > .p-menubar-item.p-focus > .p-menubar-item-content),
:deep(.p-menubar-root-list > .p-menubar-item-active > .p-menubar-item-content) {
  background: transparent !important;
  color: inherit !important;
}

:deep(
  .p-menubar-root-list
    > .p-menubar-item
    > .p-menubar-item-content
    > .p-menubar-item-link
) {
  background: transparent !important;
}

/* Submenús flotantes alineados exactamente debajo de su botón respectivo */
:deep(.p-menubar-submenu) {
  position: absolute !important;
  top: 100% !important;
  left: 0 !important;
  right: auto !important;
  margin-top: 0.375rem !important;
  z-index: 9999 !important;
  border-radius: 1rem !important;
  border: 1px solid var(--p-surface-200) !important;
  background: var(--p-surface-0) !important;
  box-shadow:
    0 20px 25px -5px color-mix(in srgb, var(--p-primary-950) 15%, transparent),
    0 8px 10px -6px color-mix(in srgb, var(--p-primary-950) 10%, transparent) !important;
  padding: 0.375rem !important;
  min-width: 15rem !important;
}

:deep(.p-menubar-submenu .p-menubar-item-content) {
  background: transparent !important;
}

:deep(.p-menubar-submenu .p-menubar-item-link) {
  background: transparent !important;
}
</style>
