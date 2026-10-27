import { defineStore } from 'pinia';
import { jwtDecode, JwtPayload } from 'jwt-decode';

import { UserStateStore, Token, Menu } from '../interfaces/userState.store.interface';
import type { AuthSessionData } from '../services/interfaces/auth/apiResponseLogin.interface';

// Keys written by previous versions of the app. They are purged on startup
// and on logout so no stale credentials remain on disk (OWASP: never persist
// tokens in Web Storage, it is readable by any injected script).
const LEGACY_STORAGE_KEYS = [
  'access_token',
  'refresh_token',
  'token_type',
  'user',
  'menu',
  'profile_img',
  'auth_token',
];

export const purgeLegacyAuthStorage = () => {
  try {
    LEGACY_STORAGE_KEYS.forEach(key => localStorage.removeItem(key));
  } catch (e) {
    console.error('Error al limpiar el almacenamiento local de sesión', e);
  }
};

// Seconds before the real expiration at which the access token is already
// considered expired, so it is renewed before requests start failing.
const EXPIRATION_LEEWAY_SECONDS = 10;

interface State {
  user: UserStateStore | null;
  // Access token lives ONLY in memory. After a page reload it is restored
  // through POST /auth/refresh-token using the HttpOnly cookie.
  token: string | null;
  token_type: string | null;
  menu: Menu[];
  menuSideBar: Menu[];
  profile_img: string | null;
}

export const useAuthStore = defineStore('authStore', {
  state: (): State => ({
    user: null,
    token: null,
    token_type: null,
    menu: [],
    menuSideBar: [],
    profile_img: null,
  }),
  getters: {
    userInfo(): UserStateStore | null {
      return this.user;
    },
    tokenInfo(): string | null {
      return this.token;
    },
    tokenTypeInfo(): string | null {
      return this.token_type;
    },
    menuInfo(): Menu[] {
      return this.menu;
    },
    menuSideBarInfo(): Menu[] {
      return this.menuSideBar;
    },
    profileImg(): string | null {
      return this.profile_img;
    },
  },
  actions: {
    setUserInfo(payload: UserStateStore) {
      this.user = payload;
    },
    setToken(payload: Token) {
      this.token = payload.access_token;
    },
    setTokenType(payload: string) {
      this.token_type = payload;
    },
    // Applies the payload returned by /auth/login or /auth/refresh-token.
    setSession(payload: AuthSessionData) {
      this.token = payload.access_token;
      this.token_type = payload.token_type || 'Bearer';
      this.user = { id: payload.id, user_name: payload.user_name };
    },
    setMenu(payload: Menu[]) {
      this.menu = payload;
    },
    setMenuSideBar(payload: Menu[]) {
      this.menuSideBar = payload;
    },
    setProfileImg(payload: string | null) {
      this.profile_img = payload;
    },
    isTokenExpired(): boolean {
      if (!this.token) return true;
      try {
        const decoded = jwtDecode<JwtPayload>(this.token);

        if (!decoded.exp) return true;

        const now = Math.floor(Date.now() / 1000);

        return decoded.exp - EXPIRATION_LEEWAY_SECONDS < now;
      } catch (error) {
        console.error('Error al decodificar el token: ', error);
        return true;
      }
    },
    validSession(): boolean {
      if (!this.user || !this.token || this.isTokenExpired()) return false;
      return true;
    },
    closeSession() {
      this.user = null;
      this.token = null;
      this.token_type = null;
      this.menu = [];
      this.menuSideBar = [];
      this.profile_img = null;
      purgeLegacyAuthStorage();
    },
  },
});
