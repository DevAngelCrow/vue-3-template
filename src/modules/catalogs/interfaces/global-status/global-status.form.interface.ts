export interface GlobalStatusForm {
  id?: number;
  code: string;
  name: string;
  description?: string;
  active?: boolean;
  state_color?: string;
  text_color?: string;
  id_category_status?: number;
}
