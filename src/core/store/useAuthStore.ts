import { defineStore } from 'pinia';

import {
  UserStateStore,
  Token,
  Menu,
} from '../interfaces/userState.store.interface';

interface State {
  user: UserStateStore | null | string;
  token: Token | null | string;
  token_type: string | null;
  menu: Menu | string | null;
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
    menuInfo(): Menu | null | string {
      if (this.menu) {
        return this.menu;
      }
      return null;
    },
  },
  actions: {
    setUserInfo(payload: UserStateStore) {
      this.user = payload;
      localStorage.setItem('user', JSON.stringify(payload));
    },
    setToken(payload: Token) {
      this.token = payload;
      localStorage.setItem('access_token', payload.access_token);
    },
    setTokenType(payload: string) {
      this.token_type = payload;
      localStorage.setItem('token_type', payload);
    },
    setMenu(payload: Menu) {
      this.menu = payload;
      localStorage.setItem('menu', JSON.stringify(payload));
    },
    closeSession() {
      this.user = null;
      this.token = null;
      localStorage.removeItem('access_token');
      localStorage.removeItem('user');
    },
  },
});
