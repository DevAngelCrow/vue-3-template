import { defineStore } from "pinia";
import type { alert } from "../interfaces/alert.interface";
export const useMessageStore = defineStore("message", {
  state: (): alert => ({
    show: false,
    type: undefined,
    icon: "",
    title: "",
    content: "",
    closable: false,
    maxWith: 500,
    timeout: 3000,
  }),
  actions: {
    showAlert(options: alert) {
      this.show = true;
      this.type = options?.type ?? "error";
      this.icon = options?.icon ?? "";
      this.title = options?.title ?? "";
      this.content = options?.content ?? "";
      this.closable = options?.closable ?? false;
      this.maxWith = options?.maxWith ?? 500;
      this.timeout = options?.timeout ?? 3000;
    },
    reset() {
      this.show = false;
      this.type = undefined;
      this.icon = "";
      this.title = "";
      this.content = "";
      this.closable = false;
      this.maxWith = 500;
      this.timeout = 3000;
    },
    close(){
        this.reset()
    }
  },
});
