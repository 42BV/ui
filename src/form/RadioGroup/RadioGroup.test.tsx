import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

import { RadioGroup, Text } from './RadioGroup';
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

jest.mock('../useOptions', () => {
  return { useOptions: jest.fn() };
});

describe('Component: RadioGroup', () => {
  function setup({
    value,
    isOptionEnabled,
    text,
    hasPlaceholder,
    hasLabel,
    horizontal,
    canClear,
    loading = false,
    isAsync,
    expectedSize = 3
  }: {
    value?: User;
    isOptionEnabled?: IsOptionEnabled<User>;
    text?: Text;
    hasPlaceholder?: boolean;
    hasLabel?: boolean;
    horizontal?: boolean;
    canClear?: boolean;
    loading?: boolean;
    isAsync?: boolean;
    expectedSize?: number;
  }) {
    const onChangeSpy = jest.fn();
    const onBlurSpy = jest.fn();

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
      valid: false,
      horizontal,
      canClear,
      id: hasLabel ? 'subject' : undefined,
      label: 'Subject',
      hiddenLabel: !hasLabel
    };

    const { container, rerender } = render(<RadioGroup<User> {...props} />);

    return {
      container,
      props,
      rerender,
      onChangeSpy,
      onBlurSpy
    };
  }

  describe('ui', () => {
    test('default', () => {
      const { container } = setup({ value: adminUser() });
      expect(container).toMatchSnapshot();
    });

    test('with value', () => {
      setup({ value: adminUser() });
      expect(screen.getAllByRole('radio')[0]).toBeChecked();
    });

    test('loading', () => {
      const { container } = setup({ loading: true });
      expect(container).toMatchSnapshot();
    });

    test('with placeholder', () => {
      setup({ hasPlaceholder: true });
      expect(
        screen.queryByText('Please enter your subject')
      ).toBeInTheDocument();
    });

    test('without placeholder', () => {
      setup({ hasPlaceholder: false });
      expect(
        screen.queryByText('Please enter your subject')
      ).not.toBeInTheDocument();
    });

    test('with label', () => {
      setup({ hasLabel: true });
      expect(screen.queryByText('Subject')).toBeInTheDocument();
    });

    test('without label', () => {
      setup({ hasLabel: false });
      expect(screen.queryByText('Subject')).not.toBeInTheDocument();
    });

    test('horizontal', () => {
      setup({ horizontal: true });
      expect(
        screen.getAllByRole('radio')[0].parentNode?.parentNode
      ).toHaveClass('form-check-inline');
    });
  });

  test('async options', () => {
    setup({ isAsync: true, expectedSize: 100 });
    // Expects are done in the setup, useOptions implementation mocking
  });

  describe('events', () => {
    test('onChange', () => {
      const { onChangeSpy } = setup({
        value: undefined,
        isOptionEnabled: undefined
      });

      fireEvent.click(screen.getAllByRole('radio')[0]);

      expect(onChangeSpy).toHaveBeenCalledTimes(1);
      expect(onChangeSpy).toHaveBeenCalledWith(adminUser());
    });

    it('should clear the value when the clear button is clicked', () => {
      const { onChangeSpy } = setup({
        value: adminUser(),
        canClear: true
      });

      fireEvent.click(screen.getByText('Clear'));

      expect(onChangeSpy).toHaveBeenCalledTimes(1);
      expect(onChangeSpy).toHaveBeenCalledWith(undefined);
    });

    describe('isOptionEnabled', () => {
      it('should always be true when "isOptionEnabled" is not defined', () => {
        setup({
          value: adminUser(),
          isOptionEnabled: undefined
        });

        expect(screen.queryAllByRole('radio').length).toBe(3);

        expect(screen.getAllByRole('radio')[0]).not.toBeDisabled();
        expect(screen.getAllByRole('radio')[1]).not.toBeDisabled();
        expect(screen.getAllByRole('radio')[2]).not.toBeDisabled();
      });

      it('should use isOptionEnabled to determine if the option is enabled when it is defined', () => {
        const isOptionEnabledSpy = jest.fn();

        // Disabled all option now
        isOptionEnabledSpy.mockReturnValue(false);

        setup({
          value: undefined,
          isOptionEnabled: isOptionEnabledSpy
        });

        expect(screen.queryAllByRole('radio').length).toBe(3);

        expect(screen.getAllByRole('radio')[0]).toBeDisabled();
        expect(screen.getAllByRole('radio')[1]).toBeDisabled();
        expect(screen.getAllByRole('radio')[2]).toBeDisabled();

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
        isOptionEnabled: undefined
      });

      expect(screen.getAllByRole('radio')[0]).not.toBeChecked();
      expect(screen.getAllByRole('radio')[1]).not.toBeChecked();
      expect(screen.getAllByRole('radio')[2]).toBeChecked();

      const newProps = {
        ...props,
        value: undefined
      };

      rerender(<RadioGroup {...newProps} />);

      expect(screen.getAllByRole('radio')[0]).not.toBeChecked();
      expect(screen.getAllByRole('radio')[1]).not.toBeChecked();
      expect(screen.getAllByRole('radio')[2]).not.toBeChecked();
    });

    test('becomes filled', () => {
      const { props, rerender } = setup({
        value: undefined,
        isOptionEnabled: undefined
      });

      expect(screen.getAllByRole('radio')[0]).not.toBeChecked();
      expect(screen.getAllByRole('radio')[1]).not.toBeChecked();
      expect(screen.getAllByRole('radio')[2]).not.toBeChecked();

      const newProps = {
        ...props,
        value: coordinatorUser()
      };

      rerender(<RadioGroup {...newProps} />);

      expect(screen.getAllByRole('radio')[0]).not.toBeChecked();
      expect(screen.getAllByRole('radio')[1]).toBeChecked();
      expect(screen.getAllByRole('radio')[2]).not.toBeChecked();
    });
  });
});
