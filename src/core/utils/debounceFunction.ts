type DebouncedFunction<T extends (..._args: any[]) => any> = (
  ..._args: Parameters<T>
) => void;

export const debounce = <T extends (..._args: any[]) => any>(
  fn: T,
  delay: number = 700,
): DebouncedFunction<T> => {
  let timeoutId: ReturnType<typeof setTimeout> | null = null;

  return (...args: Parameters<T>): void => {
    if (timeoutId !== null) {
      clearTimeout(timeoutId);
    }

    timeoutId = setTimeout(() => {
      fn(...args);
    }, delay);
  };
};
