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
    path: 'admin/role/role-maintenance/:id?',
    name: 'role-maintenance',
    meta: { parentRouteUri: '/admin/role' },
    component: () => import('@/modules/admin/views/RolDetail.vue'),
  },
  {
    path: 'admin/routes-administration',
    name: 'routes-administration',
    component: () => import('@/modules/admin/views/Routes.vue'),
  },
  {
    path: 'admin/routes-administration/route-maintenance/:id?',
    name: 'route-maintenance',
    meta: { parentRouteUri: '/admin/routes-administration' },
    component: () => import('@/modules/admin/views/RouteDetail.vue'),
  },
  {
    path: 'admin/user-role',
    name: 'user-role',
    component: () => import('@/modules/admin/views/UserRole.vue'),
  },
  {
    path: 'admin/audit-logs',
    name: 'audit-logs',
    meta: { title: 'Logs de Auditoría' },
    component: () => import('@/modules/admin/views/AuditLogs.vue'),
  },
  {
    path: 'admin/provider-storages',
    name: 'provider-storages',
    meta: { title: 'Proveedores de Almacenamiento' },
    component: () => import('@/modules/admin/views/ProviderStorages.vue'),
  },
  {
    path: 'admin/storage-files',
    name: 'storage-files',
    meta: { title: 'Archivos Almacenados' },
    component: () => import('@/modules/admin/views/StorageFiles.vue'),
  },
];
