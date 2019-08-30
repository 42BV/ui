import { renderHook, act } from '@testing-library/react-hooks';

import { useButtonColor } from './useButtonColor';

describe('useButtonColor', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  test('that the color is debounced', () => {
    const { result, rerender } = renderHook(color => useButtonColor(color), {
      initialProps: 'red'
    });

    expect(result.current).toBe('red');

    rerender('blue');

    // Should after 99 milliseconds still be red
    act(() => {
      jest.advanceTimersByTime(99);
    });
    expect(result.current).toBe('red');

    // Should after 100 milliseconds become blue
    act(() => {
      jest.advanceTimersByTime(1);
    });
    expect(result.current).toBe('blue');
  });

  test('cleanup: that window clearTimeout is called', () => {
    const { unmount } = renderHook(() => useButtonColor('red'));

    const spy = jest.spyOn(window, 'clearTimeout');

    unmount();

    expect(window.clearTimeout).toHaveBeenCalledTimes(1);

    (spy as jest.Mock).mockClear();
  });
});
