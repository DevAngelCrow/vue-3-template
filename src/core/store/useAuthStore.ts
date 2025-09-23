import { defineStore } from 'pinia';
import { jwtDecode, JwtPayload } from 'jwt-decode';

import {
  UserStateStore,
  Token,
  Menu,
} from '../interfaces/userState.store.interface';

interface State {
  user: UserStateStore | null | string;
  token: Token | null | string;
  token_type: string | null;
  menu: Menu[];
}

export const useAuthStore = defineStore('authStore', {
  state: (): State => ({
    user: localStorage.getItem('user')
      ? JSON.parse(localStorage.getItem('user') as string)
      : null,
    token: localStorage.getItem('access_token')
      ? localStorage.getItem('access_token')
      : null,
    token_type: localStorage.getItem('token_type')
      ? localStorage.getItem('token_type')
      : null,
    menu: localStorage.getItem('menu')
      ? JSON.parse(localStorage.getItem('menu') as string)
      : null,
  }),
  getters: {
    userInfo(): UserStateStore | null | string {
      if (this.user) {
        return this.user;
      }
      return null;
    },
    tokenInfo(): Token | null | string {
      if (this.token) {
        return this.token;
      }
      return null;
    },
    tokenTypeInfo(): null | string {
      if (this.token_type) {
        return this.token_type;
      }
      return null;
    },
    menuInfo(): Menu[] {
      return this.menu;
    },
  },
  actions: {
    setUserInfo(payload: UserStateStore) {
      this.user = payload;
      localStorage.setItem('user', JSON.stringify(payload));
    },
    setToken(payload: Token) {
      this.token = payload.access_token;
      localStorage.setItem('access_token', payload.access_token);
    },
    setTokenType(payload: string) {
      this.token_type = payload;
      localStorage.setItem('token_type', payload);
    },
    setMenu(payload: Menu[]) {
      this.menu = payload;
      localStorage.setItem('menu', JSON.stringify(payload));
    },
    isTokenExpired(): boolean {
      if (!this.token) return true;
      try {
        const decoded = jwtDecode<JwtPayload>(this.token as string);

        if (!decoded.exp) return true;

        const now = Math.floor(Date.now() / 1000);

        return decoded.exp < now;
      } catch (error) {
        console.error('Erorro al decodificar el token: ', error);
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
      localStorage.removeItem('access_token');
      localStorage.removeItem('user');
      localStorage.removeItem('menu');
      localStorage.removeItem('token_type');
      console.log('Se ejecuto el closeSession');
    },
  },
});
