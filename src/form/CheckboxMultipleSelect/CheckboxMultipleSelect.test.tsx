import React from 'react';
import { vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';

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

vi.mock('../useOptions', () => {
  return { useOptions: vi.fn() };
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
    const onChangeSpy = vi.fn();
    const onBlurSpy = vi.fn();

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
      // @ts-expect-error Checkbox has property checked
      expect(screen.getByLabelText('admin@42.nl').checked).toEqual(true);
    });

    test('with placeholder', async () => {
      expect.assertions(3);
      setup({ hasPlaceholder: true });
      await screen.findByText('Please select your provinces');
    });

    test('without placeholder', () => {
      setup({});
      expect(screen.queryByText('Please select your provinces')).toBeNull();
    });

    test('with label', async () => {
      expect.assertions(3);
      setup({ hasLabel: true });
      await screen.findByText('Subject');
    });

    test('without label', () => {
      setup({});
      expect(screen.queryByText('Subject')).toBeNull();
    });

    test('horizontal', () => {
      setup({ horizontal: true });
      screen.getAllByRole('checkbox').forEach((checkbox) => {
        expect(
          // @ts-expect-error HTMLElement has property classList
          checkbox.parentNode?.parentNode?.classList.contains(
            'form-check-inline'
          )
        ).toBe(true);
      });
    });

    test('loading', async () => {
      expect.assertions(4);
      const { container } = setup({ loading: true });
      await screen.findByText('Loading...');
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

        // @ts-expect-error Form elements have property disabled
        expect(checkboxes[0].disabled).toEqual(false);
        // @ts-expect-error Form elements have property disabled
        expect(checkboxes[1].disabled).toEqual(false);
        // @ts-expect-error Form elements have property disabled
        expect(checkboxes[2].disabled).toEqual(false);
      });

      it('should when "isOptionEnabled" is defined use that to determine if the option is enabled', () => {
        const isOptionEnabledSpy = vi.fn();

        // Disabled all option now
        isOptionEnabledSpy.mockReturnValue(false);

        setup({
          value: undefined,
          isOptionEnabled: isOptionEnabledSpy
        });

        const checkboxes = screen.getAllByRole('checkbox');
        expect(checkboxes.length).toBe(3);

        // @ts-expect-error Form elements have property disabled
        expect(checkboxes[0].disabled).toEqual(true);
        // @ts-expect-error Form elements have property disabled
        expect(checkboxes[1].disabled).toEqual(true);
        // @ts-expect-error Form elements have property disabled
        expect(checkboxes[2].disabled).toEqual(true);

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
      // @ts-expect-error Checkbox has property checked
      expect(checkbox.checked).toEqual(true);

      const newProps = {
        ...props,
        value: undefined
      };

      rerender(<CheckboxMultipleSelect {...newProps} />);

      checkbox = screen.getAllByRole('checkbox')[2];
      // @ts-expect-error Checkbox has property checked
      expect(checkbox.checked).toEqual(false);
    });

    test('becomes filled', () => {
      const { props, rerender } = setup({
        value: undefined,
        isOptionEnabled: undefined
      });

      let checkbox = screen.getAllByRole('checkbox')[1];
      // @ts-expect-error Checkbox has property checked
      expect(checkbox.checked).toEqual(false);

      const newProps = {
        ...props,
        value: [coordinatorUser()]
      };

      rerender(<CheckboxMultipleSelect {...newProps} />);

      checkbox = screen.getAllByRole('checkbox')[1];
      // @ts-expect-error Checkbox has property checked
      expect(checkbox.checked).toEqual(true);
    });
  });

  describe('optionsShouldAlwaysContainValue behavior', () => {
    test('when false is provided it should be false', () => {
      setup({
        optionsShouldAlwaysContainValueConfig: false
      });

      expect(useOptions).toBeCalledWith(
        expect.objectContaining({ optionsShouldAlwaysContainValue: false })
      );
    });

    test('when true is provided it should be true', () => {
      setup({
        optionsShouldAlwaysContainValueConfig: true
      });

      expect(useOptions).toBeCalledWith(
        expect.objectContaining({ optionsShouldAlwaysContainValue: true })
      );
    });

    test('when nothing is provided it should be true', () => {
      setup({});

      expect(useOptions).toBeCalledWith(
        expect.objectContaining({ optionsShouldAlwaysContainValue: true })
      );
    });
  });
});
