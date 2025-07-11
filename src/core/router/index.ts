import { createRouter, createWebHistory } from "vue-router";
//import { jwtDecode } from "jwt-decode";

const routes = [
  {
    path: "/login",
    name: "login",
    meta: { requiresAuth: false, title: "Iniciar sesion" },
    component: () => import("../../modules/auth/views/Login.vue")
  },
  {
    path: "/",
    name: "layout",
    component: () => import("../layouts/Layout.vue"),
    meta: { requiresAuth: false },
    children: [
      {
        path: "/test-view",
        name: "test-view",
        component: () => import("../components/AppTestComponents.vue"),
      },
    ],
  },
  {
    path: "/forbidden",
    name: "forbidden",
    meta: { requiresAuth: false, title: "Acceso denegado" },
    component: () => import("../../views/Forbidden.vue"),
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition){
    return {top: 0}
  }
});

export default router;
