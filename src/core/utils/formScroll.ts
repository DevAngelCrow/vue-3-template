import { nextTick } from 'vue';

const INVALID_FIELD_SELECTOR =
  '[aria-invalid="true"], .p-invalid, [data-p-invalid="true"]';

/**
 * Desplaza suavemente el viewport hasta el primer campo inválido dentro de un contenedor
 * tras actualizar el DOM en formularios Vee-Validate + PrimeVue 5.
 */
export async function scrollToFirstError(
  container?: HTMLElement | null,
): Promise<boolean> {
  await nextTick();
  const root = container ?? document;
  const firstInvalid = root.querySelector<HTMLElement>(INVALID_FIELD_SELECTOR);
  if (!firstInvalid) {
    return false;
  }

  firstInvalid.scrollIntoView({ behavior: 'smooth', block: 'center' });
  return true;
}
