import type { Menu } from '../interfaces/userState.store.interface';

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

/**
 * Rutas que siempre están permitidas para cualquier usuario con sesión activa.
 */
export const ALWAYS_ALLOWED_AUTH_ROUTES = new Set([
  '/',
  '/dashboard',
  '/profile',
  '/test-view',
  '/not-found',
  '/forbidden',
]);

/**
 * Contenedores o categorías de agrupación de menú que no corresponden a vistas finales navegables.
 */
const GROUP_CONTAINERS = new Set(['/admin', '/catalogs', '/user', '/']);

/**
 * Recorre recursivamente el árbol de menús del usuario y extrae todos los URIs válidos.
 */
export const extractAllowedUris = (menus: Menu[]): Set<string> => {
  const allowed = new Set<string>();

  const traverse = (items: Menu[]) => {
    if (!Array.isArray(items)) return;
    for (const item of items) {
      if (
        item.uri &&
        typeof item.uri === 'string' &&
        item.uri.trim() !== '' &&
        item.uri !== '#' &&
        item.uri !== '/'
      ) {
        allowed.add(normalizeRoute(item.uri));
      }
      if (Array.isArray(item.children) && item.children.length > 0) {
        traverse(item.children);
      }
    }
  };

  traverse(menus);
  return allowed;
};

/**
 * Verifica si una ruta específica está autorizada para el usuario dado su árbol de menús.
 *
 * @param targetPath Ruta de destino solicitada por el usuario (to.path).
 * @param userMenus Lista de menús y submódulos autorizados para el usuario.
 * @returns true si el usuario tiene permiso explícito o la ruta es de acceso universal; false en caso contrario.
 */
export const isRouteAuthorized = (
  targetPath: string,
  userMenus: Menu[] | null | undefined,
): boolean => {
  const normalized = normalizeRoute(targetPath);

  // 1. Si está en la lista blanca de rutas base autorizadas para todo usuario autenticado
  if (ALWAYS_ALLOWED_AUTH_ROUTES.has(normalized)) {
    return true;
  }

  // 2. Si no hay menús cargados, denegar acceso por seguridad
  if (!userMenus || !Array.isArray(userMenus) || userMenus.length === 0) {
    return false;
  }

  const allowedUris = extractAllowedUris(userMenus);

  // 3. Coincidencia directa con URI autorizado
  if (allowedUris.has(normalized)) {
    return true;
  }

  // 4. Coincidencia jerárquica para submódulos o formularios de mantenimiento (ej: /admin/role/role-maintenance/:id)
  // Siempre que el prefijo pertenezca a un módulo permitido y no a un contenedor genérico
  for (const uri of allowedUris) {
    if (!GROUP_CONTAINERS.has(uri) && normalized.startsWith(`${uri}/`)) {
      return true;
    }
  }

  return false;
};
