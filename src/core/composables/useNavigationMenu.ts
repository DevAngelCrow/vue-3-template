import { computed } from 'vue';
import { storeToRefs } from 'pinia';

import { useAuthStore } from '../store/useAuthStore';
import { normalizeRoute } from '../utils/routePermissions';
import type { Menu } from '../interfaces/userState.store.interface';
import type { NavigationItem } from '../interfaces/navigation.interface';

export interface NavigableMenuNode {
  uri?: string;
  to?: string;
  children?: NavigableMenuNode[];
  items?: NavigableMenuNode[];
}

const isNavigableDestination = (uri: string | undefined): boolean => {
  if (!uri) return false;
  const trimmed = uri.trim();
  return trimmed !== '' && trimmed !== '#' && trimmed !== '/';
};

export const isNavigationUriActive = (
  targetUri: string | undefined,
  currentPath: string,
): boolean => {
  if (!isNavigableDestination(targetUri)) return false;
  const normalizedTarget = normalizeRoute(targetUri!);
  const normalizedCurrent = normalizeRoute(currentPath);
  if (!normalizedTarget || !normalizedCurrent) return false;
  return (
    normalizedCurrent === normalizedTarget ||
    normalizedCurrent.startsWith(`${normalizedTarget}/`)
  );
};

export const hasActiveChild = (
  item: NavigableMenuNode,
  currentPath: string,
): boolean => {
  const subItems = item.children ?? item.items ?? [];
  for (const child of subItems) {
    const childSubItems = child.children ?? child.items ?? [];
    if (childSubItems.length > 0) {
      if (hasActiveChild(child, currentPath)) {
        return true;
      }
    } else if (isNavigationUriActive(child.uri ?? child.to, currentPath)) {
      return true;
    }
  }
  return false;
};

export const useNavigationMenu = () => {
  const { menuInfo } = storeToRefs(useAuthStore());

  const mapMenuItem = (item: Menu): NavigationItem | null => {
    const wasContainer = Boolean(item.children && item.children.length > 0);
    const mappedChildren = wasContainer
      ? item.children
          .filter(child => child.show !== false && child.active !== false)
          .sort((a, b) => (a.order || 0) - (b.order || 0))
          .map(mapMenuItem)
          .filter((child): child is NavigationItem => child !== null)
      : undefined;

    if (
      wasContainer &&
      (!mappedChildren || mappedChildren.length === 0) &&
      !isNavigableDestination(item.uri)
    ) {
      return null;
    }

    const finalChildren =
      mappedChildren && mappedChildren.length > 0 ? mappedChildren : undefined;

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
      children: finalChildren,
      items: finalChildren, // PrimeVue Menubar espera propiedad 'items'
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
        if (item.show === false || item.active === false) return false;
        if (!isRootRoute(item)) return false;
        if (isUserMenuRoute(item)) return false;
        return true;
      })
      .sort((a, b) => (a.order || 0) - (b.order || 0))
      .map(mapMenuItem)
      .filter((item): item is NavigationItem => item !== null);
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
      .filter(child => child.show !== false && child.active !== false)
      .sort((a, b) => (a.order || 0) - (b.order || 0))
      .map(mapMenuItem)
      .filter((item): item is NavigationItem => item !== null);
  });

  return {
    systemRoutes,
    userRoutes,
  };
};
