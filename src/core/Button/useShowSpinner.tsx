import { useEffect, useState } from 'react';

/**
 * Only show the Spinner when 200 milliseconds have passed.
 * This prevents very short loading periods from showing the animation,
 * seeing the Spinner very briefly looks like a visual glitch.
 *
 * @param show
 */
export function useShowSpinner(show: boolean): boolean {
  const [showSpinner, setShowSpinner] = useState(show);

  useEffect(() => {
    let timer = 0;
    if (show) {
      timer = window.setTimeout(() => {
        setShowSpinner(true);
      }, 200);
    } else {
      setShowSpinner(false);
    }

    return () => {
      window.clearTimeout(timer);
    };
  }, [show]);

  return showSpinner;
}
