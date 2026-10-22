import { computed } from 'vue';
import { storeToRefs } from 'pinia';

import { useAuthStore } from '../store/useAuthStore';
import type { Menu } from '../interfaces/userState.store.interface';
import type { NavigationItem } from '../interfaces/navigation.interface';

export const useNavigationMenu = () => {
  const { menuInfo } = storeToRefs(useAuthStore());

  const mapMenuItem = (item: Menu): NavigationItem => {
    const hasChildren = Boolean(item.children && item.children.length > 0);
    const mappedChildren = hasChildren
      ? item.children
          .filter(child => child.show !== false)
          .map(mapMenuItem)
      : undefined;

    return {
      id: item.id,
      label: item.title || item.name,
      title: item.title,
      name: item.name,
      icon: item.icon,
      uri: item.uri,
      to: item.uri,
      description: item.description,
      show: item.show,
      order: item.order,
      active: item.active,
      required_auth: item.required_auth,
      children: mappedChildren,
      items: mappedChildren, // PrimeVue Menubar espera propiedad 'items'
    };
  };

  const isUserMenuRoute = (item: Menu): boolean => {
    const lowerName = item.name?.toLowerCase() || '';
    const lowerTitle = item.title?.toLowerCase() || '';
    return (
      lowerName === 'usuario' ||
      lowerName === 'user' ||
      lowerTitle === 'usuario' ||
      item.uri === '/user'
    );
  };

  const isRootRoute = (item: Menu): boolean => {
    // Si parent es null o undefined, es una ruta raíz
    if (item.parent === null || item.parent === undefined) return true;
    if (Array.isArray(item.parent) && item.parent.length === 0) return true;
    return false;
  };

  /**
   * Rutas principales de navegación del sistema.
   * SOLO incluye elementos raíz (parent === null) con show === true,
   * y excluye el menú de cuenta de usuario (que pertenece al Avatar).
   */
  const systemRoutes = computed<NavigationItem[]>(() => {
    if (!menuInfo.value || !Array.isArray(menuInfo.value)) return [];

    return menuInfo.value
      .filter(item => {
        if (!item.show) return false;
        if (!isRootRoute(item)) return false;
        if (isUserMenuRoute(item)) return false;
        return true;
      })
      .map(mapMenuItem);
  });

  /**
   * Rutas de cuenta de usuario (Mi perfil, Cerrar sesión, etc.)
   * obtenidas dinámicamente de los hijos del nodo 'Usuario'.
   */
  const userRoutes = computed<NavigationItem[]>(() => {
    if (!menuInfo.value || !Array.isArray(menuInfo.value)) return [];

    const userMenu = menuInfo.value.find(item => isUserMenuRoute(item));
    if (!userMenu || !userMenu.children) return [];

    return userMenu.children
      .filter(child => child.show !== false)
      .map(mapMenuItem);
  });

  return {
    systemRoutes,
    userRoutes,
  };
};
