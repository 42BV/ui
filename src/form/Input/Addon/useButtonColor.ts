import { useEffect, useState } from 'react';

/**
 * Prevents the color from changing to fast.
 */
export function useButtonColor(color: string): string {
  const [buttonColor, setButtonColor] = useState(color);

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      setButtonColor(color);
    }, 100);

    return () => {
      window.clearTimeout(timeout);
    };
  }, [color]);

  return buttonColor;
}
