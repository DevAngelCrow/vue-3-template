---
title: AppInputMask
description: Descripción del componente AppFloatButton.
---

El componente en referencia se encuentra ya configurado para poder reutilizarlo, de esta manera, estas serían las propiedades que corresponden a dicho componente:

| Propiedad        | Tipo    | Valor por defecto | Descripción                                                                                                    |
| ---------------- | ------- | ----------------- | -------------------------------------------------------------------------------------------------------------- |
| class            | String  | 'w-full'          | Clases CSS aplicadas al componente.                                                                            |
| type             | String  | 'text'            | Tipo de input (por ejemplo, 'text', 'email', 'password', etc.).                                                |
| placeholder      | String  | ''                | Texto de marcador de posición dentro del input.                                                                |
| severity         | String  | 'error'           | Severidad del mensaje de error o validación (por ejemplo, 'error', 'info').                                    |
| size             | String  | 'small'           | Tamaño del del mensaje de error que se muestra por debajo del input (por ejemplo, 'small', 'medium', 'large'). |
| variant          | String  | 'simple'          | Variante visual del mensaje de error (por ejemplo, 'simple', 'outlined', etc.).                                |
| labelVariant     | String  | 'on'              | Corresponde al tipo de variante del label flotante                                                             |
| inputVariant     | String  | 'large'           | Corresponde al variante de la caja del componente                                                              |
| errorMessages    | String  | ''                | Mensaje de error personalizado a mostrar.                                                                      |
| showIcon         | Boolean | false             | Si se debe mostrar un icono en el input.                                                                       |
| appendIcon       | String  | ''                | Icono al final dentro del input.                                                                               |
| prependInnerIcon | String  | ''                | Icono al inicio dentro del input.                                                                              |
| clearIcon        | String  | ''                | Icono que se muestra para limpiar el input.                                                                    |
| autocomplete     | String  | 'off'             | Atributo HTML para controlar el autocompletado del navegador.                                                  |
| label            | String  | ''                | Etiqueta flotante descriptiva del input.                                                                       |
| id               | String  | -                 | ID único para el campo, útil para accesibilidad o pruebas.                                                     |
| mask             | String  | ''                | Máscara de entrada para formatear datos como fechas, teléfonos, etc.                                           |


A continuacion se muestra un ejemplo de como utilizar el componente del input mask

```
<script setup lang="ts">
import AppInputMask from "src/core/component/AppInputMask.vue"
import { ref } from 'vue';
const modelMask = ref();
</script>

<template>
  <AppInputMask id="basic" v-model="modelMask" label="Input mask" mask="99999999-9" placeholder="00000000-0"/>
</template>

```

El componente útiliza v-bind=“attrs”, hereda las propiedades del componente base de PrimeVue 4, en ese sentido, para ampliar que otras propiedades puede integrar en la tabla, puede visitar la página oficial de PrimeVue https://primevue.org/inputmask

![AppInputMask](../../../assets/AppInputMask.gif);