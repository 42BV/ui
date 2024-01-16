import { act, renderHook } from '@testing-library/react';

import { useScrollToClosestError } from './useScrollToClosestError';

describe('useScrollToClosestError', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  describe('when enabled', () => {
    it('should not scroll on initialization, after initialization it should scroll with a debounce', async () => {
      expect.assertions(16);

      const scrollIntoViewSpy = jest.fn();

      // @ts-expect-error Mock test
      jest.spyOn(document, 'querySelector').mockImplementation(() => {
        return {
          parentElement: {
            parentElement: {
              scrollIntoView: scrollIntoViewSpy
            }
          }
        };
      });

      const { result } = renderHook(() =>
        useScrollToClosestError({ enabled: true })
      );

      // Should not scroll the first time as the hook is initializing.
      expect(document.querySelector).toHaveBeenCalledTimes(0);
      expect(scrollIntoViewSpy).toHaveBeenCalledTimes(0);

      // Even after 200 seconds it should not be called
      jest.advanceTimersByTime(200);
      expect(document.querySelector).toHaveBeenCalledTimes(0);
      expect(scrollIntoViewSpy).toHaveBeenCalledTimes(0);

      // Now call doScrollToClosestError for the second time.
      // But only after 200 milliseconds it should be run due to the debounce
      await act(() => {
        result.current.doScrollToClosestError();
      });
      jest.advanceTimersByTime(199);
      expect(document.querySelector).toHaveBeenCalledTimes(0);
      expect(scrollIntoViewSpy).toHaveBeenCalledTimes(0);

      // It should be called after 200 milliseconds
      jest.advanceTimersByTime(1);
      expect(document.querySelector).toHaveBeenCalledTimes(1);
      expect(scrollIntoViewSpy).toHaveBeenCalledTimes(1);
      expect(scrollIntoViewSpy).toHaveBeenCalledWith({ behavior: 'smooth' });

      // Let's test if the debounce works properly
      await act(() => {
        result.current.doScrollToClosestError();
      });
      jest.advanceTimersByTime(199);
      expect(document.querySelector).toHaveBeenCalledTimes(1);
      expect(scrollIntoViewSpy).toHaveBeenCalledTimes(1);

      // Now quickly call again within the 200 milliseconds
      // and cross the debounce threshold.
      await act(() => {
        result.current.doScrollToClosestError();
      });
      jest.advanceTimersByTime(1);
      // The scroll should not be called due to the debounce
      expect(document.querySelector).toHaveBeenCalledTimes(1);
      expect(scrollIntoViewSpy).toHaveBeenCalledTimes(1);

      // Now it should trigger the debounced scroll
      jest.advanceTimersByTime(199);
      expect(document.querySelector).toHaveBeenCalledTimes(2);
      expect(scrollIntoViewSpy).toHaveBeenCalledTimes(2);
      expect(scrollIntoViewSpy).toHaveBeenCalledWith({ behavior: 'smooth' });
    });

    describe('enabled but element not found scenarios', () => {
      it('it should not scroll when no .invalid-feedback element is found', () => {
        // @ts-expect-error Mock test
        jest.spyOn(document, 'querySelector').mockImplementation(() => {
          return undefined;
        });

        checkNoScroll();
      });

      it('should not scroll when no parent is found on the .invalid-feedback element', () => {
        // @ts-expect-error Mock test
        jest.spyOn(document, 'querySelector').mockImplementation(() => {
          return {
            parentElement: undefined
          };
        });

        checkNoScroll();
      });

      it('should not scroll when no grandparent is found on the .invalid-feedback element', () => {
        // @ts-expect-error Mock test
        jest.spyOn(document, 'querySelector').mockImplementation(() => {
          return {
            parentElement: {
              parentElement: undefined
            }
          };
        });

        checkNoScroll();
      });

      function checkNoScroll() {
        const { result } = renderHook(() =>
          useScrollToClosestError({ enabled: true })
        );

        act(() => {
          result.current.doScrollToClosestError();
        });

        act(() => {
          jest.advanceTimersByTime(200);
        });

        expect(document.querySelector).toHaveBeenCalledTimes(1);
      }
    });
  });

  it('should when disabled never scroll to the closest error', () => {
    jest.spyOn(document, 'querySelector');

    const { result } = renderHook(() =>
      useScrollToClosestError({ enabled: false })
    );

    // Should not scroll
    act(() => {
      result.current.doScrollToClosestError();
    });

    act(() => {
      jest.advanceTimersByTime(200);
    });

    expect(document.querySelector).toHaveBeenCalledTimes(0);
  });
});
