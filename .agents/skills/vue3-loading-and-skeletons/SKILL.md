---
name: vue3-loading-and-skeletons
description: Reglas y directrices para la gestión unificada de estados de carga, uso de AppLoader vs AppSkeleton y sincronización con TanStack Query en vue-3-template.
---

# Gestión Canónica de Estados de Carga: `AppLoader` vs `AppSkeleton`

Estándar para garantizar una experiencia de usuario fluida y libre de bloqueos indeseados en la interfaz de `vue-3-template`.

---

## 1. Principio Fundamental: Bloqueo vs Carga Progresiva

| Tipo de Operación                                        | Componente a Utilizar                                | Justificación UX / Técnica                                                                                                                                  |
| :------------------------------------------------------- | :--------------------------------------------------- | :---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Mutaciones (POST, PUT, PATCH, DELETE)**                | **`AppLoader`** (Overlay global bloqueante)          | Protege la integridad transaccional bloqueando el teclado y puntero para evitar doble envío (_double-submit_), clics duplicados o inconsistencia de estado. |
| **Descargas / Exportación de Archivos (Blob PDF/Excel)** | **`AppLoader`** o spinner en botón                   | Indica que el servidor está preparando el archivo binario y previene solicitudes múltiples en cola.                                                         |
| **Consultas de Datos (GET / `useQuery`)**                | **`AppSkeleton`** (Carga progresiva)                 | Mantiene el layout estable, evita saltos de contenido (_layout shifts_) y **NO bloquea** la navegación ni el puntero del usuario.                           |
| **Refetch en Segundo Plano / Paginación / Búsqueda**     | **`keepPreviousData` + estado sutil (`isFetching`)** | Muestra los datos previos mientras la nueva página se descarga de forma reactiva y transparente.                                                            |

---

## 2. Configuración Mandatoria de TanStack Query (`vueQuery.ts`)

Las consultas (`queries`) deben llevar por defecto `meta: { skipLoader: true }` en la configuración global de `QueryClient`.

- **Prohibido:** Permitir que una consulta de tabla o un _polling_ periódico (como el resumen de dashboard cada 30s) active el overlay bloqueante `AppLoader`.
- Si una consulta puntual de alta criticidad requiere explícitamente el overlay global, debe declararlo de forma intencional:
  ```ts
  useQuery({
    queryKey: ['critical-bootstrap'],
    queryFn: fetchCriticalData,
    meta: { skipLoader: false },
  });
  ```

---

## 3. Uso Obligatorio de `AppSkeleton` en Vistas y Subvistas

Toda vista que consuma listas, tablas o datos estructurados debe envolver su visualización en `<AppSkeleton>` condicionado a `isPending`:

### A. Para Tablas (`AppDataTable`):

```html
<AppSkeleton
  :loading="isPending"
  variant="table"
  :rows="10"
  :columns="headers"
  show-paginator
>
  <AppDataTable
    :headers="headers"
    :items="items"
    :paginator="true"
    :per_page="pagination.per_page"
    :total_items="pagination.total_items"
    :page="pagination.page"
    @page-update="handlePagination"
    @per-page-update="handlePerPagePagination"
  >
    <!-- Slots de columnas -->
  </AppDataTable>
</AppSkeleton>
```

### B. Para Dashboards y Métricas:

```html
<AppSkeleton :loading="isPending" variant="stats" :cards-count="4">
  <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
    <!-- Tarjetas de métricas -->
  </div>
</AppSkeleton>
```

### C. Para Vistas de Detalle:

```html
<AppSkeleton :loading="isPending || !entity" variant="card">
  <!-- Contenido de detalle -->
</AppSkeleton>
```

---

## 4. Checklist de Validación

- [ ] Las consultas de lectura (`useQuery`) no activan el overlay de pantalla completa `AppLoader`.
- [ ] El _polling_ automático (ej. `refetchInterval`) corre silenciosamente sin bloquear clics ni navegación.
- [ ] Los modales con `useMutation` muestran `:is-loading="isPending"` o activan el loader global durante el envío.
- [ ] No existen textos de carga planos tipo `<i class="pi pi-spin pi-spinner"></i> Cargando...` en vistas principales; se emplea `AppSkeleton`.
