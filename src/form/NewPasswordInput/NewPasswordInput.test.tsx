import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

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
      <NewPasswordInput onChange={jest.fn()} {...props} label="Password" />
    );
    return { container };
  }

  test('ui', () => {
    const { container } = setup({ value: 'test' });
    expect(container).toMatchSnapshot();
  });

  test('default all rules enabled', () => {
    setup({});
    expect(screen.queryByText('Must contain at least one lowercase letter')).toBeInTheDocument();
    expect(screen.queryByText('Must contain at least one uppercase letter')).toBeInTheDocument();
    expect(screen.queryByText('Must contain at least one number')).toBeInTheDocument();
    expect(screen.queryByText('Must contain at least one special character (@#$%^&+=.,?!)')).toBeInTheDocument();
    expect(screen.queryByText('Must contain at least 10 characters')).toBeInTheDocument();
    expect(screen.queryByText('Must not contain any space')).toBeInTheDocument();
  });

  test('disable lowercase check', () => {
    setup({ lowercase: false });
    expect(screen.queryByText('Must contain at least one lowercase letter')).not.toBeInTheDocument();
  });

  test('disable uppercase check', () => {
    setup({ uppercase: false });
    expect(screen.queryByText('Must contain at least one uppercase letter')).not.toBeInTheDocument();
  });

  test('disable number check', () => {
    setup({ number: false });
    expect(screen.queryByText('Must contain at least one number')).not.toBeInTheDocument();
  });

  test('disable special character check', () => {
    setup({ specialCharacter: false });
    expect(screen.queryByText('Must contain at least one special character (@#$%^&+=.,?!)')).not.toBeInTheDocument();
  });

  test('disable minimum length check', () => {
    setup({ minimumLength: 0 });
    expect(screen.queryByText('Must contain at least 10 characters')).not.toBeInTheDocument();
  });

  test('disable no space check', () => {
    setup({ noSpace: false });
    expect(screen.queryByText('Must not contain any space')).not.toBeInTheDocument();
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
