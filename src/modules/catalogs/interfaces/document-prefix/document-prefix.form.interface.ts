export interface DocumentPrefixForm {
  id?: string;
  code: string;
  prefix: string;
  name: string;
  description?: string;
  entity_target: string;
  padding: number;
  reset_yearly: boolean;
  separator: string;
  current_value: number;
  active?: boolean;
}
