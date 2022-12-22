import React from 'react';
import { render, screen } from '@testing-library/react';
import { vi } from 'vitest';

import { isStrongPassword, NewPasswordInput } from './NewPasswordInput';

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
    const { container } = render(
      <NewPasswordInput onChange={vi.fn()} {...props} label="Password" />
    );
    return { container };
  }

  test('ui', () => {
    const { container } = setup({ value: 'test' });
    expect(container).toMatchSnapshot();
  });

  test('default all rules enabled', async () => {
    expect.assertions(0);
    setup({});
    await screen.findByText('Must contain at least one lowercase letter');
    await screen.findByText('Must contain at least one uppercase letter');
    await screen.findByText('Must contain at least one number');
    await screen.findByText(
      'Must contain at least one special character (@#$%^&+=.,?!)'
    );
    await screen.findByText('Must contain at least 10 characters');
    await screen.findByText('Must not contain any space');
  });

  test('disable lowercase check', () => {
    setup({ lowercase: false });
    expect(
      screen.queryByText('Must contain at least one lowercase letter')
    ).toBeNull();
  });

  test('disable uppercase check', () => {
    setup({ uppercase: false });
    expect(
      screen.queryByText('Must contain at least one uppercase letter')
    ).toBeNull();
  });

  test('disable number check', () => {
    setup({ number: false });
    expect(screen.queryByText('Must contain at least one number')).toBeNull();
  });

  test('disable special character check', () => {
    setup({ specialCharacter: false });
    expect(
      screen.queryByText(
        'Must contain at least one special character (@#$%^&+=.,?!)'
      )
    ).toBeNull();
  });

  test('disable minimum length check', () => {
    setup({ minimumLength: 0 });
    expect(
      screen.queryByText('Must contain at least 10 characters')
    ).toBeNull();
  });

  test('disable no space check', () => {
    setup({ noSpace: false });
    expect(screen.queryByText('Must not contain any space')).toBeNull();
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
