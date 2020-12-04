export function useResizeObserver(handleResize: () => void) {
  // See https://developer.mozilla.org/en-US/docs/Web/API/ResizeObserver

  // @ts-expect-error Accept that ResizeObserver might exists for this browser
  return typeof ResizeObserver !== 'undefined'
    ? // @ts-expect-error Accept that ResizeObserver might exists for this browser
      new ResizeObserver((entries) => entries.forEach(handleResize))
    : undefined;
}
