---
title: AppInputMask
description: Descripción del componente AppFloatButton.
---

El componente en referencia se encuentra ya configurado para poder reutilizarlo, de esta manera, estas serían las propiedades que corresponden a dicho componente:

| Propiedad        | Tipo    | Valor por defecto | Descripción                                                                 |
| ---------------- | ------- | ----------------- | --------------------------------------------------------------------------- |
| class            | String  | 'w-full'          | Clases CSS aplicadas al componente.                                         |
| type             | String  | 'text'            | Tipo de input (por ejemplo, 'text', 'email', 'password', etc.).             |
| placeholder      | String  | ''                | Texto de marcador de posición dentro del input.                             |
| severity         | String  | 'error'           | Severidad del mensaje de error o validación (por ejemplo, 'error', 'info'). |
| size             | String  | 'small'           | Tamaño del del mensaje de error que se muestra por debajo del input (por ejemplo, 'small', 'medium', 'large').            |
| variant          | String  | 'simple'          | Variante visual del mensaje de error (por ejemplo, 'simple', 'outlined', etc.).        |
| errorMessages    | String  | ''                | Mensaje de error personalizado a mostrar.                                   |
| showIcon         | Boolean | false             | Si se debe mostrar un icono en el input.                                    |
| appendIcon       | String  | ''                | Icono al final dentro del input.                                            |
| prependInnerIcon | String  | ''                | Icono al inicio dentro del input.                                           |
| clearIcon        | String  | ''                | Icono que se muestra para limpiar el input.                                 |
| autocomplete     | String  | 'off'             | Atributo HTML para controlar el autocompletado del navegador.               |
| label            | String  | ''                | Etiqueta flotante descriptiva del input.                                             |
| id               | String  | -                 | ID único para el campo, útil para accesibilidad o pruebas.                  |
| mask             | String  | ''                | Máscara de entrada para formatear datos como fechas, teléfonos, etc.        |
