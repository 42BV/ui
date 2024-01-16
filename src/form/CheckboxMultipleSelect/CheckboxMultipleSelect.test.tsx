import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

import { CheckboxMultipleSelect, Text } from './CheckboxMultipleSelect';
import { User } from '../../test/types';
import {
  adminUser,
  coordinatorUser,
  listOfUsers,
  pageOfUsers,
  pageOfUsersFetcher,
  userUser
} from '../../test/fixtures';

import { pageOf } from '../../utilities/page/page';
import { useOptions } from '../useOptions';
import { IsOptionEnabled } from '../option';

jest.mock('../useOptions', () => {
  return { useOptions: jest.fn() };
});

describe('Component: CheckboxMultipleSelect', () => {
  function setup({
    value,
    isOptionEnabled,
    text,
    hasPlaceholder,
    hasLabel,
    horizontal,
    loading,
    optionsShouldAlwaysContainValueConfig,
    isAsync,
    expectedSize = 3
  }: {
    value?: User[];
    isOptionEnabled?: IsOptionEnabled<User>;
    options?: User[];
    text?: Text;
    hasPlaceholder?: boolean;
    hasLabel?: boolean;
    horizontal?: boolean;
    hasIsOptionEqual?: boolean;
    loading?: boolean;
    optionsShouldAlwaysContainValueConfig?: boolean;
    isAsync?: boolean;
    expectedSize?: number;
  }) {
    const onChangeSpy = jest.fn();
    const onBlurSpy = jest.fn();

    // @ts-expect-error This is in fact a mock
    useOptions.mockImplementation(
      ({ options, pageNumber, size, optionsShouldAlwaysContainValue }) => {
        expect(pageNumber).toBe(1);
        expect(size).toBe(expectedSize);
        expect(optionsShouldAlwaysContainValue).toBe(
          optionsShouldAlwaysContainValueConfig ?? true
        );

        return {
          page: isAsync ? pageOfUsers() : pageOf(options, pageNumber, size),
          loading
        };
      }
    );

    const props = {
      placeholder: hasPlaceholder ? 'Please select your provinces' : undefined,
      text,
      isOptionEnabled,
      options: isAsync ? () => pageOfUsersFetcher() : listOfUsers(),
      labelForOption: (user: User) => user.email,
      value,
      onChange: onChangeSpy,
      onBlur: onBlurSpy,
      error: 'Some error',
      horizontal,
      optionsShouldAlwaysContainValue: optionsShouldAlwaysContainValueConfig,
      id: hasLabel ? 'subject' : undefined,
      label: 'Subject',
      hiddenLabel: !hasLabel
    };

    const { container, rerender } = render(
      <CheckboxMultipleSelect {...props} />
    );

    return { container, props, rerender, onChangeSpy, onBlurSpy };
  }

  describe('ui', () => {
    test('default', () => {
      const { container } = setup({});
      expect(container).toMatchSnapshot();
    });

    test('with value', () => {
      setup({ value: [adminUser()] });
      expect(screen.getByLabelText('admin@42.nl')).toBeChecked();
    });

    test('with placeholder', () => {
      setup({ hasPlaceholder: true });
      expect(
        screen.queryByText('Please select your provinces')
      ).toBeInTheDocument();
    });

    test('without placeholder', () => {
      setup({});
      expect(
        screen.queryByText('Please select your provinces')
      ).not.toBeInTheDocument();
    });

    test('with label', () => {
      setup({ hasLabel: true });
      expect(screen.queryByText('Subject')).toBeInTheDocument();
    });

    test('without label', () => {
      setup({});
      expect(screen.queryByText('Subject')).not.toBeInTheDocument();
    });

    test('horizontal', () => {
      setup({ horizontal: true });
      screen.getAllByRole('checkbox').forEach((checkbox) => {
        expect(checkbox.parentNode?.parentNode).toHaveClass(
          'form-check-inline'
        );
      });
    });

    test('loading', () => {
      const { container } = setup({ loading: true });
      expect(screen.queryByText('Loading...')).toBeInTheDocument();
      expect(container).toMatchSnapshot();
    });
  });

  test('async options', () => {
    setup({ isAsync: true, expectedSize: 100 });
    // Expects are done in the setup, useOptions implementation mocking
  });

  describe('events', () => {
    test('onChange', () => {
      const admin = adminUser();
      const coordinator = coordinatorUser();
      const user = userUser();

      const value: User[] | undefined = undefined;

      const { props, rerender, onChangeSpy, onBlurSpy } = setup({
        value,
        isOptionEnabled: undefined,
        hasIsOptionEqual: false,
        options: [admin, coordinator, user]
      });

      // First lets click on the admin it should be added
      fireEvent.click(screen.getByLabelText('admin@42.nl'));

      expect(onChangeSpy).toHaveBeenCalledTimes(1);
      expect(onChangeSpy).toHaveBeenCalledWith([admin]);

      // Check that selected is a copy of value
      expect(onChangeSpy.mock.calls[0][0]).not.toBe(value);

      expect(onBlurSpy).toHaveBeenCalledTimes(1);

      let newProps = {
        ...props,
        value: [admin]
      };

      // Manually set the value since it is external
      rerender(<CheckboxMultipleSelect {...newProps} />);

      // Now lets click on the coordinator it should be added
      fireEvent.click(screen.getByLabelText('coordinator@42.nl'));

      expect(onChangeSpy).toHaveBeenCalledTimes(2);
      expect(onChangeSpy).toHaveBeenCalledWith([admin, coordinator]);

      // Check that selected is a copy of value
      expect(onChangeSpy.mock.calls[1][0]).not.toBe(value);

      expect(onBlurSpy).toHaveBeenCalledTimes(2);

      newProps = {
        ...props,
        value: [admin, coordinator]
      };

      // Manually set the value since it is external
      rerender(<CheckboxMultipleSelect {...newProps} />);

      // Now lets click on the admin again it should be removed
      fireEvent.click(screen.getByLabelText('admin@42.nl'));

      expect(onChangeSpy).toHaveBeenCalledTimes(3);
      expect(onChangeSpy).toHaveBeenCalledWith([coordinator]);

      // Check that selected is a copy of value
      expect(onChangeSpy.mock.calls[2][0]).not.toBe(value);

      expect(onBlurSpy).toHaveBeenCalledTimes(3);
    });

    describe('isOptionEnabled', () => {
      it('should when "isOptionEnabled" is not defined always be true', () => {
        setup({
          value: [adminUser()],
          isOptionEnabled: undefined
        });

        const checkboxes = screen.getAllByRole('checkbox');
        expect(checkboxes.length).toBe(3);

        expect(checkboxes[0]).not.toBeDisabled();
        expect(checkboxes[1]).not.toBeDisabled();
        expect(checkboxes[2]).not.toBeDisabled();
      });

      it('should when "isOptionEnabled" is defined use that to determine if the option is enabled', () => {
        const isOptionEnabledSpy = jest.fn();

        // Disabled all option now
        isOptionEnabledSpy.mockReturnValue(false);

        setup({
          value: undefined,
          isOptionEnabled: isOptionEnabledSpy
        });

        const checkboxes = screen.getAllByRole('checkbox');
        expect(checkboxes.length).toBe(3);

        expect(checkboxes[0]).toBeDisabled();
        expect(checkboxes[1]).toBeDisabled();
        expect(checkboxes[2]).toBeDisabled();

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
        value: [userUser()],
        isOptionEnabled: undefined
      });

      let checkbox = screen.getAllByRole('checkbox')[2];
      expect(checkbox).toBeChecked();

      const newProps = {
        ...props,
        value: undefined
      };

      rerender(<CheckboxMultipleSelect {...newProps} />);

      checkbox = screen.getAllByRole('checkbox')[2];
      expect(checkbox).not.toBeChecked();
    });

    test('becomes filled', () => {
      const { props, rerender } = setup({
        value: undefined,
        isOptionEnabled: undefined
      });

      let checkbox = screen.getAllByRole('checkbox')[1];
      expect(checkbox).not.toBeChecked();

      const newProps = {
        ...props,
        value: [coordinatorUser()]
      };

      rerender(<CheckboxMultipleSelect {...newProps} />);

      checkbox = screen.getAllByRole('checkbox')[1];
      expect(checkbox).toBeChecked();
    });
  });

  describe('optionsShouldAlwaysContainValue behavior', () => {
    test('when false is provided it should be false', () => {
      setup({
        optionsShouldAlwaysContainValueConfig: false
      });

      expect(useOptions).toHaveBeenCalledWith(
        expect.objectContaining({ optionsShouldAlwaysContainValue: false })
      );
    });

    test('when true is provided it should be true', () => {
      setup({
        optionsShouldAlwaysContainValueConfig: true
      });

      expect(useOptions).toHaveBeenCalledWith(
        expect.objectContaining({ optionsShouldAlwaysContainValue: true })
      );
    });

    test('when nothing is provided it should be true', () => {
      setup({});

      expect(useOptions).toHaveBeenCalledWith(
        expect.objectContaining({ optionsShouldAlwaysContainValue: true })
      );
    });
  });
});
