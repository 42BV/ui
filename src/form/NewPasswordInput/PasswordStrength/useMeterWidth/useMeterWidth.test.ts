import React from 'react';
import { vi } from 'vitest';

import { useMeterWidth } from './useMeterWidth';
import { renderHook } from '@testing-library/react';

describe.skip('Hook: useMeterWidth', () => {
  it('should set meter width based on rules', () => {
    vi.spyOn(React, 'useEffect').mockImplementation((fn) => fn());

    const setMeterWidthSpy = vi.fn();
    vi.spyOn(React, 'useState').mockReturnValue([0, setMeterWidthSpy]);

    renderHook(() => useMeterWidth({ lowercase: true }));

    expect(setMeterWidthSpy).toBeCalledTimes(1);
    expect(setMeterWidthSpy).toBeCalledWith(100);
  });
});
