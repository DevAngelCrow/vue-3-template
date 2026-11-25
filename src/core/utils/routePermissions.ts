import type { Menu } from '../interfaces/userState.store.interface';

export interface RouteAuthorizationTarget {
  path: string;
  hasParams?: boolean;
  parentUri?: string;
}

/**
 * Normaliza una ruta asegurando barra inicial, sin barra final y en minúsculas.
 */
export const normalizeRoute = (path: string): string => {
  if (!path) return '';
  const cleanPath = path.split('?')[0].split('#')[0].trim().toLowerCase();
  if (!cleanPath) return '/';
  const withLeading = cleanPath.startsWith('/') ? cleanPath : `/${cleanPath}`;
  return withLeading.length > 1 && withLeading.endsWith('/')
    ? withLeading.slice(0, -1)
    : withLeading;
};

const BASE_ALLOWED_AUTH_ROUTES = [
  '/',
  '/dashboard',
  '/profile',
  '/not-found',
  '/forbidden',
];

/**
 * Rutas esenciales del sistema siempre permitidas para cualquier usuario con sesión activa.
 * En desarrollo se habilita /test-view para la galería de componentes UI; en producción
 * las rutas funcionales se autorizan dinámicamente mediante el menú del backend (IAM).
 */
export const ALWAYS_ALLOWED_AUTH_ROUTES = new Set(
  import.meta.env.DEV
    ? [...BASE_ALLOWED_AUTH_ROUTES, '/test-view']
    : BASE_ALLOWED_AUTH_ROUTES,
);

const isNavigableLeafUri = (uri: string | null | undefined): uri is string => {
  if (!uri || typeof uri !== 'string') return false;
  const trimmed = uri.trim();
  return trimmed !== '' && trimmed !== '#' && trimmed !== '/';
};

/**
 * Recorre recursivamente el árbol de menús del usuario y extrae únicamente los URIs de rutas hoja navegables.
 */
export const extractAllowedUris = (menus: Menu[]): Set<string> => {
  const leafUris = new Set<string>();

  const traverse = (items: Menu[]) => {
    if (!Array.isArray(items)) return;
    for (const item of items) {
      const hasChildren =
        Array.isArray(item.children) && item.children.length > 0;
      if (hasChildren) {
        traverse(item.children);
      } else if (isNavigableLeafUri(item.uri)) {
        leafUris.add(normalizeRoute(item.uri));
      }
    }
  };

  traverse(menus);
  return leafUris;
};

/**
 * Verifica si una ruta específica está autorizada para el usuario dado su árbol de menús dinámico.
 *
 * @param target Ruta solicitada o descriptor con metadatos de parámetros / ruta padre.
 * @param userMenus Lista de menús y submódulos autorizados para el usuario provistos por el backend.
 * @returns true si el usuario tiene permiso explícito o la ruta es de acceso universal; false en caso contrario.
 */
export const isRouteAuthorized = (
  target: string | RouteAuthorizationTarget,
  userMenus: Menu[] | null | undefined,
): boolean => {
  const targetObj: RouteAuthorizationTarget =
    typeof target === 'string' ? { path: target } : target;
  const normalized = normalizeRoute(targetObj.path);

  // 1. Rutas utilitarias base del sistema
  if (ALWAYS_ALLOWED_AUTH_ROUTES.has(normalized)) {
    return true;
  }

  // 2. Sin menús cargados, denegar acceso por seguridad
  if (!userMenus || !Array.isArray(userMenus) || userMenus.length === 0) {
    return false;
  }

  const allowedLeafUris = extractAllowedUris(userMenus);

  // 3. Coincidencia exacta con una ruta hoja autorizada
  if (allowedLeafUris.has(normalized)) {
    return true;
  }

  // 4. Coincidencia declarativa por ruta padre (formularios de mantenimiento o vistas de detalle)
  if (targetObj.parentUri) {
    const normalizedParent = normalizeRoute(targetObj.parentUri);
    if (allowedLeafUris.has(normalizedParent)) {
      return true;
    }
  }

  // 5. Coincidencia jerárquica estricta solo para rutas con parámetros dinámicos (:id)
  if (targetObj.hasParams) {
    for (const uri of allowedLeafUris) {
      if (normalized.startsWith(`${uri}/`)) {
        return true;
      }
    }
  }

  return false;
};
