import React from 'react';

import { useMeterWidth } from './useMeterWidth';
import { renderHook } from '@testing-library/react';

describe('Hook: useMeterWidth', () => {
  it('should set meter width based on rules', () => {
    jest.spyOn(React, 'useEffect').mockImplementation((fn) => fn());

    const setMeterWidthSpy = jest.fn();
    jest.spyOn(React, 'useState').mockReturnValue([0, setMeterWidthSpy]);

    renderHook(() => useMeterWidth({ lowercase: true }));

    expect(setMeterWidthSpy).toHaveBeenCalledTimes(1);
    expect(setMeterWidthSpy).toHaveBeenCalledWith(100);
  });
});
