import { useHover } from './useHover';
import React from 'react';
import { renderHook } from '@testing-library/react';

describe('useHover', () => {
  it('should set hover to true when onMouseEnter is called', () => {
    const setHoverSpy = jest.fn();
    jest.spyOn(React, 'useState').mockReturnValue([false, setHoverSpy]);
    const {
      result: {
        current: [, { onMouseEnter }]
      }
    } = renderHook(() => useHover());
    onMouseEnter();
    expect(setHoverSpy).toHaveBeenCalledTimes(1);
    expect(setHoverSpy).toHaveBeenCalledWith(true);
  });

  it('should set hover to false when onMouseLeave is called', () => {
    const setHoverSpy = jest.fn();
    jest.spyOn(React, 'useState').mockReturnValue([true, setHoverSpy]);
    const {
      result: {
        current: [, { onMouseLeave }]
      }
    } = renderHook(() => useHover());
    onMouseLeave();
    expect(setHoverSpy).toHaveBeenCalledTimes(1);
    expect(setHoverSpy).toHaveBeenCalledWith(false);
  });
});
