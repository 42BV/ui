export function setResizeObserver(newResizeObserver: any) {
  // @ts-expect-error Accept that ResizeObserver might exists for this browser
  const oldResizeObserver = window.ResizeObserver
    ? // @ts-expect-error Accept that ResizeObserver might exists for this browser
      window.ResizeObserver
    : undefined;

  // @ts-expect-error Accept that ResizeObserver might exists for this browser
  window.ResizeObserver = newResizeObserver;

  return oldResizeObserver;
}
