/**
 * Copia texto al portapapeles con soporte para API nativa y fallback seguro
 * para dispositivos móviles o navegadores sin permisos automáticos.
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  if (!text) return false;

  try {
    if (navigator?.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch (err) {
    console.warn(
      'Clipboard API no disponible o denegada, usando fallback:',
      err,
    );
  }

  // Fallback con elemento textarea temporal
  try {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    textArea.setAttribute('readonly', '');
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    const successful = document.execCommand('copy');
    document.body.removeChild(textArea);
    return successful;
  } catch (err) {
    console.error('Error al copiar al portapapeles con método fallback:', err);
    return false;
  }
}
