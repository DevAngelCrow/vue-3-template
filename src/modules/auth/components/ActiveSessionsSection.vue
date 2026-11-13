<template>
  <div class="flex w-full flex-col justify-start gap-4">
    <section
      name="sessions-header"
      class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"
    >
      <div class="flex flex-col gap-1">
        <span class="text-2xl font-extrabold">Sesiones activas</span>
        <p class="text-sm text-surface-500 dark:text-surface-400">
          Dispositivos con acceso activo mediante token de actualización.
        </p>
      </div>

      <div class="flex flex-col gap-2 sm:flex-row sm:items-center">
        <Button
          type="button"
          label="Actualizar"
          icon="pi pi-refresh"
          outlined
          size="small"
          :loading="isFetching"
          :disabled="isRevokingAll"
          @click="handleRefresh"
        />
        <Button
          v-if="sessions.length > 0"
          type="button"
          label="Cerrar todas"
          icon="pi pi-sign-out"
          severity="danger"
          outlined
          size="small"
          :loading="isRevokingAll"
          :disabled="isFetching || revokingId !== null"
          @click="revokeAllSessions"
        />
      </div>
    </section>

    <AppSkeleton :loading="isFetching" variant="card" :count="2">
      <div
        v-if="sessions.length === 0"
        class="rounded-xl border border-surface-200 bg-surface-50 p-4 text-sm text-surface-500 dark:border-surface-700 dark:bg-surface-800/40 dark:text-surface-400"
      >
        No se encontraron sesiones activas registradas.
      </div>

      <div v-else class="grid grid-cols-1 gap-3 md:grid-cols-2">
        <div
          v-for="session in sessions"
          :key="session.id"
          class="flex flex-col justify-between gap-3 rounded-xl border border-surface-200 bg-surface-0 p-4 dark:border-surface-700 dark:bg-surface-900/60"
        >
          <div class="flex items-start justify-between gap-2">
            <div class="min-w-0 flex-1 space-y-1">
              <div class="flex items-center gap-2">
                <i class="pi pi-desktop text-primary-500 shrink-0" />
                <span class="truncate font-semibold">
                  {{
                    session.device_name || formatUserAgent(session.user_agent)
                  }}
                </span>
              </div>
              <p class="text-xs text-surface-500 dark:text-surface-400">
                IP: {{ session.ip_address || 'No disponible' }}
              </p>
              <p class="text-xs text-surface-500 dark:text-surface-400">
                Último uso:
                {{
                  formatTimestamp(session.last_used_at || session.created_at)
                }}
              </p>
              <p class="text-xs text-surface-500 dark:text-surface-400">
                Expira: {{ formatTimestamp(session.expired_at) }}
              </p>
            </div>

            <Button
              type="button"
              icon="pi pi-trash"
              severity="danger"
              variant="text"
              rounded
              v-tooltip.bottom="'Revocar sesión'"
              aria-label="Revocar sesión"
              :loading="revokingId === session.id"
              :disabled="
                isRevokingAll ||
                (revokingId !== null && revokingId !== session.id)
              "
              @click="revokeSession(session.id)"
            />
          </div>
        </div>
      </div>
    </AppSkeleton>
  </div>
</template>

<script setup lang="ts">
import dayjs from 'dayjs';
import { Button } from 'primevue';

import { useActiveSessions } from '../composables/useActiveSessions';

defineOptions({ name: 'ActiveSessionsSection' });

const {
  sessions,
  isFetching,
  revokingId,
  isRevokingAll,
  refetch,
  revokeSession,
  revokeAllSessions,
} = useActiveSessions();

const formatTimestamp = (value: string | null): string => {
  if (!value) return 'No disponible';
  const parsed = dayjs(value);
  return parsed.isValid() ? parsed.format('DD/MM/YYYY HH:mm') : value;
};

const formatUserAgent = (ua: string | null): string => {
  if (!ua || ua.trim().length === 0) return 'Dispositivo desconocido';
  return ua.length > 48 ? `${ua.slice(0, 48)}...` : ua;
};

const handleRefresh = () => {
  void refetch();
};
</script>
