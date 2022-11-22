import { useEffect, useState } from 'react';

type UseScrollToClosestErrorConfig = {
  enabled: boolean;
};

type UseScrollToClosestErrorResult = {
  doScrollToClosestError: () => void;
};

export function useScrollToClosestError({
  enabled
}: UseScrollToClosestErrorConfig): UseScrollToClosestErrorResult {
  const [scroll, setScroll] = useState<number>(0);

  useEffect(() => {
    // Do not scroll on the initial call of the useEffect,
    // and do not scroll when `scrollToClosestError` is `false`.
    if (scroll === 0 || !enabled) {
      return;
    }

    // Scroll after 200 milliseconds to give teh FormError's time
    // to render.
    const timeoutId = setTimeout(() => {
      const firstError = document.querySelector('.invalid-feedback');

      // First get the FormError's outer div, then the parent which
      // should be a <FormGroup> and scroll to that point.
      firstError?.parentElement?.parentElement?.scrollIntoView({
        behavior: 'smooth'
      });
    }, 200);

    // Cancel the timeout when the SubmitButton is no longer rendered,
    // and when the SubmitButton is clicked rapidly, only scroll
    // for the last click (debounce).
    return () => {
      return clearTimeout(timeoutId);
    };
  }, [scroll, enabled]);

  function doScrollToClosestError() {
    setScroll((value) => value + 1);
  }

  return {
    doScrollToClosestError
  };
}
