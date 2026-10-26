<p  align="center">
<a  style="display:inline-block; vertical-align:middle;"  href=""  target="blank"><img  src="https://api.iconify.design/logos:vue.svg"  width="120"  alt="Vue Logo"  /></a>
&nbsp;&nbsp;&nbsp;
&nbsp;&nbsp;&nbsp;
<a  style="display:inline-block; vertical-align:middle;"  href=""  target="blank"><img  src="https://api.iconify.design/logos:vitejs.svg"  width="120"  alt="Vite"  /></a>
&nbsp;&nbsp;&nbsp;
&nbsp;&nbsp;&nbsp;
<a  style="display:inline-block; vertical-align:middle;"  href="http://nestjs.com/"  target="blank"><img  src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg"  width="120"  alt="TypeScript"  /></a>
&nbsp;&nbsp;&nbsp;
&nbsp;&nbsp;&nbsp;
<a  style="display:inline-block; vertical-align:middle;"  href="http://nestjs.com/"  target="blank"><img  src="https://api.iconify.design/simple-icons:primevue.svg?color=%234ADE80"  width="120"  alt="Primevue"  /></a>
&nbsp;&nbsp;&nbsp;
&nbsp;&nbsp;&nbsp;
<a  style="display:inline-block; vertical-align:middle;"  href="http://nestjs.com/"  target="blank"><img  src="https://cdn.simpleicons.org/tailwindcss/06B6D4"  width="120"  alt="Tailwind"  /></a>
</p>

# Vue 3 + Vite + Typescript + PrimeVue (4) + Tailwind (4.0) Template

Esta plantilla cuenta con las tecnologias descritas para poder iniciar con un desarrollo rapido, asi como cuenta con componentes
basicos listos para utilizarse.

## Configuración del inicial de la plantilla

### Requisitos

- Node versión >= 18.8.0
- npm versión >= 10.8.x

### Instalación

1 - Clonar el repositorio.

```
git clone https://github.com/DevAngelCrow/vue-3-template.git
cd vue-3-template
```

2 - Configurar el .env

```
cp .env.example .env.local
```

Configura las variables de entorno del archivo .env.local de acuerdo a tu necesidad.
Inicialmente cuenta con dos variables de entorno que son las habituales
VITE_VUE_APP_API_URL=""
VITE_PORT=""

3 - Procedemos a instalar dependencias, ejecutamos en consola dentro del directorio del repositorio el comando siguiente

```
npm install
```

4 - Dar permisos de superusuario a la carpeta husky si estas utilizando Linux

```
sudo chmod +x .husky/*
```

5 - Procedemos a ejecutar el siguiente script para asentar las configuraciones iniciales:

```
npm run dev:setup
```

6 - Ejecutamos el comando siguiente para iniciar la ejecución del proyecto en modo desarrollo

```
npm run dev
```

# Estructura general del directorio de carpetas y archivos del proyecto

```
📦 mi-proyecto
├── 📁 src
│    ├── 📁 core
│    │    ├── 📁 assets
│    │    ├── 📁 components
│    │    ├── 📁 composables
│    │    ├── 📁 config
│    │    ├── 📁 directives
│    │    ├── 📁 interfaces
│    │    ├── 📁 layouts
│    │    ├── 📁 router
│    │    ├── 📁 services
│    │    ├── 📁 store
│    │    └── 📁 utils
│    │
│    ├── 📦 modules
│    │    └── 📁 module
│    │
│    └── 📁 views
│         └── 📁 module
│
├── 📄 .env.example
├── 📄 .env.local
├── 📄 .eslint.config.ts
├── 📄 .gitignore
├── 📄 .prettierrc.json
├── 📄 .commitlint.config.ts
├── 📄 AGENTS.md
├── 📄 index.html
├── 📄 package.json
├── 📄 README.md
├── 📄 tsconfig.app.json
├── 📄 tsconfig.json
├── 📄 tsconfig.node.json
└── 📄 vite.config.ts
```

# Descripcion de carpetas y archivos de los directorios.

## Carpeta core

- 📂 assets/: Contiene recursos de estilos, multimedia y archivos estaticos globales de la aplicacion.

- 📂 components/: Contiene componentes Vue reutilizables globales con prefijo 'App' (tales como AppModal, AppDataTable, AppDatePicker, AppInputText, etc.).

- 📂 composables/: Contiene funciones reactivas creadas con Composition API de Vue 3 que encapsulan lógica reutilizable por la aplicación.

- 📂 config/: Define configuraciones globales.

- 📂 directives/: Contiene directivas reutilizables para los componentes.

- 📂 interfaces/: Define interfaces a utilizar para la implementacion de tipados estrictos.

- 📂 layout/: Contiene el componente general del diseno general donde se visualiza todo el contenido de la aplicacion.

- 📂 router/: Define las rutas de la aplicacion con la tecnologia de Vue Router.

- 📂 services/: Contiene las funciones responsables para le ejecucion de peticiones http hacia API's internas o externas.

- 📂 store/: Implementa la gestión del estado global con Pinia.

- 📂 utils/: Contiene e incluye funciones de uso general, validadores, etc.

## Carpeta modules

- 📂 modules/: Contiene cada modulo que cuenta con una estructura de componentes, composables, rutas y vistas que se integran a la aplicacion global (Ejemplo: Auth...).

## Carpeta views

- 📂 views/: Contiene las vistas generales de la aplicacion.

## Archivos de directorio raiz.

- 📄 App.vue: Componente raíz que define la estructura base de la aplicación.

- 📄 main.ts: Archivo principal que inicializa Vue, configura plugins y monta la aplicacion.

- 📄 env.example: Archivo de ejemplo para definir variables de entorno necesarias para el proyecto.

- 📄 .git.ignore: Archivo el cual contiene las extensiones que se omiten al momento de realizar un commit del repositorio local y externo.

- 📄 index.html: Archivo que es el punto de entrada principal de la aplicacion en tiempo de desarrollo y sirve como plantilla para la generacion del HTML final durante la compilacion.

- 📄 package.json: Archivo que define la configuracion principal del proyecto(nombre, version, scripts, dependencias y configuraciones especificas del ecosistema JS)

- 📄 tsconfig.app.json, tsconfig.json, tsconfig.node.json: Archivos de configuracion de TypeScript el cual define las opciones del compilador global

- 📄 vite.config.ts: Archivo que define cómo se comporta Vite durante el desarrollo, build y preview. Es donde puedes extender funcionalidades, configurar plugins, establecer alias de rutas, entre otros.

- 📄 AGENTS.md: Documento normativo que define las directrices y estándares de arquitectura, componentes, TanStack Query, validaciones con Vee-Validate y políticas de desarrollo para agentes y programadores.

## Scripts de Calidad y Validación de Tipos

Para garantizar que el código se mantenga libre de errores de tipado e inconsistencias:

```bash
# Validación completa de tipos TypeScript de todo el proyecto (Project References)
npm run check:types

# Alias estándar para verificación de tipos
npm run typecheck

# Validación de tipos enfocada en el código fuente de la aplicación Vue
npm run typecheck:app

# Validación combinada de lint, tipos y formateo
npm run check
```

