import { useHover } from './useHover';
import React from 'react';

describe('useHover', () => {
  it('should set hover to true when onMouseEnter is called', () => {
    const setHoverSpy = jest.fn();
    jest.spyOn(React, 'useState').mockReturnValue([false, setHoverSpy]);
    const [, { onMouseEnter }] = useHover();
    onMouseEnter();
    expect(setHoverSpy).toBeCalledTimes(1);
    expect(setHoverSpy).toBeCalledWith(true);
  });

  it('should set hover to false when onMouseLeave is called', () => {
    const setHoverSpy = jest.fn();
    jest.spyOn(React, 'useState').mockReturnValue([true, setHoverSpy]);
    const [, { onMouseLeave }] = useHover();
    onMouseLeave();
    expect(setHoverSpy).toBeCalledTimes(1);
    expect(setHoverSpy).toBeCalledWith(false);
  });
});
