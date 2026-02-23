export const routesAdmin = [
  {
    path: 'admin/category-permissions',
    name: 'category-permissions',
    component: () => import('@/modules/admin/views/CategoriesPermissions.vue'),
  },
  {
    path: 'admin/permissions',
    name: 'permissions',
    component: () => import('@/modules/admin/views/Permissions.vue'),
  },
  {
    path: 'admin/role',
    name: 'role',
    component: () => import('@/modules/admin/views/Role.vue'),
  },
  {
    path: 'admin/routes-administration',
    name: 'routes-administration',
    component: () => import('@/modules/admin/views/Routes.vue'),
  },
];
