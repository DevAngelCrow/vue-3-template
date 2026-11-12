import { computed, nextTick, onBeforeUnmount, onMounted, ref } from 'vue';

export interface UseTurnstileOptions {
  siteKey?: string;
  theme?: 'light' | 'dark' | 'auto';
  autoMount?: boolean;
}

const SCRIPT_ELEMENT_ID = 'cf-turnstile-script';
const SCRIPT_SRC =
  'https://challenges.cloudflare.com/turnstile/v0/api.js?onload=onloadTurnstileCallback&render=explicit';

const readEnvSiteKey = (): string => {
  const raw: unknown = import.meta.env.VITE_CLOUDFLARE_TURNSTILE_SITE_KEY;
  return typeof raw === 'string' && raw.trim().length > 0 ? raw.trim() : '';
};

export function useTurnstile(options: UseTurnstileOptions = {}) {
  const resolvedSiteKey = (options.siteKey ?? readEnvSiteKey()).trim();
  const hasSiteKey = computed(() => resolvedSiteKey.length > 0);

  const token = ref<string>('');
  const widgetId = ref<string | null>(null);
  const containerRef = ref<HTMLElement | null>(null);
  let scriptLoadListener: (() => void) | null = null;

  const renderWidget = () => {
    if (!window.turnstile || !containerRef.value || widgetId.value) {
      return;
    }

    try {
      widgetId.value = window.turnstile.render(containerRef.value, {
        sitekey: resolvedSiteKey,
        theme: options.theme ?? 'light',
        callback: (issuedToken: string) => {
          token.value = issuedToken;
        },
        'expired-callback': () => {
          token.value = '';
        },
        'error-callback': () => {
          token.value = '';
        },
      });
    } catch (error) {
      console.error('Error al inicializar Cloudflare Turnstile:', error);
    }
  };

  const init = async () => {
    if (!hasSiteKey.value) return;
    await nextTick();
    if (!containerRef.value) return;

    if (window.turnstile) {
      renderWidget();
      return;
    }

    window.onloadTurnstileCallback = () => {
      renderWidget();
    };

    const existingScript = document.getElementById(SCRIPT_ELEMENT_ID);
    if (!existingScript) {
      const script = document.createElement('script');
      script.id = SCRIPT_ELEMENT_ID;
      script.src = SCRIPT_SRC;
      script.async = true;
      script.defer = true;
      script.onload = () => {
        if (!widgetId.value) {
          renderWidget();
        }
      };
      document.head.appendChild(script);
      return;
    }

    scriptLoadListener = () => {
      if (!widgetId.value) {
        renderWidget();
      }
    };
    existingScript.addEventListener('load', scriptLoadListener);
  };

  const reset = () => {
    if (!widgetId.value) return;
    try {
      window.turnstile?.reset?.(widgetId.value);
    } catch {
      // Ignorar errores al reiniciar widget Turnstile
    }
    token.value = '';
  };

  const remove = () => {
    if (scriptLoadListener) {
      document
        .getElementById(SCRIPT_ELEMENT_ID)
        ?.removeEventListener('load', scriptLoadListener);
      scriptLoadListener = null;
    }
    if (!widgetId.value) return;
    try {
      window.turnstile?.remove?.(widgetId.value);
    } catch {
      // Ignorar errores al desmontar widget Turnstile
    }
    widgetId.value = null;
    token.value = '';
  };

  if (options.autoMount !== false) {
    onMounted(() => {
      if (hasSiteKey.value) {
        void init();
      }
    });
  }

  onBeforeUnmount(() => {
    remove();
  });

  return {
    hasSiteKey,
    token,
    widgetId,
    containerRef,
    init,
    reset,
    remove,
  };
}
