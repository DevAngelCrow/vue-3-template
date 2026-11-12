import { useAlertStore } from '../store/useAlertStore';
import { useAuthStore } from '../store/useAuthStore';
import { refreshAccessToken } from '../utils/tokenRefresh';
import authServices from './auth.services';

let restorePromise: Promise<boolean> | null = null;
let menuLoadPromise: Promise<boolean> | null = null;
let lastMenuFailureAt = 0;
const MENU_RETRY_COOLDOWN_MS = 5000;

const notifyMenuLoadFailure = () => {
  const alert = useAlertStore();
  alert.showAlert({
    type: 'error',
    title: 'Error al cargar el menú',
    content:
      'No se pudo obtener la configuración del menú. Algunas opciones pueden no estar disponibles temporalmente.',
    closable: true,
    timeout: 6000,
    show: true,
  });
};

/**
 * Loads the user's menu (route permissions) and profile image into memory.
 * Uses single-flight deduplication and returns true on success.
 */
export const loadSessionMenu = async (force = false): Promise<boolean> => {
  const auth = useAuthStore();
  if (!force && auth.menuLoaded) {
    return true;
  }

  if (
    !force &&
    lastMenuFailureAt > 0 &&
    Date.now() - lastMenuFailureAt < MENU_RETRY_COOLDOWN_MS
  ) {
    return false;
  }

  if (menuLoadPromise) {
    if (!force) {
      return menuLoadPromise;
    }
    await menuLoadPromise.catch(() => false);
  }

  auth.setMenuStatus({ loading: true, error: null });

  menuLoadPromise = (async () => {
    try {
      const response = await authServices.getMenu();
      if (response.statusCode === 200 && response.data) {
        auth.setMenu(response.data.menus ?? []);
        auth.setProfileImg(response.data.profile_img ?? null);
        auth.setMenuStatus({ loaded: true, loading: false, error: null });
        lastMenuFailureAt = 0;
        return true;
      }

      const message =
        response.message || 'Respuesta inválida al cargar el menú.';
      lastMenuFailureAt = Date.now();
      auth.setMenuStatus({ loading: false, error: message });
      notifyMenuLoadFailure();
      return false;
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'No se pudo cargar el menú de la sesión.';
      console.warn('No se pudo cargar el menú de la sesión:', error);
      lastMenuFailureAt = Date.now();
      auth.setMenuStatus({ loading: false, error: message });
      notifyMenuLoadFailure();
      return false;
    } finally {
      menuLoadPromise = null;
    }
  })();

  return menuLoadPromise;
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
      if (!auth.menuLoaded) {
        await loadSessionMenu();
      }
      return true;
    })().finally(() => {
      restorePromise = null;
    });
  }
  return restorePromise;
};
