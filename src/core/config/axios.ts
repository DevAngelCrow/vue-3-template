import axios from "axios";
import type { AxiosInstance, AxiosRequestConfig } from "axios";
import router from "../router/index";
import { jwtDecode } from "jwt-decode";

const config : AxiosRequestConfig = {
    baseURL: `${import.meta.env.VITE_VUE_APP_URL}/api` || "http:/127.0.0.1:8000/api",
};

let isRefreshing = false;

let refreshSubscribers: unknown[] = [];

const onRefreshed = (token: string) => {
    refreshSubscribers.forEach((callback) => {
        if(typeof callback === "function"){
            callback(token);
        }
    });
    refreshSubscribers = [];
}

const addRefreshSubscriber = (callback: unknown) => {
    refreshSubscribers.push(callback);
}

const _axios : AxiosInstance = axios.create(config);

_axios.interceptors.request.use(
    (config) => {
        return config
    },
    (error) => {
        return Promise.reject(error);
    }
);

//Add a response interceptor
_axios.interceptors.response.use(
    (response) => response,
    async (error) => {
        const status = error?.response?.status;
        const originalRequest = error.config;
        if(status !== 401 || (status === 401 && (window.location.pathname === "/login" || window.location.pathname.includes("/verify-mail"))) || originalRequest._retry){
            return Promise.reject(error);
        }

        const userStore
    }
)