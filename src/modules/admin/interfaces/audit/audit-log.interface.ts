import { paginateParams } from '@/core/services/interfaces/params.paginate.interface';

export const AUDIT_ACTIONS = [
  'LOGIN_SUCCESS',
  'LOGIN_FAILED',
  'LOGOUT',
  'REVOKE_ALL_SESSIONS',
  'TOKEN_REFRESH',
  'REGISTER',
  'PASSWORD_RESET_REQUESTED',
  'PASSWORD_RESET_COMPLETED',
  'EMAIL_CHANGE_REQUESTED',
  'EMAIL_CHANGE_COMPLETED',
  'DOCS_ACCESS_GRANTED',
  'DOCS_ACCESS_DENIED',
  'USER_CREATED_BY_ADMIN',
  'ROLE_CREATED',
  'ROLE_UPDATED',
  'ROLE_STATUS_TOGGLED',
  'PERMISSION_CREATED',
  'PERMISSION_UPDATED',
  'PERMISSION_STATUS_TOGGLED',
] as const;

export type AuditAction = (typeof AUDIT_ACTIONS)[number];

export interface AuditLogResponse {
  id: string;
  action: AuditAction;
  user_name: string | null;
  user_id: string | null;
  ip_address: string | null;
  user_agent: string | null;
  entity_type: string | null;
  entity_id: string | null;
  metadata: Record<string, unknown> | null;
  created_at: string;
  request_id?: string | null;
}

export interface AuditLogsQueryParams extends paginateParams {
  action?: AuditAction;
  user_id?: string;
  entity_type?: string;
  request_id?: string;
  from?: string;
  to?: string;
}
