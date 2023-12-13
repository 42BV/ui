import { useHover } from './useHover';
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
    expect(setHoverSpy).toBeCalledTimes(1);
    expect(setHoverSpy).toBeCalledWith(true);
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
    expect(setHoverSpy).toBeCalledTimes(1);
    expect(setHoverSpy).toBeCalledWith(false);
  });
});
