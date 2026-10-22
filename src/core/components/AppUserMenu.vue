<template>
  <div class="relative flex items-center">
    <button
      type="button"
      class="flex items-center justify-center rounded-full p-0.5 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-400 hover:opacity-90 transition-opacity"
      aria-haspopup="true"
      aria-expanded="false"
      aria-label="Menú de usuario"
      @click="toggleMenu"
    >
      <Avatar
        :image="avatarImage"
        shape="circle"
        size="large"
        class="border border-white/20 shadow-sm"
      />
    </button>

    <MenuPrime
      ref="menuRef"
      id="user_popup_menu"
      :model="menuModel"
      :popup="true"
      class="mt-2 min-w-48 shadow-lg"
    >
      <template #item="{ item, props }">
        <a
          v-ripple
          class="flex items-center gap-3 px-4 py-2.5 text-sm text-neutral-700 hover:bg-primary-50 hover:text-primary-900 transition-colors cursor-pointer"
          v-bind="props.action"
        >
          <i v-if="item.icon" :class="[item.icon, 'text-base text-primary-600']"></i>
          <span class="font-medium">{{ item.label }}</span>
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

const toggleMenu = (event: Event) => {
  menuRef.value?.toggle(event);
};

/**
 * Modelo de menú para el usuario.
 * Si el backend provee rutas hijas para el menú de usuario las mapeamos;
 * de lo contrario usamos las acciones esenciales predeterminadas.
 */
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

  // Fallback si no hay rutas de usuario dinámicas
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
