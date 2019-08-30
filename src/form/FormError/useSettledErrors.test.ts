import { renderHook, act } from '@testing-library/react-hooks';

import { useSettledErrors } from './useSettledErrors';
import { Meta, MetaError } from '../types';

describe('useSettledErrors', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  describe('initialisation', () => {
    test('when array that it returns an array', () => {
      const { result } = renderHook<Meta, MetaError[]>(() =>
        useSettledErrors({ touched: true, error: ['Big error', 'Small error'] })
      );

      expect(result.current).toEqual(['Big error', 'Small error']);
    });

    test('when single value return array', () => {
      const { result } = renderHook<Meta, MetaError[]>(() =>
        useSettledErrors({ touched: true, error: 'Big error' })
      );

      expect(result.current).toEqual(['Big error']);
    });
  });

  describe('cleanup', () => {
    test('that window clearTimeout is called', () => {
      const { unmount } = renderHook<Meta, MetaError[]>(() =>
        useSettledErrors({ active: true, error: ['Big error', 'Small error'] })
      );

      const spy = jest.spyOn(window, 'clearTimeout');

      unmount();

      expect(window.clearTimeout).toHaveBeenCalledTimes(1);

      (spy as jest.Mock).mockClear();
    });
  });

  describe('scenarios', () => {
    test('active with errors shows the error', () => {
      const { result, rerender } = renderHook<Meta, MetaError[]>(
        meta => useSettledErrors(meta),
        {
          initialProps: {}
        }
      );

      // It should start of with zero errors
      expect(result.current).toEqual([]);

      // When it becomes active it should show the error after 5000 milliseconds
      rerender({ active: true, error: 'Big error' });

      act(() => {
        jest.advanceTimersByTime(4999);
      });
      expect(result.current).toEqual([]);

      act(() => {
        jest.advanceTimersByTime(1);
      });
      expect(result.current).toEqual(['Big error']);
    });

    test('active without errors hides the error', () => {
      const { result, rerender } = renderHook<Meta, MetaError[]>(
        meta => useSettledErrors(meta),
        {
          initialProps: { error: 'Big error', active: true }
        }
      );

      // It should start of with the error
      expect(result.current).toEqual(['Big error']);

      // When if the error is cleared it should hide the error after 100 milliseconds
      rerender({ active: true, error: undefined });

      act(() => {
        jest.advanceTimersByTime(99);
      });
      expect(result.current).toEqual(['Big error']);

      act(() => {
        jest.advanceTimersByTime(1);
      });
      expect(result.current).toEqual([]);
    });

    test('inactive and touched with error shows error', () => {
      const { result, rerender } = renderHook<Meta, MetaError[]>(
        meta => useSettledErrors(meta),
        {
          initialProps: { error: undefined, touched: false, active: true }
        }
      );

      // It should start of with zero errors
      expect(result.current).toEqual([]);

      // When no longer active but touched show the error after 100 milliseconds
      rerender({ active: false, touched: true, error: 'Small error' });

      act(() => {
        jest.advanceTimersByTime(99);
      });
      expect(result.current).toEqual([]);

      act(() => {
        jest.advanceTimersByTime(1);
      });
      expect(result.current).toEqual(['Small error']);
    });

    test('inactive and untouched with error hides error immediately', () => {
      const { result, rerender } = renderHook<Meta, MetaError[]>(
        meta => useSettledErrors(meta),
        {
          initialProps: { error: 'Big error', touched: true, active: false }
        }
      );

      // It should start of with errors
      expect(result.current).toEqual(['Big error']);

      // When no longer active and pristine hide the error after 100 milliseconds
      rerender({ active: false, touched: false, error: 'Big error' });

      expect(result.current).toEqual([]);
    });

    test('inactive without errors hides error', () => {
      const { result, rerender } = renderHook<Meta, MetaError[]>(
        meta => useSettledErrors(meta),
        {
          initialProps: { error: 'Small error', active: true }
        }
      );

      // It should start of with the error
      expect(result.current).toEqual(['Small error']);

      // When no longer active and pristine hide the error after 2000 milliseconds
      rerender({ active: false, error: undefined });

      act(() => {
        jest.advanceTimersByTime(1999);
      });
      expect(result.current).toEqual(['Small error']);

      act(() => {
        jest.advanceTimersByTime(1);
      });
      expect(result.current).toEqual([]);
    });
  });
});
