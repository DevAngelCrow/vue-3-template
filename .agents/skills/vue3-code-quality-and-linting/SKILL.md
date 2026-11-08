---
name: vue3-code-quality-and-linting
description: Reglas y directivas para mantener código limpio, libre de advertencias y errores de ESLint (import/order, no-unused-vars) y TypeScript en vue-3-template / vue-3-template. Usar al crear o modificar componentes, vistas, interfaces, composables o servicios.
---

# Calidad de Código y Linting: Vue 3 + TypeScript

Esta habilidad define los estándares y directrices obligatorios para prevenir errores de linting, advertencias de ordenamiento de imports y conflictos de tipado en `vue-3-template` (`vue-3-template`).

---

## 1. Orden Canónico de Importaciones (`import/order`)

ESLint valida el orden de los módulos importados y la separación mediante saltos de línea obligatorios entre grupos.

### Secuencia Estricta de Grupos:

```ts
// 1. Grupo Builtin y Librerías Externas ('builtin', 'external')
import { computed, ref, watch } from 'vue';
import { RouterLink, useRoute, useRouter } from 'vue-router';
import { useQuery, useMutation, useQueryClient } from '@tanstack/vue-query';
import { Button, Dialog, Select } from 'primevue';
import { useForm } from 'vee-validate';
import * as yup from 'yup';

// 2. Grupo Alias Internos ('internal' -> @/**)
import AppTitle from '@/core/components/AppTitle.vue';
import AppInputText from '@/core/components/AppInputText.vue';
import { useAlertStore } from '@/core/store';
import { httpClient } from '@/core/utils/httpClient';
import catalogServices from '@/modules/catalogs/Services/catalog.services';

// 3. Grupo Rutas Relativas ('parent', 'sibling', 'index' -> ../ y ./)
import UserFormModal from '../components/UserFormModal.vue';
import { useUser } from '../composables/useUser';
import userServices from '../services/user.services';

// 4. Tipos TypeScript (cuando van separados o relativos)
import type { UserResponse } from '../interfaces/user.response.interface';
import type { UserForm } from '../interfaces/user.form.interface';
```

### Reglas Críticas de Imports:

- **Siempre una línea en blanco** entre grupos distintos (`newlines-between: 'always'`).
- **Nunca intercalar alias `@/...` después de rutas relativas `../...`**: todos los imports con alias deben preceder a los relativos.
- **Componentes externos antes de contratos internos**: imports de librerías como `primevue/button` nunca deben situarse después de un import relativo local de interfaces.
- **Autocorrección**: Ejecutar `npm run lint:fix` para ordenar automáticamente la mayoría de imports.

---

## 2. Tipado de Emits y Callbacks en Vue 3 (`defineEmits`)

Para evitar falsos positivos de variables no usadas (`no-unused-vars`):

### Sintaxis Canónica Recomendada (Tuplas Vue 3.3+):

```ts
// Recomendada: Muy limpia y sin nombres de variables redundantes
const emit = defineEmits<{
  close: [];
  submit: [form: CustomerForm];
  'update:modelValue': [value: string];
  'update:visible': [val: boolean];
}>();
```

### Sintaxis de Firma de Llamada (Call Signature):

```ts
// Válida: Cuando se use esta sintaxis, los nombres deben ser claros
const emit = defineEmits<{
  (e: 'close'): void;
  (e: 'submit', form: CustomerForm): void;
  (e: 'update:modelValue', value: string): void;
}>();
```

### Regla sobre Variables y Parámetros No Utilizados:

- Si un parámetro en una función real o callback no se va a utilizar, **debe tener prefijo `_`**:
  ```ts
  // Correcto:
  const handleClick = (_event: MouseEvent) => {
    doSomething();
  };
  ```
- En interfaces de TypeScript (`interface Foo { (data: unknown): void }`), la regla base `no-unused-vars` de ESLint debe estar **desactivada (`'no-unused-vars': 'off'`)** en favor de `@typescript-eslint/no-unused-vars`, la cual sí reconoce firmas de tipos sin requerir prefijos `_` innecesarios.

---

## 3. Protocolo de Calidad Pre-Entrega

Antes de dar por concluida cualquier tarea o realizar un commit en el frontend:

```bash
# 1. Corregir automáticamente problemas de orden de imports y estilo
npm run lint:fix

# 2. Formatear el código con Prettier
npm run format

# 3. Comprobar que TypeScript no tiene errores de tipos
npm run check:types

# 4. Comprobación final integral
npm run check
```

---

## 4. Cero Tolerancia a `any`

Siguiendo la política central de `AGENTS.md`:

- Queda terminantemente prohibido el uso de `any`, `as any` o atajos laxos en `.ts` y `.vue`.
- Todo payload, filtro y respuesta HTTP debe estar rigurosamente tipado en su correspondiente archivo de interfaces (`src/modules/<modulo>/interfaces/`).
