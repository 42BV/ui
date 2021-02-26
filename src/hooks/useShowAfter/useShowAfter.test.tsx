import { renderHook, act } from '@testing-library/react-hooks';

import { useShowAfter } from './useShowAfter';

describe('useShowAfter', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  test('that the  useShowAfter starts with false but changes to true after the after parameter amount of milliseconds', () => {
    const { result } = renderHook(() => useShowAfter(200), {
      initialProps: false
    });

    expect(result.current).toBe(false);

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
    const { unmount } = renderHook(() => useShowAfter(200));

    const spy = jest.spyOn(window, 'clearTimeout');

    unmount();

    expect(window.clearTimeout).toHaveBeenCalledTimes(1);

    (spy as jest.Mock).mockClear();
  });
});
