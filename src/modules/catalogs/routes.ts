export const routesCatalogs = [
  {
    path: 'catalogs/countries',
    name: 'countries',
    component: () => import('@/modules/catalogs/countries/views/countries.vue'),
  },
  {
    path: 'catalogs/departments',
    name: 'departments',
    component: () =>
      import('@/modules/catalogs/departments/views/Departments.vue'),
  },
  {
    path: 'catalogs/municipalities',
    name: 'municipalities',
    component: () =>
      import('@/modules/catalogs/municipalities/views/Municipalities.vue'),
  },
  {
    path: 'catalogs/districts',
    name: 'districts',
    component: () => import('@/modules/catalogs/districts/views/Districts.vue'),
  },
  {
    path: 'catalogs/global-status',
    name: 'global-status',
    component: () =>
      import('@/modules/catalogs/global-status/views/GlobalStatus.vue'),
  },
  {
    path: 'catalogs/category-status',
    name: 'category-status',
    component: () =>
      import('@/modules/catalogs/category-status/views/CategoryStatus.vue'),
  },
];
