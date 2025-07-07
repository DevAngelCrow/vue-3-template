// .eslintrc.cjs
module.exports = {
  root: true,
  env: {
    node: true, // Habilita variables de entorno de Node.js (como `process`)
    browser: true, // Habilita variables de entorno de navegador (como `window`, `document`)
  },
  extends: [
    'eslint:recommended', // Reglas recomendadas por ESLint
    'plugin:@typescript-eslint/recommended', // Reglas recomendadas para TypeScript
    'plugin:vue/vue3-recommended', // Reglas recomendadas para Vue 3
    'prettier', // Deshabilita reglas de ESLint que entran en conflicto con Prettier
  ],
  parser: 'vue-eslint-parser', // Parser para archivos .vue
  parserOptions: {
    ecmaVersion: 'latest', // Permite el parseo de características modernas de ES
    parser: '@typescript-eslint/parser', // Parser para TypeScript dentro de scripts en .vue
    sourceType: 'module', // Permite el uso de módulos ES (import/export)
    extraFileExtensions: ['.vue'], // Asegura que ESLint también procese archivos .vue
  },
  plugins: [
    '@typescript-eslint', // Habilita el plugin de TypeScript
    'vue', // Habilita el plugin de Vue
  ],
  rules: {
    // Aquí puedes añadir tus reglas personalizadas o sobrescribir las existentes
    'vue/multi-word-component-names': 'off', // Si no quieres que los nombres de componentes sean multi-palabra (ej: MyComponent)
    'no-unused-vars': 'off', // Deshabilita la regla base de ESLint para variables no usadas
    '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }], // Habilita la regla de TypeScript para variables no usadas con advertencia y permite prefijo '_'
    '@typescript-eslint/no-explicit-any': 'on', // Permite el uso de `any` (considera si esto es lo que quieres)
    'vue/no-reserved-component-names': 'off', // Si usas nombres de componentes reservados por Vue (como Transition, KeepAlive)
    'vue/html-self-closing': ['error', {
      'html': {
        'void': 'always',
        'normal': 'always',
        'component': 'always'
      },
      'svg': 'always',
      'math': 'always'
    }],
    'vue/component-api-style': ['error', ['script-setup', 'composition']], // Enforce script setup for composition API
    // Ejemplo de una regla personalizada:
    // 'indent': ['error', 2], // Forzar una indentación de 2 espacios
  },
  settings: {
    'import/resolver': {
      typescript: {}, // Esto ayuda a ESLint a resolver rutas de importación con TypeScript
    },
  },
  ignorePatterns: [
    'dist/',
    'node_modules/',
    '*.html',
    '*.css',
    // Agrega aquí cualquier otro archivo o directorio que quieras ignorar
  ],
};