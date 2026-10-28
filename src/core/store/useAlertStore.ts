import { defineStore } from 'pinia';

import type { Alert } from '../interfaces/alert.interface';
export const useAlertStore = defineStore('message', {
  state: (): Alert => ({
    show: false,
    type: undefined,
    icon: '',
    title: '',
    content: '',
    closable: false,
    maxWidth: 500,
    timeout: 3000,
  }),
  actions: {
    showAlert(options: Alert) {
      this.show = true;
      this.type = options?.type ?? 'error';
      this.icon = options?.icon ?? '';
      this.title = options?.title ?? '';
      this.content = options?.content ?? '';
      this.closable = options?.closable ?? false;
      this.maxWidth = options?.maxWidth ?? 500;
      this.timeout = options?.timeout ?? 3000;

      setTimeout(() => {
        this.close();
      }, this.timeout);
    },
    reset() {
      this.show = false;
      this.type = undefined;
      this.icon = '';
      this.title = '';
      this.content = '';
      this.closable = false;
      this.maxWidth = 500;
      this.timeout = 3000;
    },
    close() {
      this.reset();
    },
  },
});
