import { createRouter, createWebHistory } from 'vue-router';

import { routesCatalogs } from '@/modules/catalogs/routes';
import { routesAdmin } from '@/modules/admin/routes';

import { useAuthStore } from '../store/useAuthStore';

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
    meta: { requiresAuth: true },
    children: [
      ...routesCatalogs,
      ...routesAdmin,
      {
        path: '/test-view',
        name: 'test-view',
        meta: { requiresAuth: true },
        component: () => import('../components/AppTestComponents.vue'),
      },
      {
        path: '/dashboard',
        name: 'dashboard',
        meta: { requiresAuth: true },
        component: () => import('@/views/Dashboard.vue'),
      },
      {
        path: 'catalogs/global-status',
        name: 'global-status',
        component: () =>
          import('../../modules/catalogs/global-status/views/GlobalStatus.vue'),
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

router.beforeEach((to, _from, next) => {
  const auth = useAuthStore();

  if (to.meta.requiresAuth && !auth.validSession()) {
    auth.closeSession();
    return next({ name: 'login' });
  }
  next();
});

export default router;
