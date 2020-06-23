// @ts-nocheck

export function setResizeObserver(newResizeObserver: any) {
  const oldResizeObserver = window.ResizeObserver
    ? window.ResizeObserver
    : undefined;

  window.ResizeObserver = newResizeObserver;

  return oldResizeObserver;
}
