import React from 'react';
import { shallow } from 'enzyme';

import PasswordStrength from '../PasswordStrength';

describe('Hook: useRules', () => {
  it('should set compliant for each rule based on password', () => {
    jest.spyOn(React, 'useEffect').mockImplementation(fn => fn());

    const setCompliantSpy = jest.fn();
    jest
      .spyOn(React, 'useState')
      .mockReturnValueOnce([{ lowercase: false }, setCompliantSpy]);
    jest.spyOn(React, 'useState').mockReturnValue([0, jest.fn()]);

    shallow(
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
