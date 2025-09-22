import { createRouter, createWebHistory } from 'vue-router';
//import { jwtDecode } from "jwt-decode";

const routes = [
  {
    path: '/login',
    name: 'login',
    meta: { requiresAuth: false, title: 'Iniciar sesion' },
    component: () => import('../../modules/auth/views/Login.vue'),
  },
  {
    path: '/sign-up',
    name: 'sign-up',
    meta: { requiresAuth: false, title: 'Registro' },
    component: () => import('../../modules/auth/views/SignUp.vue'),
  },
  {
    path: '/',
    name: 'layout',
    component: () => import('../layouts/Layout.vue'),
    meta: { requiresAuth: false },
    children: [
      {
        path: '/test-view',
        name: 'test-view',
        component: () => import('../components/AppTestComponents.vue'),
      },
      {
        path: '/dashboard',
        name: 'dashboard',
        component: () => import('@/views/Dashboard.vue'),
      },
      {

        path: '/countries',
        name: 'countries',
        component: () => import('../../modules/catalogs/countries/views/countries.vue'),
      },
      {
        path: '/routes-administration',
        name: 'routes-administration',
        component: () => import('../../modules/admin/views/Routes.vue'),
      },
    ],
  },
  {
    path: '/forbidden',
    name: 'forbidden',
    meta: { requiresAuth: false, title: 'Acceso denegado' },
    component: () => import('../../views/Forbidden.vue'),
  },
  {
    path: '/verify-email',
    name: 'verify-email',
    meta: { requiresAuth: false, title: 'Verificación de correo electrónico' },
    component: () => import('../../modules/auth/views/VerifyEmail.vue'),
  },
  {
    path: '/pending-verification-email',
    name: 'pending-verification-email',
    meta: { requiresAuth: false, title: 'Verificación de correo electrónico' },
    component: () =>
      import('../../modules/auth/views/PendingVerificationEmail.vue'),
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(/*to, from, savedPosition*/) {
    return { top: 0 };
  },
});

export default router;
