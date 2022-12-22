import React from 'react';
import { render } from '@testing-library/react';
import { vi } from 'vitest';

import { PasswordStrength } from '../PasswordStrength';

describe.skip('Hook: useRules', () => {
  it('should set compliant for each rule based on password', () => {
    vi.spyOn(React, 'useEffect').mockImplementation((fn) => fn());

    const setCompliantSpy = vi.fn();
    vi.spyOn(React, 'useState').mockReturnValueOnce([
      { lowercase: false },
      setCompliantSpy
    ]);
    vi.spyOn(React, 'useState').mockReturnValue([0, vi.fn()]);

    render(
      <PasswordStrength
        rules={[
          'lowercase',
          'uppercase',
          'number',
          'specialChar',
          'minimumLength',
          'noSpace'
        ]}
        password="password"
        minimumLength={10}
      />
    );

    expect(setCompliantSpy).toBeCalledTimes(1);
    expect(setCompliantSpy).toBeCalledWith({
      lowercase: true,
      uppercase: false,
      number: false,
      specialChar: false,
      minimumLength: false,
      noSpace: true
    });
  });
});
