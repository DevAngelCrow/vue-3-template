---
name: vue3-responsive-ui
description: Use this skill when creating or refactoring any modal, form, grid, view, layout or landing component in vue-3-template so it strictly respects the 3-tier component hierarchy (1° App*, 2° PrimeVue, 3° HTML native) and is ordered and responsive (mobile-first) using Tailwind breakpoints.
---

# UI Responsive, Ordenada y Jerarquía de Componentes

Estándar para que modales, formularios, barras de filtro, componentes y vistas se desarrollen cumpliendo la jerarquía estricta de componentes del proyecto y se adapten perfectamente desde ~320px hasta pantallas ultra anchas.

---

## 1. Jerarquía Mandatoria de Componentes (Orden de Prioridad)

Para garantizar consistencia visual, accesibilidad y reutilización, todo desarrollo o refactorización de vistas, modales, formularios y componentes en `vue-3-template` debe regirse estrictamente por la siguiente jerarquía de 3 niveles:

1. **Nivel 1 (Prioridad Máxima - Mandatorio): Componentes Globales `App*`**
   - Siempre debe verificarse primero si existe un componente wrapper en `src/core/components/App*.vue`.
   - Estos componentes ya incluyen integración reactiva, validación de errores, tamaños estandarizados (`resolveInputRootClass`), soporte móvil y estilos de marca (`primary-*`, `surface-*`).
   - Se encuentran registrados globalmente; no requieren importación manual en `<script setup>`.
   - _Catálogo representativo_: `AppInputText`, `AppInputNumber`, `AppInputMoney`, `AppSelect`, `AppMultiSelect`, `AppAutocomplete`, `AppDatePicker`, `AppTimePicker`, `AppCheckBox`, `AppInputextArea`, `AppSelectButton`, `AppColorPicker`, `AppDragDropFile`, `AppChip`, `AppChipStatus`, `AppModal`, `AppDataTable`, `AppCard`, `AppHeader`, `AppTitle`, `AppFloatButton`, etc.

2. **Nivel 2 (Prioridad Secundaria - Fallback de Biblioteca UI): PrimeVue 5**
   - Se utiliza **única y exclusivamente cuando NO exista un componente equivalente `App*`** en `src/core/components/`.
   - _Catálogo representativo_: `Button` (para todo botón de acción interactivo, con severidades `primary`, `contrast`, `secondary`, `warn`, `danger`, `variant="link"`, etc.), `<Accordion>`, `<AccordionPanel>`, `<AccordionHeader>`, `<AccordionContent>`, `Divider`, `Toast`, `ConfirmDialog`, `Badge`, `Tag`, `ProgressBar`, `Breadcrumb`, etc.

3. **Nivel 3 (Última Instancia - Estructura y Maquetación): HTML Nativo**
   - Reservado exclusivamente para la estructura semántica de contenedores (`div`, `header`, `section`, `main`, `footer`, `nav`, `form`, `label`, `p`, `span`, `ul`, `li`, `a`).
   - **ESTRICTAMENTE PROHIBIDO**: El uso de controles nativos interactivos como `<button>`, `<input>`, `<select>`, `<textarea>` cuando exista un componente en Nivel 1 (`App*`) o Nivel 2 (`PrimeVue`).

### Tabla de Selección por Tipo de Control

| Control / Elemento       | Prioridad 1 (`App*`)        | Prioridad 2 (PrimeVue)                  | Prioridad 3 (HTML Nativo - Prohibido si hay P1/P2) |
| :----------------------- | :-------------------------- | :-------------------------------------- | :------------------------------------------------- |
| **Texto / Búsqueda**     | `AppInputText`              | `InputText`                             | `❌ <input type="text">`                           |
| **Números / Cantidades** | `AppInputNumber`            | `InputNumber`                           | `❌ <input type="number">`                         |
| **Moneda / Precios**     | `AppInputMoney`             | `InputNumber` (currency)                | `❌ <input>` con formato manual                    |
| **Selector / Dropdown**  | `AppSelect`                 | `Select`                                | `❌ <select>`                                      |
| **Selector Múltiple**    | `AppMultiSelect`            | `MultiSelect`                           | `❌ <select multiple>`                             |
| **Autocompletado**       | `AppAutocomplete`           | `AutoComplete`                          | `❌ <input list="...">`                            |
| **Fechas**               | `AppDatePicker`             | `DatePicker`                            | `❌ <input type="date">`                           |
| **Horas**                | `AppTimePicker`             | `DatePicker` (timeOnly)                 | `❌ <input type="time">`                           |
| **Casilla (Checkbox)**   | `AppCheckBox`               | `Checkbox`                              | `❌ <input type="checkbox">`                       |
| **Área de Texto**        | `AppInputextArea`           | `Textarea`                              | `❌ <textarea>`                                    |
| **Botones de Selección** | `AppSelectButton`           | `SelectButton`                          | `❌ <input type="radio">`                          |
| **Color**                | `AppColorPicker`            | `ColorPicker`                           | `❌ <input type="color">`                          |
| **Archivos**             | `AppDragDropFile`           | `FileUpload`                            | `❌ <input type="file">`                           |
| **Botones de Acción**    | _(No hay AppButton)_        | `Button` (severities / link)            | `❌ <button type="button">`                        |
| **Píldoras / Estados**   | `AppChip` / `AppChipStatus` | `Chip` / `Tag`                          | `❌ <span>` estilizado manual                      |
| **Acordeones / FAQ**     | _(No hay AppAccordion)_     | `<Accordion>`, `<AccordionPanel>`, etc. | `❌ <details>`, toggle manual con `<div>`          |
| **Botón Flotante**       | `AppFloatButton`            | `SpeedDial`                             | `❌ <button class="fixed ...">`                    |

---

## 2. Principios Mandatorios de Maquetación y Responsive

1. **Mobile-first**: escribir primero el estilo móvil y escalar progresivamente con `sm:` (≥640px), `md:` (≥768px), `lg:` (≥1024px) y `xl:` (≥1280px).
2. **Grid estándar para formularios**:
   - Contenedor de formulario: `grid grid-cols-1 items-start gap-x-4 gap-y-5 sm:grid-cols-2 md:grid-cols-6`.
   - Distribución de campos: `md:col-span-N` (la suma de columnas por fila debe ser múltiplo de 6). Ancho completo: `col-span-full` o `sm:col-span-2 md:col-span-6`.
   - Si un campo queda solo al final en `sm` (2 columnas), asignar `sm:col-span-2`.
3. **Barras de Filtros y Acciones en Vistas**:
   - Deben usar `flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-3 w-full`.
   - Prohibido usar anchos arbitrarios fijos como `w-45` o `w-83.75` que no sean estándar de Tailwind.
   - En pantallas móviles, los botones de acción (`Buscar`, `Limpiar`, `Agregar`) deben ocupar el ancho natural o flex-grow ordenado, sin empujar elementos fuera del viewport ni causar desbordamiento horizontal.
4. **Contenedor Raíz en Slots de `AppModal`**:
   - Toda plantilla de `AppModal` debe comenzar inmediatamente con `<div class="w-full space-y-4 py-2">` (o `space-y-6`).
   - `AppModal` centra su contenido con flex; omitir `w-full` hace que los inputs o secciones se encojan en dispositivos móviles.
5. **Comportamiento Estandarizado de Entradas `App*`**:
   - Todos los componentes de entrada (`AppInputText`, `AppInputNumber`, `AppSelect`, `AppDatePicker`, `AppColorPicker`, etc.) aplican `w-full min-w-0` vía `resolveInputRootClass`.
   - Se adaptan automáticamente al contenedor grid sin desbordar.
6. **Tokens de Color**:
   - Usar estrictamente los tokens del sistema: `primary-*`, `surface-*`, `success-*`, `danger-*`. Prohibido el uso de valores hexadecimales o nombres de colores directos (slate, gray, red, etc.) salvo requerimiento explícito.

---

## 3. Pautas para `AppModal`

- `width`: Representa el ancho máximo para escritorio (ej. `750px` o `45rem`). `AppModal` aplica internamente `maxWidth: calc(100vw - 1rem)` para impedir desbordamiento en pantallas móviles.
- Los botones del footer deben apilarse en móvil (`flex-col-reverse`, `w-full`) y alinearse horizontalmente a partir de `sm:`.
- Nunca fijar anchos fijos en px dentro del slot de contenido; utilizar `w-full`, `min-w-0` y grids reactivos.

---

## 4. Checklist de Revisión

- [ ] **Jerarquía de componentes respetada**: 1° `App*`, 2° PrimeVue y 3° HTML nativo (cero `<button>` o `<input>` nativos injustificados).
- [ ] Sin scroll horizontal involuntario en la vista ni en modales a 320px, 375px, 640px, 768px y ≥1024px.
- [ ] Todo slot de modal tiene `<div class="w-full ...">` como nodo raíz.
- [ ] Barras de búsqueda y botones se adaptan sin cortarse en pantallas estrechas.
- [ ] Las tablas (`AppDataTable`) permiten scroll horizontal interno si las columnas superan el ancho de pantalla móvil, manteniendo el paginador visible y responsive.
