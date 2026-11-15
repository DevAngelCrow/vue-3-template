<p align="center">
<a style="display:inline-block; vertical-align:middle;" href="https://vuejs.org/" target="blank"><img src="https://api.iconify.design/logos:vue.svg" width="120" alt="Vue Logo" /></a>
&nbsp;&nbsp;&nbsp;
<a style="display:inline-block; vertical-align:middle;" href="https://vite.dev/" target="blank"><img src="https://api.iconify.design/logos:vitejs.svg" width="120" alt="Vite" /></a>
&nbsp;&nbsp;&nbsp;
<a style="display:inline-block; vertical-align:middle;" href="https://www.typescriptlang.org/" target="blank"><img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg" width="120" alt="TypeScript" /></a>
&nbsp;&nbsp;&nbsp;
<a style="display:inline-block; vertical-align:middle;" href="https://primevue.org/" target="blank"><img src="https://api.iconify.design/simple-icons:primevue.svg?color=%234ADE80" width="120" alt="PrimeVue 5" /></a>
&nbsp;&nbsp;&nbsp;
<a style="display:inline-block; vertical-align:middle;" href="https://tailwindcss.com/" target="blank"><img src="https://cdn.simpleicons.org/tailwindcss/06B6D4" width="120" alt="Tailwind CSS 4" /></a>
</p>

# Vue 3 + Vite 7 + TypeScript + PrimeVue 5 + Tailwind CSS 4 Template

Plantilla frontend modular lista para integrarse con `hexagonal_template_nestjs`, equipada con autenticación en memoria + cookie `HttpOnly` de refresco, RBAC dinámico por menú desde API, **42 componentes globales `App*`**, TanStack Vue Query 5 con sincronización automática de carga y formularios validados con Vee-Validate + Yup.

## Configuración Inicial de la Plantilla

### Requisitos

- Node versión `>= 18.18.0` (verificado por script `check:node`)
- npm versión `>= 10.8.x`

### Instalación

1. **Clonar el repositorio:**
```bash
git clone https://github.com/DevAngelCrow/vue-3-template.git
cd vue-3-template
```

2. **Configurar variables de entorno:**
```bash
cp .env.example .env.local
```
Variables definidas en [`.env.example`](.env.example):
- `VITE_VUE_APP_API_URL`: URL base del backend **sin** prefijo `/api/v1` (por ejemplo, `http://localhost:3000`; [`src/core/config/axios.ts`](src/core/config/axios.ts) añade `/api/v1` automáticamente).
- `VITE_VUE_PORT`: Puerto del servidor de desarrollo Vite (por defecto `5173`).
- `VITE_CLOUDFLARE_TURNSTILE_SITE_KEY`: Site key pública de Cloudflare Turnstile (opcional en desarrollo; requerida si el backend tiene `TURNSTILE_ENABLED=true`).

3. **Instalar dependencias:**
```bash
npm install
```

4. **Dar permisos de ejecución a Husky (solo Linux/macOS):**
```bash
chmod +x .husky/*
```

5. **Configurar hooks locales (`dev:setup`):**
```bash
npm run dev:setup
```

6. **Iniciar servidor de desarrollo:**
```bash
npm run dev
```

---

## Arquitectura Clave en Tiempo de Ejecución

- **Seguridad de Sesión (Zero-Storage JWT)**: `useAuthStore` conserva el `access_token`, usuario y menú **únicamente en memoria RAM** (`purgeLegacyAuthStorage()` limpia cualquier residuo previo de `localStorage`/`sessionStorage` al iniciar). La persistencia entre recargas funciona mediante cookie `HttpOnly` `refresh_token` enviada automáticamente (`withCredentials: true`) hacia `POST /api/v1/auth/refresh-token`.
- **Refresco Concurrente Single-Flight**: [`tokenRefresh.ts`](src/core/utils/tokenRefresh.ts) coordina los reintentos ante `401` mediante un mutex de promesa única para evitar múltiples rotaciones simultáneas contra el backend.
- **RBAC Fail-Closed en Router**: [`src/core/router/index.ts`](src/core/router/index.ts) y [`routePermissions.ts`](src/core/utils/routePermissions.ts) restauran la sesión al arrancar, cargan el árbol `GET /api/v1/security/menus/` y autorizan solo las rutas hoja devueltas por la API (más rutas base como `/dashboard` y `/profile`).
- **TanStack Vue Query + `AppLoader`**: [`vueQuery.ts`](src/core/plugins/vueQuery.ts) desactiva el loader bloqueante global en consultas (`queries` con `skipLoader: true` -> usar `AppSkeleton`), mientras que las **mutaciones** activan `<AppLoader />` automáticamente a través de `initQueryLoaderSync`.
- **Componentes Globales**: [`globalComponents.ts`](src/core/plugins/globalComponents.ts) registra automáticamente todos los componentes bajo `src/core/components/` en PascalCase y kebab-case.

---

## Estructura General del Proyecto

```text
vue-3-template/
├── .agents/skills/                   # Skills de desarrollo y scaffolding del proyecto
├── .gemini/rules/project-standards.md # Reglas normativas de estilo y estándares UI
├── src/
│   ├── core/
│   │   ├── assets/                   # style.css (Tailwind 4 + tokens PrimeVue), fuentes e íconos
│   │   ├── components/               # 42 componentes globales App* (Inputs Nivel 2, Tablas, Modales)
│   │   ├── composables/              # useTurnstile, useNavigationMenu, usePublicGeoCatalogs, useMobileViewport
│   │   ├── config/                   # axios.ts (API_BASE_URL + withCredentials)
│   │   ├── constants/                # Catálogo de iconos PrimeIcons
│   │   ├── directives/               # Registro de directivas PrimeVue (tooltip, ripple, etc.)
│   │   ├── interfaces/               # Contratos TS del core y stores
│   │   ├── layouts/                  # Layout.vue (Shell principal autenticado)
│   │   ├── plugins/                  # globalComponents.ts, vueQuery.ts
│   │   ├── router/                   # Router principal y guards beforeEach
│   │   ├── services/                 # auth.services.ts, session.services.ts, index.services.ts
│   │   ├── store/                    # useAuthStore, useAlertStore, useLayoutStore, useLoaderStore, useLandingInquiryStore
│   │   └── utils/                    # httpClient, tokenRefresh, routePermissions, validationRules, queryKeys, dates
│   ├── modules/
│   │   ├── auth/                     # Login, SignUp, Forgot/ResetPassword, VerifyEmail, ConfirmEmailChange, Profile
│   │   ├── admin/                    # Categorías, Permisos, Roles (+ detalle), Rutas (+ detalle), Usuario-Rol
│   │   └── catalogs/                 # Países, Estados Globales/Categoría, Tipos Doc, Géneros, Divisiones Geográficas (+ legado)
│   ├── types/                        # Declaraciones TS globales y shims Turnstile/PrimeVue
│   ├── views/                        # Landing (+ src/views/components/landing/), Dashboard, NotFound, Forbidden
│   ├── App.vue
│   ├── customTheme.ts                # Preset PrimeVue 5 (Aura emerald/slate + tokens semánticos)
│   └── main.ts                       # Bootstrap app, plugins, tema y montaje
├── .env.example
├── .gitignore
├── .prettierrc.json
├── AGENTS.md                         # Normativa integral de arquitectura y desarrollo frontend
├── commitlint.config.ts
├── eslint.config.ts
├── index.html
├── package.json
├── README.md
├── tsconfig.app.json
├── tsconfig.json
├── tsconfig.node.json
├── vercel.json                       # Rewrites SPA para despliegue
└── vite.config.ts
```

---

## Scripts Disponibles (`package.json`)

```bash
# Servidor de desarrollo Vite
npm run dev

# Linter ESLint 9 y autocorrección
npm run lint
npm run lint:fix

# Formateo Prettier
npm run format

# Validación de tipos TypeScript (Project References y app)
npm run check:types
npm run typecheck
npm run typecheck:app

# Validación completa (lint + check:types + format)
npm run check

# Compilación de producción (estándar y con gate previo)
npm run build
npm run build:prod

# Vista previa de build compilado
npm run preview
npm run preview:build
```

Para detalles normativos de creación de módulos CRUD, formularios Vee-Validate, gestión de caché TanStack Query y jerarquía de componentes `App*`, consulta [`AGENTS.md`](AGENTS.md) y `.gemini/rules/project-standards.md`.
