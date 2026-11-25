import { computed, reactive, ref, watch } from 'vue';
import { keepPreviousData, useQuery } from '@tanstack/vue-query';

import { TableHeaders } from '@/core/interfaces';
import { CreateDateFromFormat, FormatDate } from '@/core/utils/dates';
import { debounce } from '@/core/utils/debounceFunction';
import { createQueryKeys } from '@/core/utils/queryKeys';

import {
  AUDIT_ACTIONS,
  AuditAction,
  AuditLogResponse,
  AuditLogsQueryParams,
} from '../interfaces/audit/audit-log.interface';
import adminServices from '../services/admin.services';

export type FilterAuditLogsType = {
  action?: AuditAction;
  entity_type?: string;
  user_id?: string;
  request_id?: string;
  from?: string;
  to?: string;
};

export const auditLogsKeys = createQueryKeys<
  FilterAuditLogsType & { page?: number; per_page?: number }
>('admin-audit-logs');

const toIsoBoundary = (
  dateStr: string | undefined,
  boundary: 'start' | 'end',
): string | undefined => {
  if (!dateStr) return undefined;
  const parsed = CreateDateFromFormat(dateStr, 'DD/MM/YYYY');
  if (!parsed) return undefined;
  if (boundary === 'start') {
    parsed.setHours(0, 0, 0, 0);
  } else {
    parsed.setHours(23, 59, 59, 999);
  }
  return parsed.toISOString();
};

export function useAuditLogs() {
  const headers = ref<TableHeaders[]>([
    {
      field: 'created_at',
      header: 'Fecha',
      sortable: false,
      alignHeaders: 'start',
      alignItems: 'start',
    },
    {
      field: 'action',
      header: 'Acción',
      sortable: false,
      alignHeaders: 'start',
      alignItems: 'start',
    },
    {
      field: 'user_name',
      header: 'Usuario',
      sortable: false,
      alignHeaders: 'start',
      alignItems: 'start',
    },
    {
      field: 'entity_type',
      header: 'Entidad',
      sortable: false,
      alignHeaders: 'start',
      alignItems: 'start',
    },
    {
      field: 'ip_address',
      header: 'IP',
      sortable: false,
      alignHeaders: 'start',
      alignItems: 'start',
    },
    {
      field: 'request_id',
      header: 'Request ID',
      sortable: false,
      alignHeaders: 'start',
      alignItems: 'start',
    },
    {
      field: 'acciones',
      header: 'Acciones',
      sortable: false,
      alignHeaders: 'center',
      alignItems: 'center',
    },
  ]);

  const actionOptions = AUDIT_ACTIONS.map(action => ({
    label: action,
    value: action,
  }));

  const pagination = reactive({
    page: 1,
    per_page: 10,
    total_items: 0,
  });

  const filter = reactive<FilterAuditLogsType>({
    action: undefined,
    entity_type: undefined,
    user_id: undefined,
    request_id: undefined,
    from: undefined,
    to: undefined,
  });

  const appliedFilter = reactive<FilterAuditLogsType>({
    action: undefined,
    entity_type: undefined,
    user_id: undefined,
    request_id: undefined,
    from: undefined,
    to: undefined,
  });

  const {
    data: auditLogsQueryResult,
    isPending,
    isFetching,
    refetch: refetchAuditLogs,
  } = useQuery({
    queryKey: computed(() =>
      auditLogsKeys.list({
        page: pagination.page,
        per_page: pagination.per_page,
        action: appliedFilter.action || undefined,
        entity_type: appliedFilter.entity_type || undefined,
        user_id: appliedFilter.user_id || undefined,
        request_id: appliedFilter.request_id || undefined,
        from: appliedFilter.from || undefined,
        to: appliedFilter.to || undefined,
      }),
    ),
    queryFn: async () => {
      const params: AuditLogsQueryParams = {
        page: pagination.page,
        per_page: pagination.per_page,
        action: appliedFilter.action || undefined,
        entity_type: appliedFilter.entity_type?.trim() || undefined,
        user_id: appliedFilter.user_id?.trim() || undefined,
        request_id: appliedFilter.request_id?.trim() || undefined,
        from: toIsoBoundary(appliedFilter.from, 'start'),
        to: toIsoBoundary(appliedFilter.to, 'end'),
      };
      const response = await adminServices.getAuditLogs(params);
      if (response.statusCode === 200) {
        return response.data;
      }
      return null;
    },
    placeholderData: keepPreviousData,
  });

  watch(
    () => auditLogsQueryResult.value,
    newData => {
      if (newData) {
        pagination.total_items = newData.total_items ?? 0;
      }
    },
    { immediate: true },
  );

  const auditLogs = computed<AuditLogResponse[]>(
    () => auditLogsQueryResult.value?.data ?? [],
  );

  const findAuditLogs = () => {
    pagination.page = 1;
    appliedFilter.action = filter.action || undefined;
    appliedFilter.entity_type = filter.entity_type?.trim() || undefined;
    appliedFilter.user_id = filter.user_id?.trim() || undefined;
    appliedFilter.request_id = filter.request_id?.trim() || undefined;
    appliedFilter.from = filter.from || undefined;
    appliedFilter.to = filter.to || undefined;
  };

  const cleanSearch = () => {
    filter.action = undefined;
    filter.entity_type = undefined;
    filter.user_id = undefined;
    filter.request_id = undefined;
    filter.from = undefined;
    filter.to = undefined;

    appliedFilter.action = undefined;
    appliedFilter.entity_type = undefined;
    appliedFilter.user_id = undefined;
    appliedFilter.request_id = undefined;
    appliedFilter.from = undefined;
    appliedFilter.to = undefined;
    pagination.page = 1;
  };

  const debouncedFindAuditLogs = debounce(findAuditLogs, 500);
  const debouncedCleanSearch = debounce(cleanSearch, 500);

  const formatAuditDate = (value: string | null | undefined) =>
    FormatDate(value, 'DD/MM/YYYY HH:mm:ss') ?? '—';

  return {
    headers,
    actionOptions,
    pagination,
    filter,
    auditLogs,
    isPending,
    isFetching,
    refetchAuditLogs,
    debouncedFindAuditLogs,
    debouncedCleanSearch,
    formatAuditDate,
  };
}
