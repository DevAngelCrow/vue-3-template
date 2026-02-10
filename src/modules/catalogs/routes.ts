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
];
