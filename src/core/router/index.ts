import { createRouter, createWebHistory } from "vue-router";
//import { jwtDecode } from "jwt-decode";

const routes = [
  {
    path: "/",
    name: "layout",
    component: () => import("../layouts/Layout.vue"),
    meta: { requiresAuth: false},
    children: [
      {
        path: "/test-view",
        name: "test-view",
        component: () => import("../components/AppTestComponents.vue")
      }
    ]
  },
  {
    path: "/forbidden",
    name: "forbidden",
    meta: { requiresAuth: false, title: "Acceso denegado" },
    component: () => import("../views/Forbidden.vue"),
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
