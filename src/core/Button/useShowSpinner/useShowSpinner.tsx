import { useEffect, useState } from "react";

/**
 * Only show the Spinner when 200 milliseconds have past.
 * This prevents very short loading periods from showing the animation,
 * seeing the Spinner very briefly looks very glitchy.
 *
 * @param show
 */
export function useShowSpinner(show: boolean): boolean {
  const [showSpinner, setShowSpinner] = useState(show);

  useEffect(() => {
    if (show) {
      const timer = window.setTimeout(() => {
        setShowSpinner(true);
      }, 200);

      return () => {
        window.clearTimeout(timer);
      };
    } else {
      setShowSpinner(false);
    }
  }, [show]);

  return showSpinner;
}
