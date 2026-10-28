---
name: vue3-vee-validate-forms
description: Use this skill when building or refactoring complex reactive forms with Vee-Validate 4, Yup validation schemas, global AppInput* components, modalState synchronization, and error handling in vue-3-template.
---

# Formularios Reactivos con Vee-Validate 4 y Yup

Esta habilidad es el estándar para implementar formularios tipados y validados en `vue-3-template` mediante `vee-validate`, esquemas de `yup` (incluyendo las reglas centralizadas en `@/core/utils/validationRules`) y componentes globales de interfaz `AppInput*`.

---

## 1. Principios Mandatorios de Formularios

1. **Uso de `defineField`**:
   - Para cada campo reactivo, utilizar la desestructuración `const [field, fieldAttrs] = defineField('fieldName')`.
   - Enlazar al componente con `v-model="field"` y `v-bind="fieldAttrs"`.
2. **Reutilizar Reglas Centralizadas**:
   - Importar utilidades de `@/core/utils/validationRules`: `requiredText`, `noEmojis`, `requiredNumber`, `optionalNumber`, `emailFormat`, `passwordValidation`.
3. **Mapeo de Errores Semánticos**:
   - Pasar `:error-message="errors.fieldName"` al componente `AppInput*`. Los componentes de la plantilla muestran los mensajes de error automáticamente con el token semántico `text-danger-600`.
4. **Ciclo de Vida con `modalState`**:
   - Al abrir en modo `add`: invocar `resetForm()`.
   - Al abrir en modo `edit` o `view`: invocar `setValues(itemData)`.
   - En modo `view`: pasar `:disabled="true"` o `:readonly="true"` a los inputs y ocultar el botón de envío (`:show-confirm-button="false"`).

---

## 2. Catálogo de Enlace con Componentes Globales `App*`

| Componente | Tipo de Dato | Sintaxis de Enlace | Props Clave |
| :--- | :--- | :--- | :--- |
| `AppInputText` | `string` | `v-model="name" v-bind="nameAttrs"` | `label`, `placeholder`, `:error-message="errors.name"` |
| `AppSelect` | `string \| number` | `v-model="roleId" v-bind="roleAttrs"` | `:options="roles" option-label="name" option-value="id" :error-message="errors.roleId"` |
| `AppMultiSelect` | `Array<string \| number>` | `v-model="permissions" v-bind="permAttrs"` | `:options="permissionsList" option-label="label" :error-message="errors.permissions"` |
| `AppInputNumber` | `number` | `v-model="stock" v-bind="stockAttrs"` | `label`, `:min="0"`, `:max="9999"`, `:error-message="errors.stock"` |
| `AppInputMoney` | `number` | `v-model="price" v-bind="priceAttrs"` | `label`, `currency="USD"`, `:error-message="errors.price"` |
| `AppDatePicker` | `Date \| string` | `v-model="birthDate" v-bind="birthAttrs"` | `label`, `date-format="yy-mm-dd"`, `show-icon`, `:error-message="errors.birthDate"` |
| `AppCheckBox` | `boolean` | `v-model="active" v-bind="activeAttrs"` | `binary`, `label="Activo"`, `:error-message="errors.active"` |
| `AppInputTextArea` | `string` | `v-model="description" v-bind="descAttrs"` | `label`, `:rows="4"`, `:auto-resize="true"`, `:error-message="errors.description"` |

---

## 3. Ejemplo Completo: Esquema y Formulario Reactivo

```typescript
// En el Composable (src/modules/<modulo>/composables/useProduct.ts)
import { useForm } from 'vee-validate';
import * as yup from 'yup';
import { requiredText, noEmojis, requiredNumber } from '@/core/utils/validationRules';
import type { ProductForm } from '../interfaces/product.form.interface';

export function useProductForm() {
  const {
    errors,
    defineField,
    handleSubmit,
    resetForm,
    setValues,
    setErrors,
    values,
  } = useForm<ProductForm>({
    validationSchema: yup.object({
      id: yup.string().optional(),
      name: requiredText('El nombre del producto es obligatorio')
        .concat(noEmojis('El nombre no debe contener emojis'))
        .min(3, 'Debe contener al menos 3 caracteres'),
      sku: yup.string().required('El SKU es obligatorio').matches(/^[A-Z0-9-]+$/, 'Formato de SKU inválido'),
      price: requiredNumber('El precio es obligatorio', 'Debe ser un número válido', 0.01),
      category_id: yup.string().required('Selecciona una categoría'),
      active: yup.boolean().default(true),
    }),
    initialValues: {
      name: '',
      sku: '',
      price: 0,
      category_id: '',
      active: true,
    },
  });

  const [name, nameAttrs] = defineField('name');
  const [sku, skuAttrs] = defineField('sku');
  const [price, priceAttrs] = defineField('price');
  const [categoryId, categoryIdAttrs] = defineField('category_id');
  const [active, activeAttrs] = defineField('active');

  return {
    name,
    nameAttrs,
    sku,
    skuAttrs,
    price,
    priceAttrs,
    categoryId,
    categoryIdAttrs,
    active,
    activeAttrs,
    errors,
    handleSubmit,
    resetForm,
    setValues,
    setErrors,
    values,
  };
}
```

---

## 4. Consumo en el Modal Desacoplado (`ProductFormModal.vue`)

```vue
<script setup lang="ts">
import { inject } from 'vue';
import type { UseProductReturn } from '../composables/useProduct';

const props = defineProps<{
  modalState: {
    show: boolean;
    mode: 'closed' | 'add' | 'view' | 'edit';
    title: string;
    description: string;
    isReadonly: boolean;
    selectedItem: null | string;
  };
}>();

const emit = defineEmits<{ (e: 'close-modal'): void }>();

const composable = inject<UseProductReturn>('useProduct')!;
const {
  name, nameAttrs,
  sku, skuAttrs,
  price, priceAttrs,
  categoryId, categoryIdAttrs,
  active, activeAttrs,
  errors, handleSubmit, resetForm,
  addMutation, updateMutation,
} = composable;

const categories = [
  { id: 'cat-1', name: 'Electrónica' },
  { id: 'cat-2', name: 'Oficina' },
];

const onSubmit = handleSubmit(async (formData) => {
  if (props.modalState.mode === 'add') {
    await addMutation.mutateAsync(formData);
  } else if (props.modalState.mode === 'edit' && props.modalState.selectedItem) {
    await updateMutation.mutateAsync({ id: props.modalState.selectedItem, form: formData });
  }
  handleClose();
});

const handleClose = () => {
  resetForm();
  emit('close-modal');
};
</script>

<template>
  <AppModal
    :show="props.modalState.show"
    :title="props.modalState.title"
    :cancel-label="props.modalState.isReadonly ? 'Cerrar' : 'Cancelar'"
    :confirm-label="props.modalState.mode === 'add' ? 'Registrar' : 'Actualizar'"
    :show-confirm-button="!props.modalState.isReadonly"
    show-footer
    show-close-icon
    width="45rem"
    @close-modal="handleClose"
    @confirm-modal="onSubmit"
  >
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
      <AppInputText
        v-model="name"
        v-bind="nameAttrs"
        label="Nombre del Producto"
        placeholder="Ej. Teclado Mecánico"
        :error-message="errors.name"
        :readonly="props.modalState.isReadonly"
        class="col-span-2"
      />

      <AppInputText
        v-model="sku"
        v-bind="skuAttrs"
        label="Código SKU"
        placeholder="Ej. TEC-001"
        :error-message="errors.sku"
        :readonly="props.modalState.isReadonly"
      />

      <AppInputMoney
        v-model="price"
        v-bind="priceAttrs"
        label="Precio"
        :error-message="errors.price"
        :readonly="props.modalState.isReadonly"
      />

      <AppSelect
        v-model="categoryId"
        v-bind="categoryIdAttrs"
        label="Categoría"
        :options="categories"
        option-label="name"
        option-value="id"
        placeholder="Selecciona categoría"
        :error-message="errors.category_id"
        :disabled="props.modalState.isReadonly"
        class="col-span-2"
      />

      <div class="col-span-2 flex items-center gap-2">
        <AppCheckBox
          v-model="active"
          v-bind="activeAttrs"
          binary
          label="Producto Activo"
          :disabled="props.modalState.isReadonly"
        />
      </div>
    </div>
  </AppModal>
</template>
```

---

## 5. Validación

Al culminar la creación o edición del formulario:
```bash
npm run check:types
npm run lint
```
Asegurar que todas las propiedades del formulario estén estrictamente tipadas y no contengan `any`.
