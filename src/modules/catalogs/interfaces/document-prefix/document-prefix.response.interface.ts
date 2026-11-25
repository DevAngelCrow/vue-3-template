import { GlobalStatusResponse } from '../global-status/global-status.response.interface';

export interface DocumentPrefixResponse {
  id: string;
  code: string;
  prefix: string;
  name: string;
  description?: string | null;
  entity_target: string;
  current_year?: number | null;
  current_value: number;
  padding: number;
  reset_yearly: boolean;
  separator: string;
  next_preview: string;
  active: boolean;
  status?: GlobalStatusResponse;
}
