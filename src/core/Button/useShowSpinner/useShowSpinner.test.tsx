import { act, renderHook } from '@testing-library/react';

import { useShowSpinner } from './useShowSpinner';

describe('useShowSpinner', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  test('that the showSpinner is debounced', () => {
    const { result, rerender } = renderHook((show) => useShowSpinner(show), {
      initialProps: false
    });

    expect(result.current).toBe(false);

    rerender(true);

    // Should after 199 milliseconds still be false
    act(() => {
      jest.advanceTimersByTime(199);
    });
    expect(result.current).toBe(false);

    // Should after 200 milliseconds become true
    act(() => {
      jest.advanceTimersByTime(1);
    });
    expect(result.current).toBe(true);
  });

  test('cleanup: that window clearTimeout is called', () => {
    const { unmount } = renderHook(() => useShowSpinner(true));

    const spy = jest.spyOn(window, 'clearTimeout');

    unmount();

    expect(window.clearTimeout).toHaveBeenCalledTimes(1);

    (spy as jest.Mock).mockClear();
  });
});
