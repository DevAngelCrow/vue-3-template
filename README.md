# Vue 3 + Typescript + Tailwind (4.0) + Vite + PrimeVue (4)

Esta plantilla cuenta con las tecnologias descritas para poder iniciar con un desarrollo rapido, asi como cuenta con componentes
basicos listos para utilizarse.

# Estructura general del directorio de carpetas y archivos del proyecto

``` 
📦 mi-proyecto 
        ├── 📁 src 
        │    ├── 📁 core
        │    │    ├── 📁 assets  
        │    │    ├── 📁 components 
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

# Descripcion de carpetas y archivos del directorio "core"

* 📂 assets/: Contiene recursos de estilos, multimedia y archivos estaticos globales de la aplicacion.

* 📂 components/: Contiene e incluye componentes Vue reutilizables, tales como Modales, DataTable, DatePicker etc. 

* 📂 config/: Define configuraciones globales.

* 📂 directives/: Contiene directivas reutilizables para los componentes.

* 📂 interfaces/: Define interfaces a utilizar para la implementacion de tipados estrictos.

* 📂 layout/: Contiene el componente general del diseno general donde se visualiza todo el contenido de la aplicacion.

* 📂 router/: Define las rutas de la aplicacion con la tecnologia de Vue Router.

* 📂 services/: Contiene las funciones responsables para le ejecucion de peticiones http hacia API's internas o externas. 

* 📂 store/: Implementa la gestión del estado global con Pinia.

* 📂 utils/: Contiene e incluye funciones de uso general, validadores, etc. 


