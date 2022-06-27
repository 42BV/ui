import { RefObject, useCallback, useLayoutEffect, useState } from 'react';
import { useResizeObserver } from '../useResizeObserver/useResizeObserver';

export function useComponentOverflow<T>(
  ref: RefObject<HTMLElement>,
  values: T | T[]
): boolean {
  const [ componentOverflow, setComponentOverflow ] = useState(
    isOverflowing(ref.current)
  );

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const handleResize = useCallback(
    handleResizeCallback(ref, setComponentOverflow),
    [ ref ]
  );

  const resizeObserver = useResizeObserver(handleResize);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useLayoutEffect(layoutEffect(ref, handleResize, resizeObserver), [
    ref,
    handleResize,
    values,
    resizeObserver
  ]);

  return componentOverflow;
}

export function isOverflowing(el: HTMLElement | null): boolean {
  return el ? el.clientWidth < el.scrollWidth : false;
}

export function handleResizeCallback(
  ref: RefObject<HTMLElement>,
  setComponentOverflow: (value: boolean) => void
): () => void {
  return () => {
    if (ref.current) {
      setComponentOverflow(isOverflowing(ref.current));
    }
  };
}

export function layoutEffect(
  ref: RefObject<HTMLElement>,
  handleResize: () => void,
  resizeObserver?: any
): () => (() => void) | void {
  return () => {
    if (!ref.current) {
      return;
    }

    handleResize();

    const el = ref.current;

    if (resizeObserver) {
      resizeObserver.observe(el);

      return () => {
        resizeObserver.unobserve(el);
      };
    }

    el.addEventListener('resize', handleResize, { passive: true });

    return () => {
      el.removeEventListener('resize', handleResize);
    };
  };
}
