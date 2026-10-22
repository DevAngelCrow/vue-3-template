import { defineStore } from 'pinia';

import type { NavigationItem } from '../interfaces/navigation.interface';

interface LayoutState {
  sideBar: boolean;
  overflowMenuItems: NavigationItem[];
}

export const useLayoutStore = defineStore('layoutStore', {
  state: (): LayoutState => ({
    sideBar: false,
    overflowMenuItems: [],
  }),
  getters: {
    hasOverflow: (state): boolean => state.overflowMenuItems.length > 0,
  },
  actions: {
    showSideBar(payload: boolean) {
      this.sideBar = payload;
    },
    hideSideBar(payload: boolean) {
      this.sideBar = payload;
    },
    setOverflowMenuItems(items: NavigationItem[]) {
      this.overflowMenuItems = items;
    },
  },
});
