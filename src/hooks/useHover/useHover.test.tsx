import { useHover } from './useHover';
import React from 'react';
import { act, renderHook } from '@testing-library/react';
import { vi } from 'vitest';

describe.skip('useHover', () => {
  it('should set hover to true when onMouseEnter is called', () => {
    const setHoverSpy = vi.fn();
    vi.spyOn(React, 'useState').mockReturnValue([false, setHoverSpy]);
    const {
      result: {
        current: [, { onMouseEnter }]
      }
    } = renderHook(() => useHover());
    act(() => {
      onMouseEnter();
    });
    expect(setHoverSpy).toBeCalledTimes(1);
    expect(setHoverSpy).toBeCalledWith(true);
  });

  it('should set hover to false when onMouseLeave is called', () => {
    const setHoverSpy = vi.fn();
    vi.spyOn(React, 'useState').mockReturnValue([true, setHoverSpy]);
    const {
      result: {
        current: [, { onMouseLeave }]
      }
    } = renderHook(() => useHover());
    act(() => {
      onMouseLeave();
    });
    expect(setHoverSpy).toBeCalledTimes(1);
    expect(setHoverSpy).toBeCalledWith(false);
  });
});
