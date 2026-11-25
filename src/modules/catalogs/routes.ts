export const routesCatalogs = [
  {
    path: 'catalogs/countries',
    name: 'countries',
    component: () => import('@/modules/catalogs/countries/views/countries.vue'),
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
  {
    path: 'catalogs/document-types',
    name: 'document-types',
    component: () =>
      import('@/modules/catalogs/document-type/views/DocumentTypes.vue'),
  },
  {
    path: 'catalogs/genders',
    name: 'genders',
    component: () => import('@/modules/catalogs/gender/views/Genders.vue'),
  },
  {
    path: 'catalogs/geographic-division-types',
    name: 'geographic-division-types',
    component: () =>
      import(
        '@/modules/catalogs/geographic-division-type/views/GeographicDivisionTypes.vue'
      ),
  },
  {
    path: 'catalogs/geographic-divisions',
    name: 'geographic-divisions',
    component: () =>
      import(
        '@/modules/catalogs/geographic-division/views/GeographicDivisions.vue'
      ),
  },
  {
    path: 'catalogs/document-prefixes',
    name: 'document-prefixes',
    meta: { title: 'Prefijos y Series de Documentos' },
    component: () =>
      import('@/modules/catalogs/document-prefix/views/DocumentPrefixes.vue'),
  },
];
