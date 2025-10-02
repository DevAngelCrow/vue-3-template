<template>
  <div
    class="w-full xs:mr-2 sm:w-[93%] md:w-full h-full border-none rounded-none"
  >
    <Menubar
      class="rounded-none bg-primary border-none h-full hidden md:flex"
      breakpoint="767px"
      :model="menuMapped"
      ref="menuBar"
    >
      <template #item="{ item, props, hasSubmenu, root }">
        <router-link
          v-if="item.url"
          v-slot="{ href, navigate }"
          :to="root && item.items?.length ? '' : item.url"
          custom
          class="flex items-center text-white hover:text-primary-950 group"
        >
          <a ripple :href="href" v-bind="props.action" @click="navigate">
            <i :class="`${item.icon} group-hover:text-primary-700`"></i>
            <span class="group-hover:text-primary-700">
              {{ item.label }}
            </span>
            <i
              v-if="hasSubmenu"
              :class="[
                'pi pi-angle-down ml-auto',
                { 'pi-angle-down': root, 'pi-angle-right': !root },
                'group-focus:text-primary-700',
                'group-active:text-primary-700',
                'group-hover:text-primary-700',
              ]"
            ></i>
          </a>
        </router-link>
      </template>
      <template #end>
        <div
          class="app-navbar-end hover:bg-surface-400 hover:scale-110 transform transition-all flex justify-center items-center pa-0 ma-0 rounded-full w-auto h-fauto"
          @click="toggle"
          aria-haspopup="true"
          aria-controls="overlay_menu"
        >
          <Avatar
            class="hover:scale-100 hover:px-1 hover:py-1 transform transition-all"
            image="https://i.pravatar.cc/150"
            shape="circle"
            alt="prueba"
            size="xlarge"
          />
          <MenuPrime
            class="mt-2"
            ref="popUp"
            id="overlay_menu"
            :popup="true"
            :model="menuUser"
          />
        </div>
      </template>
    </Menubar>
    <div
      class="hover:bg-surface-400 hover:scale-90 transform transition-all flex justify-center items-center rounded-full md:hidden aspect-square"
      @click="toggle"
      aria-haspopup="true"
      aria-controls="overlay_menu"
    >
      <Avatar
        class="hover:scale-110 hover:px-1 hover:py-1 transform transition-all"
        image="https://i.pravatar.cc/150"
        shape="circle"
        alt="prueba"
        size="xlarge"
      />
      <MenuPrime
        class="mt-2"
        ref="popUp"
        id="overlay_menu"
        :popup="true"
        :model="menuUser"
      />
    </div>
  </div>
</template>
<script setup lang="ts">
import {
  nextTick,
  onBeforeUnmount,
  onMounted,
  Ref,
  watch,
  type PropType,
} from 'vue';
import { ref } from 'vue';
import { Menubar, Avatar, Menu as MenuPrime } from 'primevue';

import type { MenuNavBar as MenuModel } from '../interfaces/menu.navbar.interface';
import { useAuthStore } from '../store/useAuthStore';

defineOptions({ name: 'AppNavBarMenu' });

const { menu } = defineProps({
  menu: {
    type: Array as PropType<MenuModel[]>,
    default: () => [],
  },
});

const menuMapped = ref<MenuModel[]>();
const menuAppsideBar = ref<MenuModel[]>();
const menuUser = ref<MenuModel[]>();
const popUp = ref<InstanceType<typeof MenuPrime>>();
const menuBar = ref<Ref>();
let observer: ResizeObserver | undefined;

const usagePercent = ref(0);
const usagePercentMenu = ref(0);
const hasWrap = ref(false);
const wrapIndex = ref<number | null>(null);

const useAuth = useAuthStore();

const toggle = (event: MouseEvent | KeyboardEvent) => {
  popUp.value?.toggle(event);
};

const mapperMenuUser = () => {
  if (menu.length) {
    menuUser.value = menu.filter(item => item.isUser);
    menuMapped.value = menu.filter(item => !item.isUser);
  }
};

const getNaturalContentWidth = (root: HTMLElement) => {
  const children = Array.from(root.children) as HTMLElement[];
  let total = 0;
  children.forEach(el => {
    const style = getComputedStyle(el);
    const margin =
      parseFloat(style.marginLeft || '0') +
      parseFloat(style.marginRight || '0');
    total += el.scrollWidth + margin;
  });
  return total;
};

const getUsagePercent = () => {
  const root = menuBar.value?.$el.querySelector(
    '.p-menubar-root-list',
  ) as HTMLElement;
  if (!root) return 0;

  const header = document.getElementById('app-header') as HTMLElement | null;
  const referenceWidth =
    header && header.clientWidth ? header.clientWidth : root.clientWidth;

  const naturalContentWidth = getNaturalContentWidth(root);

  const percentRef = (naturalContentWidth / referenceWidth) * 100;

  usagePercentMenu.value = (naturalContentWidth / root.clientWidth) * 100;

  usagePercent.value = percentRef;

  return percentRef;
};

const checkUsage = () => {
  const root = menuBar.value?.$el?.querySelector?.(
    '.p-menubar-root-list',
  ) as HTMLElement;
  if (!root) return;

  const percent = getUsagePercent();

  const children = Array.from(root.children) as HTMLElement[];
  let wrapped = false;
  let indexWrap: number | null = null;

  if (children.length > 0) {
    const firstTop = children[0].offsetTop;
    for (let i = 0; i < children.length; i++) {
      if (children[i].offsetTop !== firstTop) {
        wrapped = true;
        indexWrap = i; // aquí guardamos el índice del primer salto
        break;
      }
    }
  }

  hasWrap.value = wrapped;
  wrapIndex.value = indexWrap;

  console.log(
    `Ocupado(header): ${percent.toFixed(2)}% | Wrap: ${wrapped} | Primer salto en índice: ${indexWrap}`,
  );
};

watch(wrapIndex, val => {
  if (val !== null) {
    menuAppsideBar.value = menuMapped.value?.slice(val) || [];
    console.log('Ítems para el AppSideBar:', menuAppsideBar.value);
    //  useAuth.setMenuSideBar(menuAppsideBar.value);
    console.log(
      'El menú ha hecho wrap. Actualizando menú del sidebar.',
      menuMapped.value?.slice(0, val - 1),
    );
    useAuth.setMenu(menuMapped.value?.slice(0, val - 1));
    menuMapped.value = useAuth.menuInfo;
  } else {
    console.log('El menú no ha hecho wrap.');
  }
});

onMounted(async () => {
  mapperMenuUser();
  await nextTick();

  const root = menuBar.value?.$el.querySelector(
    '.p-menubar-root-list',
  ) as HTMLElement;
  const header = document.getElementById('app-header') as HTMLElement | null;
  if (root) {
    observer = new ResizeObserver(() => checkUsage());
    observer.observe(root);
    if (header) observer.observe(header);
  }

  setTimeout(checkUsage, 0);
});
onBeforeUnmount(() => {
  if (observer) observer.disconnect();
});
</script>
<style scoped>
@reference "@/core/assets/style.css";

/* Evitamos que los ítems del menubar se estiren */
:deep(.p-menubar-root-list > li),
:deep(.p-menubar-root-list > .p-menuitem),
:deep(.p-menubar-root-list > .p-menubar-item) {
  flex: 0 0 auto !important;
}

/* Aseguramos que el end slot no crezca */
:deep(.app-navbar-end) {
  flex: 0 0 auto !important;
  width: auto !important;
  height: auto !important;
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
