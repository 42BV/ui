import React from 'react';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';

import NewPasswordInput, { isStrongPassword } from './NewPasswordInput';

describe('Component: NewPasswordInput', () => {
  function setup(props: {
    value?: string;
    lowercase?: boolean;
    uppercase?: boolean;
    number?: boolean;
    specialCharacter?: boolean;
    minimumLength?: number;
    noSpace?: boolean;
  }) {
    const newPasswordInput = shallow(
      <NewPasswordInput onChange={jest.fn()} {...props} />
    );
    return { newPasswordInput };
  }

  test('ui', () => {
    const { newPasswordInput } = setup({ value: 'test' });
    expect(toJson(newPasswordInput)).toMatchSnapshot(
      'Component: NewPasswordInput => ui => default'
    );
  });

  test('default all rules enabled', () => {
    const { newPasswordInput } = setup({});
    expect(
      // @ts-ignore
      newPasswordInput.find('PasswordStrength').props().rules
    ).toEqual([
      'lowercase',
      'uppercase',
      'number',
      'specialChar',
      'minimumLength',
      'noSpace'
    ]);
  });

  test('disable lowercase check', () => {
    const { newPasswordInput } = setup({ lowercase: false });
    expect(
      // @ts-ignore
      newPasswordInput.find('PasswordStrength').props().rules
    ).toEqual([
      'uppercase',
      'number',
      'specialChar',
      'minimumLength',
      'noSpace'
    ]);
  });

  test('disable uppercase check', () => {
    const { newPasswordInput } = setup({ uppercase: false });
    expect(
      // @ts-ignore
      newPasswordInput.find('PasswordStrength').props().rules
    ).toEqual([
      'lowercase',
      'number',
      'specialChar',
      'minimumLength',
      'noSpace'
    ]);
  });

  test('disable number check', () => {
    const { newPasswordInput } = setup({ number: false });
    expect(
      // @ts-ignore
      newPasswordInput.find('PasswordStrength').props().rules
    ).toEqual([
      'lowercase',
      'uppercase',
      'specialChar',
      'minimumLength',
      'noSpace'
    ]);
  });

  test('disable special character check', () => {
    const { newPasswordInput } = setup({ specialCharacter: false });
    expect(
      // @ts-ignore
      newPasswordInput.find('PasswordStrength').props().rules
    ).toEqual(['lowercase', 'uppercase', 'number', 'minimumLength', 'noSpace']);
  });

  test('disable minimum length check', () => {
    const { newPasswordInput } = setup({ minimumLength: 0 });
    expect(
      // @ts-ignore
      newPasswordInput.find('PasswordStrength').props().rules
    ).toEqual(['lowercase', 'uppercase', 'number', 'specialChar', 'noSpace']);
  });

  test('disable no space check', () => {
    const { newPasswordInput } = setup({ noSpace: false });
    expect(
      // @ts-ignore
      newPasswordInput.find('PasswordStrength').props().rules
    ).toEqual([
      'lowercase',
      'uppercase',
      'number',
      'specialChar',
      'minimumLength'
    ]);
  });

  describe('isStrongPassword', () => {
    it('should return undefined when validator passes', () => {
      const validator = isStrongPassword(
        [
          'lowercase',
          'uppercase',
          'number',
          'specialChar',
          'minimumLength',
          'noSpace'
        ],
        10
      );
      expect(validator('Pa$$w0rd42', {}, undefined)).toBe(undefined);
    });

    it('should return translatable when validator fails', () => {
      const validator = isStrongPassword(
        [
          'lowercase',
          'uppercase',
          'number',
          'specialChar',
          'minimumLength',
          'noSpace'
        ],
        10
      );
      expect(validator('password', {}, undefined)).toEqual({
        key: 'NewPasswordInput.NOT_STRONG_ENOUGH',
        fallback: 'Password does not follow rules'
      });
    });
  });
});
