# Reglas y Políticas de Desarrollo: `vue-3-template`

> **Documento normativo de arquitectura, desarrollo y calidad para la plantilla frontend Vue 3.**
> Aplica para todos los desarrolladores y agentes de inteligencia artificial que trabajen en este repositorio.

---

## 0. Visualización de Planes de Trabajo

- Siempre que se proponga o elabore un plan de trabajo, arquitectura o refactorización:
  1. Generar un artefacto Markdown de visualización detallado en el directorio de artefactos (`brain/<conversation-id>/...`).
  2. El artefacto debe contener la arquitectura, diagramas Mermaid, tabla de componentes afectados, pasos de ejecución y estrategia de validación.
  3. Establecer `RequestFeedback: true` en el metadata del artefacto cuando se requiera aprobación interactiva del usuario antes de ejecutar.

---

## 1. Stack Tecnológico Base

- **Framework**: Vue 3.5+ con Composition API y `<script setup lang="ts">`.
- **Compilador / Bundler**: Vite 7+.
- **Lenguaje**: TypeScript ~5.8+ con modo estricto y *Project References*.
- **Estado de Servidor & Caché**: `@tanstack/vue-query` v5.
- **Formularios & Validación**: `vee-validate` 4.x + `yup` 1.6+.
- **Componentes UI & Estilos**: PrimeVue 4 (tema personalizado en `customTheme.ts`), Iconos `primeicons`, Tailwind CSS 4 (`@tailwindcss/vite`).
- **Estado Global de Cliente**: `pinia` 3.x (`useAlertStore`, `useAuthStore`, `useLoaderStore`, `useLayoutStore`).
- **Cliente HTTP**: Instancia centralizada `httpClient` sobre Axios (`@/core/utils/httpClient`).
- **Enrutamiento**: `vue-router` 4.x con guards de autenticación y permisos dinámicos.

---

## 2. Estructura y Arquitectura Modular

El proyecto se divide estrictamente en dos ámbitos:

```text
src/
├── core/                  # Elementos transversales y reutilizables en toda la aplicación
│   ├── assets/            # Fuentes, estilos CSS globales, iconos estáticos
│   ├── components/        # Componentes base globales con prefijo 'App' (AppInputText, AppDataTable, etc.)
│   ├── composables/       # Lógica reactiva reutilizable global (useNavigationMenu)
│   ├── config/            # Configuración de axios y constantes de la aplicación
│   ├── directives/        # Directivas personalizadas de Vue (v-debounce)
│   ├── interfaces/        # Contratos e interfaces TypeScript transversales
│   ├── layouts/           # Plantilla estructural de la app (Layout.vue)
│   ├── plugins/           # Registro global de componentes y proveedores (vueQuery, globalComponents)
│   ├── router/            # Configuración de Vue Router y navegación global
│   ├── services/          # Interfaces y contratos base de APIs (ApiResponseGeneric, paginateParams)
│   ├── store/             # Stores globales de Pinia (auth, alert, loader, layout)
│   └── utils/             # Utilidades puras (httpClient, queryKeys, sanitize, validationRules)
│
├── modules/               # Módulos de funcionalidad de negocio (auth, admin, catalogs, etc.)
│   └── <nombre-modulo>/
│       ├── components/    # Modales, filtros o subcomponentes exclusivos del módulo
│       ├── composables/   # Lógica de negocio, estado de formulario y queries/mutaciones
│       ├── interfaces/    # DTOs, filtros y contratos de respuesta tipados
│       ├── services/      # Funciones de comunicación con APIs mediante httpClient
│       ├── views/         # Vistas / páginas del módulo
│       └── routes.ts      # Definición de rutas del módulo
│
├── types/                 # Shims y declaraciones ambientales de tipos (.d.ts)
└── views/                 # Vistas estáticas o generales (Dashboard, Landing, NotFound)
```

### Reglas de Organización:
1. **Aislamiento por módulo**: Ningún módulo debe importar servicios o componentes internos de otro módulo a menos que se trate de un recurso promovido a `src/core/`.
2. **Nombres de archivo**:
   - Componentes y Vistas: `PascalCase.vue` (ej. `DepartmentFormModal.vue`, `Departments.vue`).
   - Composables: `camelCase.ts` con prefijo `use` (ej. `useCategoryPermission.ts`, `useCountries.ts`).
   - Interfaces: `kebab-case.interface.ts` (ej. `category-permission.form.interface.ts`, `category-permissions.response.interface.ts`).
   - Servicios: `kebab-case.services.ts` (ej. `admin.services.ts`, `catalog.services.ts`).
   - Rutas de módulo: `routes.ts`.

---

## 3. Convenciones de Componentes y UI

1. **Uso Obligatorio de Componentes Globales `App*`**:
   - Todo componente en `src/core/components/App*.vue` se encuentra automáticamente registrado de manera global por `registerGlobalComponents`.
   - **Catálogo de Componentes Transversales (`src/core/components/`)**:
     - **Entradas & Formularios**: `AppInputText`, `AppSelect`, `AppMultiSelect`, `AppAutocomplete`, `AppInputNumber`, `AppInputMoney`, `AppInputMask`, `AppInputextArea`, `AppDatePicker`, `AppTimePicker`, `AppCheckBox`, `AppSelectButton`, `AppColorPicker`, `AppDragDropFile`.
     - **Datos, Estado & Carga**: `AppDataTable`, `AppPaginator`, `AppSkeleton` (carga progresiva según `skeleton.interface.ts`), `AppLoader`, `AppAlert` / `useAlertStore()`, `AppChipStatus`, `AppCircularCounter`.
     - **Estructura & Navegación**: `AppModal`, `AppCard`, `AppTitle`, `AppHeader`, `AppFooter`, `AppSideBar`, `AppNavBarMenu`, `AppMenuItemSideBar`, `AppUserMenu`, `AppVerticalStepper`, `AppFloatButton`, `AppDocumentVisor`, `AppMainContent`.
2. **Componentes de Acción**:
   - Utilizar el componente `Button` de PrimeVue para acciones primarias, secundarias, botones con icono y estados (`variant="text"`, `:severity="data?.active ? 'danger' : 'success'"`).
   - Utilizar directiva `v-tooltip.bottom` para dar contexto accesible a botones de acciones.
3. **Tokens de Color (obligatorio)**:
   - Usar únicamente `primary-*`, `surface-*` (gris slate), `success-*`, `danger-*` o variables `--p-*` definidas en `customTheme.ts`.
   - **Regla estricta por defecto**: Prohibido usar hex/rgb fijos o paletas Tailwind directas (`red-600`, `green-600`, `slate-*`, `zinc-*`, `gray-*`, `neutral-*`) en componentes. Estados de error: `text-danger-600` / `border-danger-600`.
   - **Excepción por requerimiento explícito**: Se permitirá utilizar otro tipo de color de las paletas (ya sea de Tailwind o PrimeVue) **única y exclusivamente cuando al momento del requerimiento sea explícita dicha necesidad**. En caso contrario, se manejará lo que ya está estrictamente obligatorio.
   - Los tokens `success`/`danger` se mapean a Tailwind en `src/core/assets/style.css`.
4. **Modales de Formulario Desacoplados**:
   - Los modales deben gestionar un objeto de estado reactivo `modalState`:
     ```ts
     const modalState = reactive<{
       show: boolean;
       mode: 'closed' | 'add' | 'view' | 'edit' | 'delete';
       title: string;
       description: string;
       isReadonly: boolean;
       selectedItem: null | string;
     }>({ ... });
     ```
   - Las vistas inyectan o proporcionan el composable del módulo (`provide('useMiModulo', miModuloInstance)`) y el modal lo consume con `inject` para compartir estado sin duplicar lógica.
5. **Documentación Viva (Docs-as-Code)**:
   - Todo componente en `src/core/components/` debe mantener tipados estrictos en TypeScript (`defineProps<{...}>` y `defineEmits<{...}>`) y comentarios explicativos JSDoc cuando sea necesario.
   - Las interfaces de TypeScript y este documento `AGENTS.md` constituyen la fuente única de verdad para desarrolladores y agentes de IA, evitando herramientas externas desincronizadas.

---

## 4. Reglas Mandatorias de Composables (Estado y Formularios)

### 4.1. Estado de Servidor con TanStack Query v5
- **Factoría de Claves**: Todo módulo debe estructurar sus claves con `createQueryKeys` (`@/core/utils/queryKeys`).
- **Claves Reactivas**: Envolver obligatoriamente `queryKey` en `computed(() => ...)` para sincronizar automáticamente cambios en `pagination` o `appliedFilter`.
- **Paginación Suave**: Usar `placeholderData: keepPreviousData` para evitar parpadeos visuales al navegar entre páginas.
- **Invalidación Consistente**: Las mutaciones (`addMutation`, `updateMutation`, etc.) deben invalidar la caché oportunamente tras el éxito con `queryClient.invalidateQueries({ queryKey: keys.all })`.
- *Ver recetas completas y mutaciones optimistas en la habilidad `vue3-tanstack-query-manager`.*

### 4.2. Formularios Reactivos con Vee-Validate y Yup
- **Enlace Reactivo**: Usar `defineField` (`const [field, fieldAttrs] = defineField('name')`) y enlazar a componentes `AppInput*` con `v-model="field"` y `v-bind="fieldAttrs"`.
- **Reglas Centralizadas**: Reutilizar las validaciones de `@/core/utils/validationRules` (`requiredText`, `noEmojis`, `requiredNumber`, `emailFormat`, etc.).
- **Errores Semánticos**: Conectar `:error="errors.field"`. Los componentes `AppInput*` aplican el color semántico `text-danger-600` de forma nativa.
- **Ciclo de Vida con `modalState`**:
  - Al abrir en modo `add`: llamar a `resetForm()`.
  - Al abrir en modo `edit` o `view`: cargar datos mediante `setValues(itemData)`.
  - En modo `view`: deshabilitar campos (`:disabled="true"`) y ocultar botones de envío.
- *Ver catálogo de inputs y esquemas completos en la habilidad `vue3-vee-validate-forms`.*

### 4.3. Manejo Canónico de Búsquedas y Debounce
- **Prohibido el uso de la directiva `v-debounce` en plantillas**: Las directivas DOM generan alto acoplamiento con los nodos HTML, ocasionan comportamientos inconsistentes con wrappers de PrimeVue y carecen de tipado estricto.
- **Debounce a nivel de Composable**: Toda función de búsqueda o filtro con retardo debe generarse y exportarse desde el composable utilizando la función utilitaria `debounce` de `@/core/utils/debounceFunction` (ej. 600–700 ms).
- **Consumo en la Vista (`.vue`)**: Enlazar directamente a través de eventos declarativos nativos de Vue 3 (`@keydown.enter` o `@click`).
- *Ver implementación integral de vistas y filtros en la habilidad `vue3-crud-module-scaffolder`.*

---

## 5. Servicios HTTP y Consumo de APIs

1. **Uso Exclusivo de `httpClient`**:
   - Importar `httpClient` desde `@/core/utils/httpClient`.
   - **Nunca** utilizar `axios` directamente dentro de los módulos ni crear instancias aisladas.
2. **Tipado de Respuestas**:
   - Consultas paginadas: `Promise<ApiResponseGeneric<T>>`.
   - Mutaciones (POST / PUT / PATCH): `Promise<ApiPostResponse<T>>`.
   - Objeto individual: `Promise<ApiPostResponse<T>>` o tipo DTO directo.
3. **Manejo Centralizado de Errores**:
   - `httpClient` intercepta errores HTTP, disparando automáticamente alertas de error (`400`, `422`, `500`) y gestionando el cierre de sesión y redirección en errores de autorización (`401` -> login, `403` -> not-found).
   - No envolver peticiones en `try/catch` para volver a mostrar la misma alerta genérica; permitir que el interceptor y los callbacks de TanStack Query orquesten la UI.

---

## 6. Enrutamiento y Control de Acceso

1. Cada módulo debe exportar su lista de rutas en `src/modules/<modulo>/routes.ts`.
2. Las rutas deben cargarse mediante importación dinámica (`component: () => import('@/modules/...')`).
3. En `src/core/router/index.ts`, las rutas de negocio autenticadas deben colocarse como hijas (`children`) de la ruta principal `'/'` (`Layout.vue`).
4. Toda ruta protegida pasa por el guard central `beforeEach`, que valida la sesión con `validSession()` y los permisos con `isRouteAuthorized()`.

---

## 7. Protocolo Obligatorio de Calidad y Validación de Tipos

Al implementar cualquier característica, refactorización o corrección:

1. **Cero Tolerancia a `any`**:
   - Declarar siempre interfaces en `src/modules/<modulo>/interfaces/` o `src/core/interfaces/`.
2. **Comando de Verificación de Tipos**:
   - Ejecutar siempre antes de finalizar la tarea:
     ```bash
     npm run check:types
     ```
     o su alias equivalente:
     ```bash
     npm run typecheck
     ```
   - Si se desea verificar únicamente el código de la aplicación Vue:
     ```bash
     npm run typecheck:app
     ```
3. **Validación de Compilación**:
   - Si la tarea involucró cambios estructurales de configuración o bundler, ejecutar:
     ```bash
     npm run build
     ```
4. **Formato**:
   - Mantener consistencia ejecutando `npm run format` si se requiere formateo con Prettier.

---

## 8. Habilidades Disponibles en este Repositorio (`.agents/skills/`)

- `vue3-crud-module-scaffolder`: Andamiaje guiado completo de módulos (vistas, modales, composables y rutas).
- `vue3-tanstack-query-manager`: Gestión avanzada de estado de servidor, queries jerárquicas, invalidación y mutaciones optimistas.
- `vue3-vee-validate-forms`: Formularios reactivos, esquemas Yup y enlace canónico con componentes globales `AppInput*`.
- `fullstack-contract-sync`: Mapeo riguroso de contratos y DTOs desde el backend NestJS hacia interfaces y servicios de Vue 3.
