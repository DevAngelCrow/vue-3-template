import { readonly, ref } from 'vue';

const MOBILE_MEDIA_QUERY = '(max-width: 767px)';

const isMobileState = ref<boolean>(
  typeof window !== 'undefined' ? window.innerWidth < 768 : false,
);

let initialized = false;

const initMediaQuery = () => {
  if (initialized || typeof window === 'undefined') return;
  initialized = true;

  if (typeof window.matchMedia === 'function') {
    const mediaQuery = window.matchMedia(MOBILE_MEDIA_QUERY);
    isMobileState.value = mediaQuery.matches;

    const handleChange = (event: MediaQueryListEvent) => {
      isMobileState.value = event.matches;
    };

    mediaQuery.addEventListener('change', handleChange);
  }
};

export const useMobileViewport = () => {
  initMediaQuery();

  return {
    isMobile: readonly(isMobileState),
  };
};
