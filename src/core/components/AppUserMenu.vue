<template>
  <div class="relative flex items-center">
    <button
      type="button"
      class="flex items-center gap-2.5 p-1 pl-1.5 pr-2.5 rounded-full bg-white/5 hover:bg-white/15 border border-white/10 hover:border-white/25 transition-all duration-200 cursor-pointer shadow-xs group select-none"
      aria-haspopup="true"
      aria-expanded="false"
      aria-label="Menú de usuario"
      @click="toggleMenu"
    >
      <div class="relative flex items-center justify-center">
        <Avatar
          :image="avatarImage"
          shape="circle"
          size="normal"
          class="ring-2 ring-primary-400/50 shadow-xs"
        />
        <!-- Indicador de conexión online -->
        <span
          class="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-primary-400 ring-2 ring-primary-950"
        ></span>
      </div>

      <div class="hidden xl:flex flex-col text-left">
        <span
          class="text-xs font-semibold text-white tracking-tight leading-none group-hover:text-primary-200 transition-colors"
        >
          {{ currentUserName }}
        </span>
        <span
          class="text-[10px] text-primary-300/70 font-medium leading-none mt-1"
        >
          Activo
        </span>
      </div>

      <i
        class="pi pi-chevron-down text-[10px] text-primary-200/60 group-hover:text-white transition-colors ml-0.5"
      ></i>
    </button>

    <MenuPrime
      ref="menuRef"
      id="user_popup_menu"
      :model="menuModel"
      :popup="true"
      class="mt-2 min-w-64 p-2 shadow-2xl rounded-2xl border border-neutral-200/80 bg-white/95 backdrop-blur-md"
    >
      <template #start>
        <!-- Tarjeta de presentación del usuario actual -->
        <div
          class="flex items-center gap-3 p-3 bg-gradient-to-br from-primary-50 via-surface-50/40 to-primary-50/20 rounded-xl mb-1.5 border border-primary-100/70"
        >
          <div class="relative">
            <Avatar
              :image="avatarImage"
              shape="circle"
              size="large"
              class="ring-2 ring-primary-500/40 shadow-xs"
            />
            <span
              class="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-primary-500 ring-2 ring-white"
            ></span>
          </div>

          <div class="flex flex-col overflow-hidden">
            <span class="text-sm font-bold text-neutral-800 truncate">
              {{ currentUserName }}
            </span>
            <span class="text-xs text-neutral-500 truncate">
              Sesión activa
            </span>
            <span
              class="inline-block mt-1 text-[10px] font-semibold text-primary-700 bg-primary-100/80 px-2 py-0.5 rounded-full w-fit border border-primary-200/50"
            >
              Cuenta verificada
            </span>
          </div>
        </div>
      </template>

      <template #item="{ item, props }">
        <a
          v-ripple
          class="flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium text-neutral-700 hover:text-primary-950 hover:bg-primary-50/80 transition-all cursor-pointer group"
          v-bind="props.action"
        >
          <div class="flex items-center gap-2.5">
            <i
              v-if="item.icon"
              :class="[
                item.icon,
                'text-base text-neutral-400 group-hover:text-primary-600 transition-colors',
              ]"
            ></i>
            <span>{{ item.label }}</span>
          </div>
          <i
            class="pi pi-angle-right text-xs text-neutral-300 group-hover:text-primary-500 transition-colors"
          ></i>
        </a>
      </template>
    </MenuPrime>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { useRouter } from 'vue-router';
import { Avatar, Menu as MenuPrime } from 'primevue';

import { useAuth } from '@/modules/auth/composables/useAuth';

import { useAuthStore } from '../store/useAuthStore';
import { useNavigationMenu } from '../composables/useNavigationMenu';

defineOptions({ name: 'AppUserMenu' });

const router = useRouter();
const authStore = useAuthStore();
const { logout } = useAuth();
const { userRoutes } = useNavigationMenu();

const menuRef = ref<InstanceType<typeof MenuPrime>>();

const avatarImage = computed(
  () => authStore.profileImg || 'https://i.pravatar.cc/150',
);

const currentUserName = computed(() => {
  const user = authStore.user;
  if (typeof user === 'object' && user && 'user_name' in user) {
    return user.user_name;
  }
  return 'Usuario';
});

const toggleMenu = (event: Event) => {
  menuRef.value?.toggle(event);
};

const menuModel = computed(() => {
  if (userRoutes.value.length > 0) {
    return userRoutes.value.map(route => {
      const isLogout =
        route.name === 'cerrar-sesion' ||
        route.uri === '/auth/logout' ||
        route.uri?.includes('logout');

      return {
        label: route.label || route.title,
        icon: route.icon || (isLogout ? 'pi pi-sign-out' : 'pi pi-user'),
        command: () => {
          if (isLogout) {
            logout();
          } else if (route.uri) {
            router.push(route.uri);
          }
        },
      };
    });
  }

  return [
    {
      label: 'Mi perfil',
      icon: 'pi pi-user',
      command: () => router.push('/profile'),
    },
    {
      separator: true,
    },
    {
      label: 'Cerrar sesión',
      icon: 'pi pi-sign-out',
      command: () => logout(),
    },
  ];
});
</script>

<style scoped>
@reference "@/core/assets/style.css";
</style>
