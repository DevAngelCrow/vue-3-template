<template>
  <nav class="h-full max-h-[70px] overflow-hidden flex items-center">
    <Menubar
      ref="menuBarRef"
      class="bg-transparent border-none p-0 h-full hidden md:flex items-center flex-nowrap"
      breakpoint="767px"
      :model="visibleItems"
    >
      <template #item="{ item, props, hasSubmenu, root }">
        <router-link
          v-if="item.uri"
          v-slot="{ href, navigate }"
          :to="root && item.items?.length ? '' : item.uri"
          custom
          class="flex items-center text-white hover:text-primary-950 group whitespace-nowrap"
        >
          <a
            ripple
            :href="href"
            v-bind="props.action"
            @click="hasSubmenu ? $event.preventDefault() : navigate($event)"
          >
            <i v-if="item.icon" :class="`${item.icon} group-hover:text-primary-700 mr-2`"></i>
            <span class="group-hover:text-primary-700 font-medium">
              {{ item.label }}
            </span>
            <i
              v-if="hasSubmenu"
              :class="[
                'pi ml-2 text-xs',
                root ? 'pi-angle-down' : 'pi-angle-right',
                'group-hover:text-primary-700',
              ]"
            ></i>
          </a>
        </router-link>
        <span
          v-else
          class="flex items-center text-white/90 px-3 py-2 cursor-default font-medium whitespace-nowrap"
        >
          <i v-if="item.icon" :class="`${item.icon} mr-2`"></i>
          {{ item.label }}
        </span>
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
import { Menubar } from 'primevue';

import type { NavigationItem } from '../interfaces/navigation.interface';
import { useNavigationMenu } from '../composables/useNavigationMenu';
import { useLayoutStore } from '../store/useLayoutStore';

defineOptions({ name: 'AppNavBarMenu' });

const { systemRoutes } = useNavigationMenu();
const layoutStore = useLayoutStore();

const menuBarRef = ref<ComponentPublicInstance>();
const visibleItems = ref<NavigationItem[]>([]);

const checkWrapMenu = () => {
  if (window.innerWidth < 768) {
    visibleItems.value = [];
    layoutStore.setOverflowMenuItems(systemRoutes.value);
    return;
  }

  // Primero probamos cargando todas las rutas principales
  visibleItems.value = [...systemRoutes.value];

  nextTick(() => {
    window.requestAnimationFrame(() => {
      const root = menuBarRef.value?.$el?.querySelector?.(
        '.p-menubar-root-list',
      ) as HTMLElement | null;

      if (!root) {
        layoutStore.setOverflowMenuItems([]);
        return;
      }

      const children = Array.from(root.children) as HTMLElement[];
      let wrapIndex: number | null = null;

      if (children.length > 1) {
        const firstTop = children[0].offsetTop;

        for (let i = 1; i < children.length; i++) {
          if (children[i].offsetTop > firstTop) {
            wrapIndex = i; // Encontramos el primer elemento que saltó de fila
            break;
          }
        }
      }

      if (wrapIndex !== null) {
        // Cortamos el menú visible para mantener estrictamente una sola fila
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
  { immediate: true, deep: true },
);

const handleResize = () => {
  checkWrapMenu();
};

onMounted(() => {
  window.addEventListener('resize', handleResize);
  checkWrapMenu();
});

onBeforeUnmount(() => {
  window.removeEventListener('resize', handleResize);
});
</script>

<style scoped>
@reference "@/core/assets/style.css";

/* Evita que los ítems del menubar se estiren */
:deep(.p-menubar-root-list > li),
:deep(.p-menubar-root-list > .p-menuitem),
:deep(.p-menubar-root-list > .p-menubar-item) {
  flex: 0 0 auto !important;
}

:deep(.p-menubar-root-list) {
  flex-wrap: wrap !important;
}

:deep(.p-menubar-item-active > .p-menubar-item-content > .p-menubar-item-link) {
  @apply text-primary transform transition-all;
}

:deep(
  .p-menubar-item.p-focus > .p-menubar-item-content > .p-menubar-item-link
) {
  @apply text-primary transform transition-all;
}

:deep(.p-menubar-submenu .p-menubar-item-link) {
  @apply text-primary;
}
</style>
