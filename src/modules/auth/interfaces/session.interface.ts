export interface ActiveSessionItem {
  id: string;
  created_at: string;
  last_used_at: string | null;
  expired_at: string;
  ip_address: string | null;
  user_agent: string | null;
  device_name: string | null;
}
