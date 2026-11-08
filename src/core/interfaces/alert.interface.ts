export interface Alert {
  show?: boolean;
  type?: 'success' | 'info' | 'warning' | 'error';
  icon?: string;
  title?: string;
  content?: string;
  closable?: boolean;
  maxWidth?: number;
  timeout?: number;
}
