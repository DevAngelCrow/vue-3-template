import { computed, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query';

import authServices from '@/core/services/auth.services';
import { useAlertStore } from '@/core/store';
import { useAuthStore } from '@/core/store/useAuthStore';
import { createQueryKeys } from '@/core/utils/queryKeys';

import type { ActiveSessionItem } from '../interfaces/session.interface';

export const authSessionKeys = createQueryKeys('auth-sessions');

export function useActiveSessions() {
  const queryClient = useQueryClient();
  const router = useRouter();
  const alert = useAlertStore();
  const authStore = useAuthStore();
  const revokingId = ref<string | null>(null);

  const { data, isPending, isFetching, refetch } = useQuery({
    queryKey: authSessionKeys.lists(),
    queryFn: async (): Promise<ActiveSessionItem[]> => {
      const response = await authServices.getSessions();
      return Array.isArray(response?.data) ? response.data : [];
    },
    enabled: computed(() => authStore.validSession()),
  });

  const revokeSessionMutation = useMutation({
    mutationFn: (sessionId: string) => {
      revokingId.value = sessionId;
      return authServices.revokeSession(sessionId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: authSessionKeys.all });
      alert.showAlert({
        type: 'success',
        title: 'Sesión revocada',
        content: 'La sesión seleccionada se ha cerrado correctamente.',
      });
    },
    onSettled: () => {
      revokingId.value = null;
    },
  });

  const revokeAllMutation = useMutation({
    mutationFn: () => authServices.revokeAllSessions(),
    onSuccess: async () => {
      authStore.closeSession();
      queryClient.clear();
      alert.showAlert({
        type: 'success',
        title: 'Sesiones cerradas',
        content: 'Se cerraron todas tus sesiones activas.',
      });
      await router.replace({ name: 'login' });
    },
  });

  const revokeSession = async (sessionId: string) => {
    try {
      await revokeSessionMutation.mutateAsync(sessionId);
    } catch {
      // Manejado globalmente por el interceptor HTTP
    }
  };

  const revokeAllSessions = async () => {
    try {
      await revokeAllMutation.mutateAsync();
    } catch {
      // Manejado globalmente por el interceptor HTTP
    }
  };

  return {
    sessions: computed(() => data.value ?? []),
    isPending,
    isFetching,
    revokingId,
    isRevokingAll: revokeAllMutation.isPending,
    refetch,
    revokeSession,
    revokeAllSessions,
  };
}
