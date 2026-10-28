<template>
  <div class="flex items-center">
    <Button
      type="button"
      variant="text"
      v-tooltip.bottom="'Buscar comando o módulo (Ctrl + K)'"
      class="flex items-center gap-2.5 px-2.5 sm:px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/15 border border-white/10 hover:border-white/25 text-primary-100 transition-all duration-200 cursor-pointer shadow-xs select-none"
      aria-label="Abrir menú de comandos"
      @click="openCommandMenu"
    >
      <i class="pi pi-search text-xs text-primary-300"></i>
      <span class="hidden lg:inline text-xs font-medium text-primary-100/90">
        Buscar...
      </span>
      <kbd
        class="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-semibold bg-primary-900/80 text-primary-200 rounded-md border border-primary-500/30 leading-none"
      >
        Ctrl K
      </kbd>
    </Button>

    <Dialog
      v-model:visible="isOpen"
      modal
      dismissable-mask
      :show-header="false"
      position="top"
      class="w-full max-w-xl mx-4 mt-16 rounded-2xl overflow-hidden border border-surface-200 shadow-2xl"
      :pt="{
        content: { class: 'p-0 bg-surface-0' },
      }"
      @show="onDialogShow"
    >
      <div ref="containerRef" class="w-full">
        <CommandMenu
          v-model:search="searchQuery"
          :model="commandGroups"
          placeholder="Escribe un comando o busca un módulo..."
          empty-message="No hay comandos disponibles."
          empty-filter-message="No se encontraron resultados para tu búsqueda."
          class="w-full border-none bg-surface-0"
          menu-class="max-h-80 overflow-y-auto p-2 border-none bg-transparent"
          :pt="{
            header: {
              class: 'px-4 py-3 border-b border-surface-200 bg-surface-0',
            },
            footer: {
              class: 'p-0 border-none',
            },
          }"
          @select="onSelectCommand"
        >
          <template #header="{ inputProps }">
            <div class="flex items-center gap-3 w-full">
              <i class="pi pi-search text-sm text-surface-400 shrink-0" />
              <input
                v-bind="inputProps"
                class="p-commandmenu-input flex-1 text-sm text-surface-800 bg-transparent border-none outline-none placeholder:text-surface-400"
              />
              <button
                v-if="searchQuery"
                type="button"
                class="text-surface-400 hover:text-surface-600 transition-colors cursor-pointer"
                aria-label="Limpiar búsqueda"
                @click="searchQuery = ''"
              >
                <i class="pi pi-times text-xs" />
              </button>
            </div>
          </template>

          <template #submenulabel="{ item }">
            <div
              class="px-3 pt-2.5 pb-1 text-[11px] font-bold uppercase tracking-wider text-surface-400 select-none"
            >
              {{ item.label }}
            </div>
          </template>

          <template #item="{ item, props, label }">
            <a
              v-ripple
              v-bind="props.action"
              class="flex items-center justify-between w-full px-3 py-2.5 rounded-xl text-sm text-surface-700 hover:bg-primary-50 hover:text-primary-950 transition-colors cursor-pointer group select-none"
            >
              <div class="flex items-center gap-2.5 min-w-0">
                <i
                  v-if="item.icon"
                  :class="[
                    item.icon,
                    'text-base text-primary-600 group-hover:text-primary-700 transition-colors shrink-0',
                  ]"
                />
                <div class="flex flex-col min-w-0">
                  <span
                    class="font-medium text-surface-800 group-hover:text-primary-950 truncate"
                  >
                    {{ label }}
                  </span>
                  <span
                    v-if="item.description"
                    class="text-xs text-surface-400 truncate"
                  >
                    {{ item.description }}
                  </span>
                </div>
              </div>

              <div class="flex items-center gap-2 shrink-0 ml-2">
                <span
                  v-if="item.uri"
                  class="hidden sm:inline-block text-[11px] text-surface-400 group-hover:text-primary-600 font-mono"
                >
                  {{ item.uri }}
                </span>
                <i
                  class="pi pi-arrow-right text-xs text-surface-300 group-hover:text-primary-600 transition-colors"
                />
              </div>
            </a>
          </template>

          <template #footer>
            <div
              class="flex items-center justify-between px-4 py-2.5 bg-surface-50 border-t border-surface-200 text-[11px] text-surface-500 select-none"
            >
              <div class="flex items-center gap-3">
                <span class="flex items-center gap-1">
                  <kbd
                    class="px-1.5 py-0.5 bg-surface-0 border border-surface-200 rounded text-[10px] font-semibold text-surface-600"
                  >
                    ↑↓
                  </kbd>
                  Navegar
                </span>
                <span class="flex items-center gap-1">
                  <kbd
                    class="px-1.5 py-0.5 bg-surface-0 border border-surface-200 rounded text-[10px] font-semibold text-surface-600"
                  >
                    ↵
                  </kbd>
                  Seleccionar
                </span>
              </div>
              <span class="flex items-center gap-1">
                <kbd
                  class="px-1.5 py-0.5 bg-surface-0 border border-surface-200 rounded text-[10px] font-semibold text-surface-600 cursor-pointer"
                  @click="isOpen = false"
                >
                  ESC
                </kbd>
                Cerrar
              </span>
            </div>
          </template>
        </CommandMenu>
      </div>
    </Dialog>
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { Button, Dialog } from 'primevue';
import CommandMenu, {
  type CommandMenuItem,
} from 'primevue/commandmenu';

import { useAuth } from '@/modules/auth/composables/useAuth';

import { useNavigationMenu } from '../composables/useNavigationMenu';
import type { NavigationItem } from '../interfaces/navigation.interface';

defineOptions({ name: 'AppCommandMenu' });

const router = useRouter();
const { logout } = useAuth();
const { systemRoutes, userRoutes } = useNavigationMenu();

const isOpen = ref(false);
const searchQuery = ref('');
const containerRef = ref<HTMLElement | null>(null);

const mapRouteToCommandItem = (
  route: NavigationItem,
  parentLabel?: string,
): CommandMenuItem => {
  const isLogout =
    route.name === 'cerrar-sesion' ||
    route.uri === '/auth/logout' ||
    Boolean(route.uri?.includes('logout'));

  const label = route.label || route.title || route.name || '';

  return {
    label,
    icon:
      route.icon ||
      (isLogout ? 'pi pi-sign-out' : 'pi pi-arrow-circle-right'),
    description: route.description,
    uri: isLogout ? undefined : route.uri,
    keywords: [
      label,
      route.name || '',
      route.uri || '',
      route.description || '',
      parentLabel || '',
    ].filter((term): term is string => Boolean(term)),
    command: async () => {
      isOpen.value = false;
      if (isLogout) {
        await logout();
      } else if (route.uri) {
        await router.push(route.uri);
      }
    },
  };
};

const collectLeafItems = (
  routes: NavigationItem[],
  parentLabel?: string,
): CommandMenuItem[] => {
  return routes.flatMap(route => {
    if (route.children && route.children.length > 0) {
      return collectLeafItems(
        route.children,
        route.label || route.title || parentLabel,
      );
    }
    return route.uri ? [mapRouteToCommandItem(route, parentLabel)] : [];
  });
};

const commandGroups = computed<CommandMenuItem[]>(() => {
  const groups: CommandMenuItem[] = [];
  const rootLeafItems: CommandMenuItem[] = [];

  for (const route of systemRoutes.value) {
    const groupLabel = route.label || route.title || route.name || 'Módulo';
    if (route.children && route.children.length > 0) {
      const childCommands = collectLeafItems(route.children, groupLabel);
      if (childCommands.length > 0) {
        groups.push({
          label: groupLabel,
          items: childCommands,
        });
      }
    } else if (route.uri) {
      rootLeafItems.push(mapRouteToCommandItem(route, 'Navegación'));
    }
  }

  if (rootLeafItems.length > 0) {
    groups.unshift({
      label: 'Navegación Principal',
      items: rootLeafItems,
    });
  }

  const accountItems: CommandMenuItem[] =
    userRoutes.value.length > 0
      ? userRoutes.value.map(route => mapRouteToCommandItem(route, 'Cuenta'))
      : [
          {
            label: 'Mi perfil',
            icon: 'pi pi-user',
            uri: '/profile',
            keywords: ['perfil', 'usuario', 'cuenta'],
            command: () => {
              isOpen.value = false;
              router.push('/profile');
            },
          },
          {
            label: 'Cerrar sesión',
            icon: 'pi pi-sign-out',
            keywords: ['salir', 'logout', 'cerrar sesion'],
            command: async () => {
              isOpen.value = false;
              await logout();
            },
          },
        ];

  if (accountItems.length > 0) {
    groups.push({
      label: 'Cuenta de Usuario',
      items: accountItems,
    });
  }

  return groups;
});

const openCommandMenu = () => {
  searchQuery.value = '';
  isOpen.value = true;
};

const onDialogShow = () => {
  nextTick(() => {
    const input = containerRef.value?.querySelector<HTMLInputElement>(
      '.p-commandmenu-input, input',
    );
    input?.focus();
  });
};

const onSelectCommand = () => {
  isOpen.value = false;
};

const handleGlobalKeydown = (event: KeyboardEvent) => {
  if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
    event.preventDefault();
    if (isOpen.value) {
      isOpen.value = false;
    } else {
      openCommandMenu();
    }
  }
};

onMounted(() => {
  window.addEventListener('keydown', handleGlobalKeydown);
});

onBeforeUnmount(() => {
  window.removeEventListener('keydown', handleGlobalKeydown);
});
</script>

<style scoped>
@reference "@/core/assets/style.css";
</style>
