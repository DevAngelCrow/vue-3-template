import type { Directive, DirectiveBinding } from 'vue';

import { debounce } from '../utils/debounceFunction';

interface ElementBinding {
  event: string;
  handler: (..._args: any[]) => void;
  debouncedHandler: (..._args: any[]) => void;
}

const elementMap = new WeakMap<HTMLElement, ElementBinding>();

/**
 * @deprecated Esta directiva genera alto acoplamiento con el DOM y los componentes UI.
 * En su lugar, utilice el retardo a nivel de composable con `debounce` de `@/core/utils/debounceFunction`
 * y vincule los eventos nativos de Vue `@click` o `@keydown.enter`.
 */
export const debounceDirective: Directive = {
  mounted(el: HTMLElement, binding: DirectiveBinding) {
    const modifiers = Object.keys(binding.modifiers);

    // Determinar el tipo de evento base
    const eventTypes = [
      'click',
      'input',
      'change',
      'keydown',
      'keyup',
      'keypress',
      'blur',
      'focus',
    ];
    const baseEvent =
      modifiers.find(mod => eventTypes.includes(mod)) || 'click';

    // Filtrar modificadores de evento (los que no son el evento base)
    const eventModifiers = modifiers.filter(mod => !eventTypes.includes(mod));

    const delay = binding?.arg ? parseInt(binding?.arg, 10) : 300;

    // VALIDACIÓN CRÍTICA: Detectar si se está pasando el resultado de una función
    if (typeof binding.value !== 'function') {
      const expression = (binding as any)._getDef?.()?.exp || 'unknown';

      // Deshabilitar el elemento para evitar ejecuciones infinitas
      el.style.opacity = '0.5';
      el.style.cursor = 'not-allowed';
      el.setAttribute('disabled', 'true');

      // Agregar indicador visual de error
      el.style.border = '2px solid red';
      el.title = '⚠️ Error en v-debounce: función mal configurada';

      console.error(
        `🚫 [v-debounce] BLOQUEADO: Se detectó una llamada directa a función.\n\n` +
          `El elemento ha sido deshabilitado para prevenir ejecuciones infinitas.\n\n` +
          `❌ Incorrecto: v-debounce="${expression}"\n` +
          `✅ Correcto:   v-debounce="() => tuFuncion(argumento)"\n\n` +
          `Tipo recibido: ${typeof binding.value}\n` +
          `Valor recibido: ${binding.value}\n\n` +
          `💡 SOLUCIÓN: Envuelve la llamada en una arrow function:\n` +
          `   v-debounce="() => tuFuncion(arg1, arg2)"`,
      );

      // Bloquear cualquier interacción
      const blockHandler = (e: Event) => {
        e.preventDefault();
        e.stopImmediatePropagation();
        console.warn(
          '🚫 [v-debounce] Acción bloqueada. Corrige la sintaxis de la directiva.',
        );
      };

      el.addEventListener(baseEvent, blockHandler, { capture: true });
      elementMap.set(el, {
        event: baseEvent,
        handler: blockHandler as any,
        debouncedHandler: blockHandler as any,
      });

      return;
    }

    const handler = binding.value as (..._args: any[]) => void;

    // Crear un wrapper que maneje los modificadores de teclas
    const wrappedHandler = (event: Event) => {
      // Si hay modificadores de tecla, validarlos
      if (eventModifiers.length > 0 && event instanceof KeyboardEvent) {
        const key = event.key.toLowerCase();

        // Mapeo de modificadores comunes
        const keyMap: Record<string, string[]> = {
          enter: ['enter'],
          tab: ['tab'],
          delete: ['delete', 'backspace'],
          esc: ['escape', 'esc'],
          space: [' ', 'spacebar'],
          up: ['arrowup', 'up'],
          down: ['arrowdown', 'down'],
          left: ['arrowleft', 'left'],
          right: ['arrowright', 'right'],
        };

        // Verificar si algún modificador coincide con la tecla presionada
        const matchesKey = eventModifiers.some(modifier => {
          const validKeys = keyMap[modifier.toLowerCase()] || [
            modifier.toLowerCase(),
          ];
          return validKeys.includes(key);
        });

        // Si no coincide ningún modificador, no ejecutar
        if (!matchesKey) {
          return;
        }
      }

      // Si pasa todas las validaciones, ejecutar el handler
      handler(event);
    };

    const debouncedHandler = debounce(wrappedHandler, delay);

    elementMap.set(el, { event: baseEvent, handler, debouncedHandler });
    el.addEventListener(baseEvent, debouncedHandler);
  },

  updated(el: HTMLElement, binding: DirectiveBinding) {
    const stored = elementMap.get(el);
    if (!stored) return;

    // Validar nuevamente en cada actualización
    if (typeof binding.value !== 'function') {
      const expression = (binding as any)._getDef?.()?.exp || 'unknown';

      // Si no estaba bloqueado antes, bloquearlo ahora
      if (!el.hasAttribute('disabled')) {
        el.style.opacity = '0.5';
        el.style.cursor = 'not-allowed';
        el.setAttribute('disabled', 'true');
        el.style.border = '2px solid red';
        el.title = '⚠️ Error en v-debounce: función mal configurada';

        console.error(
          `🚫 [v-debounce] BLOQUEADO en updated: Se detectó una llamada directa a función.\n\n` +
            `❌ Incorrecto: v-debounce="${expression}"\n` +
            `✅ Correcto:   v-debounce="() => tuFuncion(argumento)"`,
        );
      }
      return;
    }

    const newHandler = binding.value as (..._args: any[]) => void;

    // Solo actualizar si el handler realmente cambió
    if (stored.handler !== newHandler) {
      const modifiers = Object.keys(binding.modifiers);
      const eventTypes = [
        'click',
        'input',
        'change',
        'keydown',
        'keyup',
        'keypress',
        'blur',
        'focus',
      ];
      const baseEvent =
        modifiers.find(mod => eventTypes.includes(mod)) || 'click';
      const eventModifiers = modifiers.filter(mod => !eventTypes.includes(mod));
      const delay = binding?.arg ? parseInt(binding?.arg, 10) : 300;

      // Si estaba bloqueado, desbloquearlo
      if (el.hasAttribute('disabled')) {
        el.style.opacity = '';
        el.style.cursor = '';
        el.removeAttribute('disabled');
        el.style.border = '';
        el.title = '';
      }

      // Remover el listener anterior
      el.removeEventListener(stored.event, stored.debouncedHandler);

      // Crear wrapper con validación de modificadores
      const wrappedHandler = (event: Event) => {
        if (eventModifiers.length > 0 && event instanceof KeyboardEvent) {
          const key = event.key.toLowerCase();
          const keyMap: Record<string, string[]> = {
            enter: ['enter'],
            tab: ['tab'],
            delete: ['delete', 'backspace'],
            esc: ['escape', 'esc'],
            space: [' ', 'spacebar'],
            up: ['arrowup', 'up'],
            down: ['arrowdown', 'down'],
            left: ['arrowleft', 'left'],
            right: ['arrowright', 'right'],
          };

          const matchesKey = eventModifiers.some(modifier => {
            const validKeys = keyMap[modifier.toLowerCase()] || [
              modifier.toLowerCase(),
            ];
            return validKeys.includes(key);
          });

          if (!matchesKey) {
            return;
          }
        }

        newHandler(event);
      };

      // Crear nuevo debounced handler
      const debouncedHandler = debounce(wrappedHandler, delay);

      // Actualizar el mapa
      elementMap.set(el, {
        event: baseEvent,
        handler: newHandler,
        debouncedHandler,
      });

      // Agregar nuevo listener
      el.addEventListener(baseEvent, debouncedHandler);
    }
  },

  unmounted(el: HTMLElement) {
    const stored = elementMap.get(el);
    if (stored) {
      el.removeEventListener(stored.event, stored.debouncedHandler);
      elementMap.delete(el);
    }
  },
};
