# Estándares del Proyecto: Buenas Prácticas, Catálogos y Componentes Core (PrimeVue 5)

Este documento define reglas permanentes y obligatorias para todo asistente y desarrollador que trabaje en el proyecto `vue-3-template`.

---

## 1. Regla de Oro: Consumo Dinámico de Catálogos (No Hardcoding)

- **Regla general:** Todo selector (`AppSelect`), dropdown o autocompletado que represente una entidad de catálogo o dominio (ej. países, departamentos, distritos, tipos de documento, géneros, estados, roles, etc.) **DEBE consumir los endpoints y servicios del backend mediante TanStack Vue Query (`useQuery`)**.
- **No duplicar constantes estáticas:** Si existe un endpoint en el backend para una entidad, no se deben crear ni mantener archivos de constantes estáticas obsoletos como fuente secundaria o duplicada.
- **Excepción explícita:** Únicamente se permite el uso de arreglos quemados/estáticos (`constants`) si:
  1. El usuario lo ha **indicado o pedido explícitamente** en su instrucción para ese caso o componente específico.
  2. Son opciones fijas de control interno de la interfaz de usuario que no pertenecen a entidades de base de datos (por ejemplo, filtros de estado en tablas: `statusOptions = [{ value: 'Todos', name: 'Todos' }, { value: 'true', name: 'Activos' }, { value: 'false', name: 'Inactivos' }]`).

---

## 2. Auditoría Integral de Formularios

- Al modificar, corregir o agregar lógica en un modal o formulario (ej. `DepartmentFormModal.vue`, `RoleFormModal.vue`, etc.):
  - **Revisar exhaustivamente cada uno de los campos select/dropdown** presentes en el formulario.
  - Verificar que todos estén vinculados a su consulta correspondiente en el composable (`useRole`, `useCountries`, etc.).
  - Nunca dejar un campo quemado por omisión mientras se corrige otro en el mismo archivo.

---

## 3. Integridad y Estructura de Componentes Core (PrimeVue 5)

- **Respetar la estructura oficial de PrimeVue 5 en `src/core/components/`:**
  - Los componentes de entrada y formularios (`AppInputText.vue`, `AppAutocomplete.vue`, `AppInputMask.vue`, `AppMultiSelect.vue`, etc.) siguen fielmente las guías, ejemplos y patrones de diseño de PrimeVue 5 (usando `FloatLabel`, `IconField`, `InputIcon`, etc.).
  - **NO** sustituir `<InputIcon>` por `<button>` ni modificar la estructura interna de los componentes core para silenciar advertencias del navegador sin autorización explícita del usuario.
- **Interacción y eventos en iconos:**
  - Para interactuar con los iconos en `AppInputText.vue`, utilizar los eventos estándar emitidos por el componente (por ejemplo `@click-end-icon` o `@click-start-icon`).
  - Antes de enlazar un evento `@click-*` en una vista o modal consumidor, verificar el nombre exacto declarado en el `defineEmits` del componente core.

---

## 4. Tipado Estricto y Cero Tolerancia a `any`

- **Prohibición de `any` y Type Assertions forzadas (`as`) en componentes, composables y servicios**:
  - Nunca utilizar conversiones forzadas de tipo (`valor as any`, `as unknown as T`) para silenciar al compilador de TypeScript.
  - Únicamente se permite `as const` (para inferencia de literales inmutables) e `import/export { X as Y }`.
  - Utilizar siempre *Type Guards* (`val is T`), `instanceof`, o interfaces explícitas para respuestas de backend y payloads.

