import React from 'react';

import { useMeterWidth } from './useMeterWidth';

describe('Hook: useMeterWidth', () => {
  it('should set meter width based on rules', () => {
    jest.spyOn(React, 'useEffect').mockImplementation(fn => fn());

    const setMeterWidthSpy = jest.fn();
    jest.spyOn(React, 'useState').mockReturnValue([0, setMeterWidthSpy]);

    useMeterWidth({ lowercase: true });

    expect(setMeterWidthSpy).toBeCalledTimes(1);
    expect(setMeterWidthSpy).toBeCalledWith(100);
  });
});
