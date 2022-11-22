import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

import { Select, Text } from './Select';
import { User } from '../../test/types';
import {
  adminUser,
  coordinatorUser,
  listOfUsers,
  pageOfUsers,
  pageOfUsersFetcher,
  userUser
} from '../../test/fixtures';
import { IsOptionEnabled } from '../option';

import { pageOf } from '../../utilities/page/page';
import { useOptions } from '../useOptions';
import userEvent from '@testing-library/user-event';

function setup({
  value,
  isOptionEnabled,
  text,
  hasPlaceholder,
  hasLabel,
  loading = false,
  valid,
  isAsync,
  expectedSize = 3
}: {
  value?: User;
  isOptionEnabled?: IsOptionEnabled<User>;
  text?: Text;
  hasPlaceholder?: boolean;
  hasLabel?: boolean;
  loading?: boolean;
  valid?: boolean;
  isAsync?: boolean;
  expectedSize?: number;
}) {
  const onChangeSpy = jest.fn();
  const onBlurSpy = jest.fn();

  // @ts-expect-error This is in fact a mock
  useOptions.mockImplementation(
    ({ options, pageNumber, query, size, optionsShouldAlwaysContainValue }) => {
      expect(pageNumber).toBe(1);
      expect(query).toBe('');
      expect(size).toBe(expectedSize);
      expect(optionsShouldAlwaysContainValue).toBe(true);

      return {
        page: isAsync ? pageOfUsers() : pageOf(options, pageNumber, size),
        loading
      };
    }
  );

  const props = {
    placeholder: hasPlaceholder ? 'Please enter your subject' : undefined,
    text,
    isOptionEnabled,
    labelForOption: (user: User) => user?.email,
    options: isAsync ? () => pageOfUsersFetcher() : listOfUsers(),
    value,
    onChange: onChangeSpy,
    onBlur: onBlurSpy,
    error: 'Some error',
    valid,
    id: hasLabel ? 'subject' : undefined,
    label: 'Subject',
    hiddenLabel: !hasLabel
  };

  const { container, rerender } = render(<Select {...props} />);

  return { container, props, rerender, onChangeSpy, onBlurSpy };
}

jest.mock('../useOptions', () => {
  return { useOptions: jest.fn() };
});

describe('Component: Select', () => {
  describe('ui', () => {
    test('default', () => {
      const { container } = setup({});
      expect(container).toMatchSnapshot();
    });

    test('with value', () => {
      setup({ value: adminUser() });
      // @ts-expect-error Selected is an existing property on option tags
      expect(screen.getByRole('option', { name: 'admin@42.nl' }).selected).toBe(
        true
      );
    });

    test('without value', () => {
      setup({ hasPlaceholder: true });
      // @ts-expect-error Selected is an existing property on option tags
      expect(screen.getByRole('option', { name: 'admin@42.nl' }).selected).toBe(
        false
      );
      expect(
        // @ts-expect-error Selected is an existing property on option tags
        screen.getByRole('option', { name: 'coordinator@42.nl' }).selected
      ).toBe(false);
      // @ts-expect-error Selected is an existing property on option tags
      expect(screen.getByRole('option', { name: 'user@42.nl' }).selected).toBe(
        false
      );
    });

    it('with placeholder', () => {
      setup({ hasPlaceholder: true });
      expect(screen.queryAllByRole('option').length).toBe(4);
      expect(
        screen.queryByText('Please enter your subject')
      ).toBeInTheDocument();
      //prettier-ignore
      // @ts-expect-error Selected is an existing property on option tags
      expect(screen.getByRole('option', { name: 'Please enter your subject' }).selected
      ).toBe(true);
    });

    it('without placeholder', () => {
      setup({ hasPlaceholder: false });
      expect(
        screen.queryByText('Please enter your subject')
      ).not.toBeInTheDocument();
      expect(screen.queryAllByRole('option').length).toBe(3);
    });

    test('visible label', () => {
      setup({ hasLabel: true });
      expect(screen.queryByText('Subject')).toBeInTheDocument();
      expect(screen.queryByLabelText('Subject')).toBeInTheDocument();
    });

    test('invisible label', () => {
      setup({ hasLabel: false });
      expect(screen.queryByText('Subject')).not.toBeInTheDocument();
      expect(screen.queryByLabelText('Subject')).toBeInTheDocument();
    });

    test('valid', () => {
      setup({ valid: true });
      expect(screen.getByRole('combobox')).not.toHaveClass('is-invalid');
      expect(screen.getByRole('combobox')).toHaveClass('is-valid');
    });

    test('invalid', () => {
      setup({ valid: false });
      expect(screen.getByRole('combobox')).toHaveClass('is-invalid');
      expect(screen.getByRole('combobox')).not.toHaveClass('is-valid');
    });

    test('loading', () => {
      const { container } = setup({ loading: true });
      expect(container).toMatchSnapshot();
    });
  });

  test('async options', () => {
    setup({ isAsync: true, expectedSize: 100 });
    // Expects are done in the setup, useOptions implementation mocking
  });

  describe('selectDefaultOption', () => {
    it('should select the placeholder as the default value when value is empty string', () => {
      setup({ hasPlaceholder: true });
      // prettier-ignore
      // @ts-expect-error Select property exists on options
      expect(screen.getByRole('option', { name: 'Please enter your subject' }).selected
      ).toBe(true);
    });
  });

  it('should not select the placeholder as the default value when value is not an empty string', () => {
    setup({ value: adminUser(), hasPlaceholder: true });
    // prettier-ignore
    // @ts-expect-error Select property exists on options
    expect(screen.getByRole('option', { name: 'Please enter your subject' }).selected
    ).toBe(false);
    // @ts-expect-error Select property exists on options
    expect(screen.getByRole('option', { name: 'admin@42.nl' }).selected).toBe(
      true
    );
  });
});

describe('events', () => {
  test('onChange', async () => {
    expect.assertions(6);

    const { onChangeSpy } = setup({});

    await userEvent.selectOptions(
      screen.getByRole('combobox'),
      screen.getByRole('option', { name: 'admin@42.nl' })
    );

    expect(onChangeSpy).toHaveBeenCalledTimes(1);
    expect(onChangeSpy).toHaveBeenCalledWith(adminUser());
  });

  test('onBlur', () => {
    const { onBlurSpy } = setup({
      value: undefined,
      isOptionEnabled: undefined
    });

    fireEvent.blur(screen.getByRole('combobox'));

    expect(onBlurSpy).toHaveBeenCalledTimes(1);
  });

  describe('isOptionEnabled', () => {
    it('should always be true when isOptionEnabled is not defined', () => {
      setup({});

      expect(screen.queryAllByRole('option').length).toBe(3);

      expect(screen.getAllByRole('option')[0]).not.toBeDisabled();
      expect(screen.getAllByRole('option')[1]).not.toBeDisabled();
      expect(screen.getAllByRole('option')[2]).not.toBeDisabled();
    });

    it('should use isOptionEnabled to determine if the option is enabled when it is defined', () => {
      const isOptionEnabledSpy = jest.fn();

      // Disabled all option now
      isOptionEnabledSpy.mockReturnValue(false);

      setup({ isOptionEnabled: isOptionEnabledSpy });

      expect(screen.queryAllByRole('option').length).toBe(3);

      expect(screen.getAllByRole('option')[0]).toBeDisabled();
      expect(screen.getAllByRole('option')[1]).toBeDisabled();
      expect(screen.getAllByRole('option')[2]).toBeDisabled();

      expect(isOptionEnabledSpy).toHaveBeenCalledTimes(3);
      expect(isOptionEnabledSpy.mock.calls).toEqual([
        [adminUser()],
        [coordinatorUser()],
        [userUser()]
      ]);
    });
  });
});

describe('value changes', () => {
  test('becomes empty', () => {
    const { props, rerender } = setup({
      value: userUser(),
      hasPlaceholder: true
    });

    // @ts-expect-error Select property exists on options
    expect(screen.getByRole('option', { name: 'user@42.nl' }).selected).toBe(
      true
    );

    const newProps = {
      ...props,
      value: undefined
    };

    rerender(<Select {...newProps} />);

    // prettier-ignore
    // @ts-expect-error Select property exists on options
    expect(screen.getByRole('option', { name: 'Please enter your subject' }).selected
    ).toBe(true);
    // @ts-expect-error Select property exists on options
    expect(screen.getByRole('option', { name: 'user@42.nl' }).selected).toBe(
      false
    );
  });

  test('becomes filled', () => {
    const { props, rerender } = setup({ hasPlaceholder: true });

    // prettier-ignore
    // @ts-expect-error Select property exists on options
    expect(screen.getByRole('option', { name: 'Please enter your subject' }).selected
    ).toBe(true);

    const newProps = {
      ...props,
      value: userUser()
    };

    rerender(<Select {...newProps} />);

    // prettier-ignore
    // @ts-expect-error Select property exists on options
    expect(screen.getByRole('option', { name: 'Please enter your subject' }).selected
    ).toBe(false);
    // @ts-expect-error Select property exists on options
    expect(screen.getByRole('option', { name: 'user@42.nl' }).selected).toBe(
      true
    );
  });
});
