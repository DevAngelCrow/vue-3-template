# Vue 3 + Typescript + Tailwind (4.0) + Vite + PrimeVue (4) Template

Esta plantilla cuenta con las tecnologias descritas para poder iniciar con un desarrollo rapido, asi como también cuenta con componentes basicos listos para utilizarse.


## Requisitos

- Node versión >= 18.8.0
- npm versión >= 10.8.x


## Estructura general del directorio de carpetas y archivos del proyecto

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
├── 📄 .env.local
├── 📄 .eslintrc.js
├── 📄 .gitignore
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

- 📂 components/: Contiene funciones reactivas creadas con Composition API de Vue 3, estos encapsulan logica que puede ser reutilizadas por los componentes de Vue.

- 📂 composables/: Contiene e incluye componentes Vue reutilizables, tales como Modales, DataTable, DatePicker etc.

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

- vite.config.ts: Archivo que define cómo se comporta Vite durante el desarrollo, build y preview. Es donde puedes extender funcionalidades, configurar plugins, establecer alias de rutas, entre otros.
