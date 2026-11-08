export type WorkflowSeverity =
  'primary' | 'secondary' | 'success' | 'info' | 'warn' | 'danger';

export interface WorkflowTransition {
  event: string;
  label: string;
  target_status: string;
  icon?: string;
  severity?: WorkflowSeverity;
  requires_payload?: boolean;
  requires_reason?: boolean;
  requires_confirmation?: boolean;
  confirmation_message?: string;
  allowed?: boolean;
  payload_schema?: Record<string, string>;
}

export interface WorkflowMetadata {
  allowed_transitions: WorkflowTransition[];
  is_locked: boolean;
  can_cancel: boolean;
  can_register_payment: boolean;
}
