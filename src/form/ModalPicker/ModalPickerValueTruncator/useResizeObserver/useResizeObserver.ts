export function useResizeObserver(handleResize: () => void) {
  return typeof ResizeObserver !== 'undefined'
    ? new ResizeObserver((entries) => entries.forEach(handleResize))
    : undefined;
}
