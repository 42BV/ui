import { act, renderHook } from '@testing-library/react';

import { useSettledErrors } from './useSettledErrors';
import { Meta, MetaError } from '../types';

type Config = { meta: Meta; value: any };

describe('useSettledErrors', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  function setup(config: Config) {
    return renderHook<MetaError[], Config>(
      (props) => useSettledErrors(props.meta, props.value),
      {
        initialProps: config
      }
    );
  }

  describe('initialisation', () => {
    test('when array that it returns an array', () => {
      const { result } = setup({
        meta: { touched: true, error: ['Big error', 'Small error'] },
        value: 'test'
      });

      expect(result.current).toEqual(['Big error', 'Small error']);
    });

    test('when single value return array', () => {
      const { result } = setup({
        meta: { touched: true, error: 'Big error' },
        value: 'test'
      });

      expect(result.current).toEqual(['Big error']);
    });
  });

  describe('cleanup', () => {
    test('that window clearTimeout is called', () => {
      const { unmount } = setup({
        meta: { active: true, error: ['Big error', 'Small error'] },
        value: 'test'
      });

      const spy = jest.spyOn(window, 'clearTimeout');

      unmount();

      expect(window.clearTimeout).toHaveBeenCalledTimes(1);

      (spy as jest.Mock).mockClear();
    });
  });

  describe('scenarios', () => {
    test('active with errors shows the error', () => {
      const { result, rerender } = setup({
        meta: {},
        value: 'test'
      });

      // It should start of with zero errors
      expect(result.current).toEqual([]);

      // When it becomes active it should show the error after 5000 milliseconds
      rerender({ meta: { active: true, error: 'Big error' }, value: 'henk' });

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
      const { result, rerender } = setup({
        meta: { error: 'Big error', active: true },
        value: 'test'
      });

      // It should start of with the error
      expect(result.current).toEqual(['Big error']);

      // When if the error is cleared it should hide the error after 100 milliseconds
      rerender({ meta: { active: true, error: undefined }, value: 'henk' });

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
      const { result, rerender } = setup({
        meta: { error: undefined, touched: false, active: true },
        value: 'test'
      });

      // It should start of with zero errors
      expect(result.current).toEqual([]);

      // When no longer active but touched show the error after 100 milliseconds
      rerender({
        meta: { active: false, touched: true, error: 'Small error' },
        value: 'henk'
      });

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
      const { result, rerender } = setup({
        meta: { error: 'Big error', touched: true, active: false },
        value: 'test'
      });

      // It should start of with errors
      expect(result.current).toEqual(['Big error']);

      // When no longer active and pristine hide the error after 100 milliseconds
      rerender({
        meta: { active: false, touched: false, error: 'Big error' },
        value: 'henk'
      });

      expect(result.current).toEqual([]);
    });

    test('inactive without errors hides error', () => {
      const { result, rerender } = setup({
        meta: { error: 'Small error', active: true },
        value: 'test'
      });

      // It should start of with the error
      expect(result.current).toEqual(['Small error']);

      // When no longer active and pristine hide the error after 2000 milliseconds
      rerender({ meta: { active: false, error: undefined }, value: 'henk' });

      act(() => {
        jest.advanceTimersByTime(1999);
      });
      expect(result.current).toEqual(['Small error']);

      act(() => {
        jest.advanceTimersByTime(1);
      });
      expect(result.current).toEqual([]);
    });

    test('that errors are cached by value, but removed after a while', () => {
      // We start with a value "small-error" which will produce a "Small error"
      const { result, rerender } = setup({
        meta: { error: 'Small error', active: true },
        value: 'small-error'
      });

      // Show the error coming from the active to showErrors
      act(() => {
        jest.advanceTimersByTime(5000);
      });
      expect(result.current).toEqual(['Small error']);

      // Set the value to "small-error" with no error (undefined), to
      // simulate an async validation which `final-form` will set the
      // error to undefined
      rerender({
        meta: { active: true, error: undefined },
        value: 'small-error'
      });

      // It should use the error from the cache, even though error
      // was undefined. But set a timer to clear it after
      // 2000 milliseconds.
      act(() => {
        jest.advanceTimersByTime(100);
      });
      expect(result.current).toEqual(['Small error']);

      // It should clear the error after 2000 milliseconds
      act(() => {
        jest.advanceTimersByTime(2000);
      });

      expect(result.current).toEqual([]);
    });
  });
});
