<template>
  <Tabs
    :value="active ?? ''"
    :class="['w-full min-w-0', props.class]"
    :scrollable="scrollable"
    :lazy="tabsLazy"
    v-bind="$attrs"
    @update:value="onTabsUpdate"
  >
    <!-- Modo arreglo: AppTab genera cabeceras y paneles a partir de `tabs` -->
    <template v-if="hasTabs">
      <TabList>
        <Tab
          v-for="tab in visibleTabs"
          :key="tab.value"
          :value="tab.value"
          :disabled="tab.disabled"
        >
          <slot :name="`tab-${tab.value}`" :tab="tab">
            <span
              v-tooltip.bottom="tab.tooltip"
              :class="[
                'flex items-center gap-2',
                { 'pointer-events-auto': tab.disabled && tab.tooltip },
              ]"
            >
              <i v-if="tab.icon" :class="tab.icon" />
              <span>{{ tab.label }}</span>
              <Badge
                v-if="tab.badge !== undefined"
                :value="tab.badge"
                size="small"
              />
              <i
                v-if="tab.invalid"
                class="pi pi-exclamation-circle text-danger-600"
                role="img"
                aria-label="Con errores"
              />
            </span>
          </slot>
        </Tab>
      </TabList>
      <TabPanels>
        <TabPanel
          v-for="tab in visibleTabs"
          :key="tab.value"
          :value="tab.value"
        >
          <template v-if="renderPanel(tab)">
            <AppSkeleton
              v-if="isLoading(tab)"
              variant="text"
              :count="4"
              :loading="true"
            />
            <div
              v-else
              :class="['w-full motion-reduce:animate-none', animationClass]"
            >
              <slot :name="`panel-${tab.value}`" :tab="tab">
                <slot name="panel" :tab="tab" />
              </slot>
            </div>
          </template>
        </TabPanel>
      </TabPanels>
    </template>

    <!-- Modo slots: el desarrollador escribe TabList/Tab/TabPanels/TabPanel -->
    <slot v-else />
  </Tabs>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { Badge, Tab, TabList, TabPanel, TabPanels, Tabs } from 'primevue';

import AppSkeleton from './AppSkeleton.vue';
import type {
  AppTabAnimationPreset,
  AppTabEmits,
  AppTabExposed,
  AppTabItem,
  AppTabProps,
  AppTabSlot,
  AppTabValue,
} from '../interfaces/tab.interface';

defineOptions({ name: 'AppTab', inheritAttrs: false });

const props = withDefaults(defineProps<AppTabProps>(), {
  tabs: () => [],
  class: '',
  scrollable: true,
  lazy: true,
  keepAlive: false,
  syncQuery: false,
  loading: false,
  animation: 'slide-up',
});

const emit = defineEmits<AppTabEmits>();

defineSlots<{
  /** Modo slots (PrimeVue puro): TabList, Tab, TabPanels y TabPanel */
  default?: () => unknown;
  /** Contenido genérico de panel en modo arreglo */
  panel?: AppTabSlot;
  /** Contenido de un panel específico: `#panel-<value>` */
  [key: `panel-${string}`]: AppTabSlot | undefined;
  /** Cabecera personalizada de una pestaña: `#tab-<value>` */
  [key: `tab-${string}`]: AppTabSlot | undefined;
}>();

/** Pestaña activa; funciona con v-model o sin él */
const active = defineModel<AppTabValue>();

const route = useRoute();
const router = useRouter();

const visibleTabs = computed<AppTabItem[]>(() =>
  props.tabs.filter(tab => tab.visible !== false),
);
const selectableTabs = computed<AppTabItem[]>(() =>
  visibleTabs.value.filter(tab => !tab.disabled),
);
const hasTabs = computed<boolean>(() => visibleTabs.value.length > 0);

/** Tabs de PrimeVue exige value definido; '' equivale a ninguna pestaña activa */
const onTabsUpdate = (value: AppTabValue): void => {
  active.value = value;
};

/** Con keepAlive el ocultamiento lo gestiona AppTab, no el lazy de PrimeVue */
const tabsLazy = computed<boolean>(() =>
  hasTabs.value && props.keepAlive ? false : props.lazy,
);

// --- Sincronización con la URL (syncQuery) ---------------------------------

const queryKey = computed<string>(() =>
  props.syncQuery === true ? 'tab' : props.syncQuery || '',
);

const readQueryValue = (): AppTabValue | undefined => {
  if (!queryKey.value) return undefined;
  const raw = route.query[queryKey.value];
  const current = Array.isArray(raw) ? raw[0] : raw;
  if (!current) return undefined;
  if (!hasTabs.value) return current;
  return selectableTabs.value.find(tab => String(tab.value) === current)?.value;
};

const writeQuery = (value: AppTabValue, replace: boolean): void => {
  const key = queryKey.value;
  if (!key || route.query[key] === String(value)) return;
  const location = { query: { ...route.query, [key]: String(value) } };
  void (replace ? router.replace(location) : router.push(location));
};

// --- Pestaña activa válida --------------------------------------------------

/** Garantiza una pestaña activa válida (query > valor actual > primera habilitada) */
const ensureActive = (initial: boolean): void => {
  if (!hasTabs.value) return;
  if (initial) {
    const fromQuery = readQueryValue();
    if (fromQuery !== undefined) {
      active.value = fromQuery;
      return;
    }
  }
  if (selectableTabs.value.some(tab => tab.value === active.value)) return;
  active.value = selectableTabs.value[0]?.value;
};

ensureActive(true);
if (active.value !== undefined) writeQuery(active.value, true);
watch(selectableTabs, () => ensureActive(false));

watch(
  () => (queryKey.value ? route.query[queryKey.value] : undefined),
  () => {
    const fromQuery = readQueryValue();
    if (fromQuery !== undefined && fromQuery !== active.value) {
      active.value = fromQuery;
    }
  },
);

// --- Cambio de pestaña: evento change y URL ---------------------------------

watch(active, (value, previousValue) => {
  if (value === undefined) return;
  writeQuery(value, false);
  emit('change', {
    value,
    previousValue,
    tab: visibleTabs.value.find(tab => tab.value === value),
  });
});

// --- keepAlive: paneles visitados -------------------------------------------

const visited = ref(new Set<AppTabValue>());
watch(
  active,
  value => {
    if (value !== undefined) visited.value.add(value);
  },
  { immediate: true },
);

const renderPanel = (tab: AppTabItem): boolean =>
  !(props.lazy && props.keepAlive) || visited.value.has(tab.value);

// --- Loading ----------------------------------------------------------------

const isLoading = (tab: AppTabItem): boolean =>
  props.loading || Boolean(tab.loading);

// --- API pública ------------------------------------------------------------

const activate: AppTabExposed['activate'] = value => {
  if (!hasTabs.value) {
    active.value = value;
    return true;
  }
  const tab = selectableTabs.value.find(item => item.value === value);
  if (!tab) return false;
  active.value = tab.value;
  return true;
};

const activateFirstInvalid: AppTabExposed['activateFirstInvalid'] = () => {
  const tab = selectableTabs.value.find(item => item.invalid);
  return tab ? activate(tab.value) : false;
};

// --- Presets de animación Tailwind encajonados -----------------------------

const ANIMATION_PRESETS: Record<AppTabAnimationPreset, string> = {
  'slide-up':
    'animate-enter fade-in-0 slide-in-from-b-2 animate-duration-250 animate-ease-out animate-fill-both',
  'slide-left':
    'animate-enter fade-in-0 slide-in-from-r-3 animate-duration-250 animate-ease-out animate-fill-both',
  fade: 'animate-fadein animate-duration-200 animate-ease-out',
  scale:
    'animate-enter fade-in-0 zoom-in-95 animate-duration-200 animate-ease-out animate-fill-both',
};

const isAnimationPreset = (value: string): value is AppTabAnimationPreset =>
  Object.prototype.hasOwnProperty.call(ANIMATION_PRESETS, value);

const animationClass = computed<string>(() => {
  if (props.animation === false || props.animation === 'none') return '';
  if (typeof props.animation === 'string') {
    if (isAnimationPreset(props.animation)) {
      return ANIMATION_PRESETS[props.animation];
    }
    return props.animation;
  }
  return ANIMATION_PRESETS['slide-up'];
});

defineExpose<AppTabExposed>({ activate, activateFirstInvalid });
</script>
