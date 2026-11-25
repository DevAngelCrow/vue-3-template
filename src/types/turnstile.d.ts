export interface TurnstileWidgetOptions {
  sitekey: string;
  theme?: 'light' | 'dark' | 'auto';
  callback?: (token: string) => void;
  'expired-callback'?: () => void;
  'error-callback'?: (errorCode?: string) => void;
}

export interface TurnstileInstance {
  render(
    container: string | HTMLElement,
    options: TurnstileWidgetOptions,
  ): string;
  reset?(widgetId?: string): void;
  remove?(widgetId?: string): void;
}

declare global {
  interface Window {
    turnstile?: TurnstileInstance;
    onloadTurnstileCallback?: () => void;
  }
}
