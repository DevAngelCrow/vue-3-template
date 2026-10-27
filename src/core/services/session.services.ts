import { useAuthStore } from '../store/useAuthStore';
import { refreshAccessToken } from '../utils/tokenRefresh';
import authServices from './auth.services';

let restorePromise: Promise<boolean> | null = null;

/**
 * Loads the user's menu (route permissions) and profile image into memory.
 */
export const loadSessionMenu = async (): Promise<void> => {
  const auth = useAuthStore();
  try {
    const menu = await authServices.getMenu();
    if (menu.statusCode === 200 && menu.data) {
      auth.setMenu(menu.data.menus);
      auth.setProfileImg(menu.data.profile_img);
    }
  } catch (error) {
    console.warn('No se pudo cargar el menú de la sesión:', error);
  }
};

/**
 * Rebuilds the in-memory session (e.g. after F5 or opening a new tab) using
 * the HttpOnly refresh_token cookie. Resolves true when a session exists.
 */
export const restoreSession = (): Promise<boolean> => {
  const auth = useAuthStore();
  if (auth.validSession()) return Promise.resolve(true);

  if (!restorePromise) {
    restorePromise = (async () => {
      const token = await refreshAccessToken();
      if (!token) {
        auth.closeSession();
        return false;
      }
      if (auth.menu.length === 0) {
        await loadSessionMenu();
      }
      return true;
    })().finally(() => {
      restorePromise = null;
    });
  }
  return restorePromise;
};
