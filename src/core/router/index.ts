import { createRouter, createWebHistory } from 'vue-router';

import { routesCatalogs } from '@/modules/catalogs/routes';
import { routesAdmin } from '@/modules/admin/routes';

import { useAuthStore } from '../store/useAuthStore';
import { isRouteAuthorized } from '../utils/routePermissions';

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
    path: '/forgot-password',
    name: 'forgot-password',
    meta: { requiresAuth: false, title: 'Recuperar contraseña' },
    component: () => import('../../modules/auth/views/ForgotPassword.vue'),
  },
  {
    path: '/landing',
    name: 'landing',
    meta: { requiresAuth: false, title: 'Bienvenido' },
    component: () => import('../../views/Landing.vue'),
  },
  {
    path: '/',
    name: 'layout',
    component: () => import('../layouts/Layout.vue'),
    meta: { requiresAuth: true },
    children: [
      {
        path: '/',
        redirect: '/dashboard',
      },
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
        path: '/profile',
        name: 'profile',
        meta: { requiresAuth: true },
        component: () => import('../../modules/auth/views/Profile.vue'),
      },
      {
        path: '/not-found',
        name: 'not-found',
        meta: { requiresAuth: true, title: 'Sitio no encontrado' },
        component: () => import('@/views/NotFound.vue'),
      },
    ],
  },
  {
    path: '/forbidden',
    name: 'forbidden',
    redirect: { name: 'not-found' },
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
  {
    path: '/reset-forgotten-password',
    name: 'reset-forgotten-password',
    meta: { requiresAuth: false, title: 'Restablecer contraseña' },
    component: () => import('../../modules/auth/views/ResetForgotPassword.vue'),
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'catch-all',
    meta: { requiresAuth: false, title: 'Sitio no encontrado' },
    component: () => import('@/views/NotFound.vue'),
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
  const hasValidSession = auth.validSession();

  // 1. Si la ruta requiere autenticación y el usuario no tiene sesión válida
  if (to.meta.requiresAuth && !hasValidSession) {
    auth.closeSession();
    return next({ name: 'login', query: { redirect: to.fullPath } });
  }

  // 2. Si el usuario está autenticado
  if (hasValidSession) {
    // Si intenta ir a login o landing estando autenticado, redirigir al dashboard
    if (to.name === 'login' || to.name === 'sign-up' || to.name === 'landing') {
      return next({ name: 'dashboard' });
    }

    // Si cae en el comodín catch-all (URL inexistente), redirigir a la vista not-found dentro del layout
    if (to.name === 'catch-all') {
      return next({ name: 'not-found', replace: true });
    }

    // 3. Comprobación de permisos si la ruta requiere autenticación
    if (to.meta.requiresAuth) {
      const authorized = isRouteAuthorized(to.path, auth.menuInfo);
      if (!authorized) {
        // Usuario autenticado sin permisos para esta ruta:
        // Se redirige a 'not-found' de forma preventiva sin montar el componente
        return next({ name: 'not-found', replace: true });
      }
    }
  }

  next();
});

export default router;
