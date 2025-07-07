import { defineStore } from "pinia";

export const useLoaderStore = defineStore("loader", {
    state: () => ({
        loader: false
    }),
    actions: {
        showLoader(payload: {show: boolean}){
            this.loader = payload.show;
        },
        hideLoader(payload: {show: boolean}){
            this.loader = payload.show;
        }
    }
})