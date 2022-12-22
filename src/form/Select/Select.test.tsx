import React from 'react';
import { vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';

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

vi.mock('../useOptions', () => {
  return { useOptions: vi.fn() };
});

describe('Component: Select', () => {
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
    const onChangeSpy = vi.fn();
    const onBlurSpy = vi.fn();

    // @ts-expect-error This is in fact a mock
    useOptions.mockImplementation(
      ({
        options,
        pageNumber,
        query,
        size,
        optionsShouldAlwaysContainValue
      }) => {
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

    it('with placeholder', async () => {
      expect.assertions(6);
      setup({ hasPlaceholder: true });
      expect(screen.queryAllByRole('option').length).toBe(4);
      await screen.findByText('Please enter your subject');
      expect(
        screen
          // @ts-expect-error Selected is an existing property on option tags
          .getByRole('option', { name: 'Please enter your subject' }).selected
      ).toBe(true);
    });

    it('without placeholder', () => {
      setup({ hasPlaceholder: false });
      expect(screen.queryByText('Please enter your subject')).toBeNull();
      expect(screen.queryAllByRole('option').length).toBe(3);
    });

    test('visible label', async () => {
      expect.assertions(4);
      setup({ hasLabel: true });
      await screen.findByText('Subject');
      await screen.findByLabelText('Subject');
    });

    test('invisible label', async () => {
      expect.assertions(5);
      setup({ hasLabel: false });
      expect(screen.queryByText('Subject')).toBeNull();
      await screen.findByLabelText('Subject');
    });

    test('valid', () => {
      setup({ valid: true });
      expect(
        screen.getByRole('combobox').classList.contains('is-invalid')
      ).toBe(false);
      expect(screen.getByRole('combobox').classList.contains('is-valid')).toBe(
        true
      );
    });

    test('invalid', () => {
      setup({ valid: false });
      expect(
        screen.getByRole('combobox').classList.contains('is-invalid')
      ).toBe(true);
      expect(screen.getByRole('combobox').classList.contains('is-valid')).toBe(
        false
      );
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
      expect(
        screen
          // @ts-expect-error Select property exists on options
          .getByRole('option', { name: 'Please enter your subject' }).selected
      ).toBe(true);
    });

    it('should not select the placeholder as the default value when value is not an empty string', () => {
      setup({ value: adminUser(), hasPlaceholder: true });
      expect(
        screen
          // @ts-expect-error Select property exists on options
          .getByRole('option', { name: 'Please enter your subject' }).selected
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

        // @ts-expect-error Form elements have property disabled
        expect(screen.getAllByRole('option')[0].disabled).toEqual(false);
        // @ts-expect-error Form elements have property disabled
        expect(screen.getAllByRole('option')[1].disabled).toEqual(false);
        // @ts-expect-error Form elements have property disabled
        expect(screen.getAllByRole('option')[2].disabled).toEqual(false);
      });

      it('should use isOptionEnabled to determine if the option is enabled when it is defined', () => {
        const isOptionEnabledSpy = vi.fn();

        // Disabled all option now
        isOptionEnabledSpy.mockReturnValue(false);

        setup({ isOptionEnabled: isOptionEnabledSpy });

        expect(screen.queryAllByRole('option').length).toBe(3);

        // @ts-expect-error Form elements have property disabled
        expect(screen.getAllByRole('option')[0].disabled).toEqual(true);
        // @ts-expect-error Form elements have property disabled
        expect(screen.getAllByRole('option')[1].disabled).toEqual(true);
        // @ts-expect-error Form elements have property disabled
        expect(screen.getAllByRole('option')[2].disabled).toEqual(true);

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

      expect(
        screen
          // @ts-expect-error Select property exists on options
          .getByRole('option', { name: 'Please enter your subject' }).selected
      ).toBe(true);
      // @ts-expect-error Select property exists on options
      expect(screen.getByRole('option', { name: 'user@42.nl' }).selected).toBe(
        false
      );
    });

    test('becomes filled', () => {
      const { props, rerender } = setup({ hasPlaceholder: true });

      expect(
        screen
          // @ts-expect-error Select property exists on options
          .getByRole('option', { name: 'Please enter your subject' }).selected
      ).toBe(true);

      const newProps = {
        ...props,
        value: userUser()
      };

      rerender(<Select {...newProps} />);

      expect(
        screen
          // @ts-expect-error Select property exists on options
          .getByRole('option', { name: 'Please enter your subject' }).selected
      ).toBe(false);
      // @ts-expect-error Select property exists on options
      expect(screen.getByRole('option', { name: 'user@42.nl' }).selected).toBe(
        true
      );
    });
  });
});
