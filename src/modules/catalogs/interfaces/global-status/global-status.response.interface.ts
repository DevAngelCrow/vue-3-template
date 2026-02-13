import { CategoryStatus } from './global-status.category-status.interface';

export interface GlobalStatusResponse {
  id: number;
  table_header: string;
  name: string;
  description: string;
  active: boolean;
  state_color: string;
  text_color: string;
  category_status: CategoryStatus;
}
