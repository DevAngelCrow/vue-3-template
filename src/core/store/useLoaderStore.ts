import { defineStore } from 'pinia';

export interface LoaderState {
  activeRequest: number;
  queryFetchingCount: number;
  mutationPendingCount: number;
  queryPendingCount: number;
}

export const useLoaderStore = defineStore('loader', {
  state: (): LoaderState => ({
    activeRequest: 0,
    queryFetchingCount: 0,
    mutationPendingCount: 0,
    queryPendingCount: 0,
  }),
  getters: {
    isLoading: (state): boolean =>
      state.activeRequest > 0 ||
      state.queryFetchingCount > 0 ||
      state.mutationPendingCount > 0,
    isFetching: (state): boolean => state.queryFetchingCount > 0,
    isMutating: (state): boolean => state.mutationPendingCount > 0,
    isPending: (state): boolean =>
      state.queryPendingCount > 0 || state.mutationPendingCount > 0,
  },
  actions: {
    startLoading() {
      this.activeRequest++;
    },
    finishLoading() {
      if (this.activeRequest > 0) {
        this.activeRequest--;
      }
    },
    resetLoading() {
      this.activeRequest = 0;
    },
    setQueryFetchingCount(count: number) {
      this.queryFetchingCount = Math.max(0, count);
    },
    setMutationPendingCount(count: number) {
      this.mutationPendingCount = Math.max(0, count);
    },
    setQueryPendingCount(count: number) {
      this.queryPendingCount = Math.max(0, count);
    },
  },
});
