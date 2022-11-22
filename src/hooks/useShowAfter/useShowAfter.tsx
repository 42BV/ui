import { useEffect, useState } from 'react';

/**
 * Returns `false` but after a predetermined `after` time returns
 * `true`.
 *
 * Useful for wanting to show content only after a time. For example
 * to not show a loading spinner to soon, only
 * after it takes a while.
 *
 * @param after The amount of time in milliseconds after which the return value should become `true`.
 */
export function useShowAfter(after: number): boolean {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setShow(true);
    }, after);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [after]);

  return show;
}
