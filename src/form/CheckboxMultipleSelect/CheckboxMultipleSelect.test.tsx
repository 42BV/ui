import React from 'react';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';

import CheckboxMultipleSelect, { Text } from './CheckboxMultipleSelect';
import { User } from '../../test/types';
import {
  adminUser,
  coordinatorUser,
  listOfUsers,
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
    hasPlaceholder = true,
    hasLabel = true,
    horizontal,
    loading = false,
    optionsShouldAlwaysContainValueConfig
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
  }) {
    const onChangeSpy = jest.fn();
    const onBlurSpy = jest.fn();

    // @ts-expect-error This is in fact a mock
    useOptions.mockImplementation(
      ({ options, pageNumber, size, optionsShouldAlwaysContainValue }) => {
        expect(pageNumber).toBe(1);
        expect(size).toBe(3);
        expect(optionsShouldAlwaysContainValue).toBe(
          optionsShouldAlwaysContainValueConfig ?? true
        );

        return {
          page: pageOf(options, pageNumber, size),
          loading
        };
      }
    );

    const props = {
      placeholder: hasPlaceholder ? 'Please select your provinces' : undefined,
      text,
      isOptionEnabled,
      options: listOfUsers(),
      labelForOption: (user: User) => user.email,
      value,
      onChange: onChangeSpy,
      onBlur: onBlurSpy,
      error: 'Some error',
      horizontal,
      optionsShouldAlwaysContainValue: optionsShouldAlwaysContainValueConfig
    };

    const labelProps = hasLabel ? { id: 'subject', label: 'Subject' } : {};

    const checkboxMultipleSelect = shallow(
      <CheckboxMultipleSelect {...props} {...labelProps} />
    );

    return { checkboxMultipleSelect, onChangeSpy, onBlurSpy };
  }

  describe('ui', () => {
    test('with value', () => {
      const { checkboxMultipleSelect } = setup({ value: [adminUser()] });

      expect(toJson(checkboxMultipleSelect)).toMatchSnapshot(
        'Component: CheckboxMultipleSelect => ui => with value'
      );
    });

    test('without placeholder', () => {
      const { checkboxMultipleSelect } = setup({
        value: [adminUser()],
        hasPlaceholder: false
      });

      expect(toJson(checkboxMultipleSelect)).toMatchSnapshot(
        'Component: CheckboxMultipleSelect => ui => without placeholder'
      );
    });

    test('without label', () => {
      const { checkboxMultipleSelect } = setup({
        value: [adminUser()],
        hasLabel: false
      });

      expect(toJson(checkboxMultipleSelect)).toMatchSnapshot(
        'Component: CheckboxMultipleSelect => ui => without label'
      );
    });

    test('horizontal', () => {
      const { checkboxMultipleSelect } = setup({
        value: [adminUser()],
        horizontal: true
      });

      expect(toJson(checkboxMultipleSelect)).toMatchSnapshot(
        'Component: CheckboxMultipleSelect => ui => horizontal'
      );
    });

    test('loading', () => {
      const { checkboxMultipleSelect } = setup({
        loading: true
      });

      expect(toJson(checkboxMultipleSelect)).toMatchSnapshot(
        'Component: CheckboxMultipleSelect => ui => loading'
      );
    });
  });

  describe('events', () => {
    test('onChange', () => {
      const admin = adminUser();
      const coordinator = coordinatorUser();
      const user = userUser();

      let value: User[] | undefined = undefined;

      const { checkboxMultipleSelect, onChangeSpy, onBlurSpy } = setup({
        value,
        isOptionEnabled: undefined,
        hasIsOptionEqual: false,
        options: [admin, coordinator, user]
      });

      // First lets click on the admin it should be added
      let checkbox = checkboxMultipleSelect.find('Input').at(0);
      // @ts-expect-error Test mock
      checkbox.props().onChange();

      expect(onChangeSpy).toHaveBeenCalledTimes(1);
      expect(onChangeSpy).toHaveBeenCalledWith([admin]);

      // Check that selected is a copy of value
      expect(onChangeSpy.mock.calls[0][0]).not.toBe(value);

      expect(onBlurSpy).toHaveBeenCalledTimes(1);

      // Manually set the value since it is external
      value = [admin];
      checkboxMultipleSelect.setProps({ value });

      // Now lets click on the coordinator it should be added
      checkbox = checkboxMultipleSelect.find('Input').at(1);

      // @ts-expect-error Test mock
      checkbox.props().onChange();

      expect(onChangeSpy).toHaveBeenCalledTimes(2);
      expect(onChangeSpy).toHaveBeenCalledWith([admin, coordinator]);

      // Check that selected is a copy of value
      expect(onChangeSpy.mock.calls[1][0]).not.toBe(value);

      expect(onBlurSpy).toHaveBeenCalledTimes(2);

      // Manually set the value since it is external
      value = [admin, coordinator];
      checkboxMultipleSelect.setProps({ value });

      // Now lets click on the admin again it should be removed
      checkbox = checkboxMultipleSelect.find('Input').at(0);

      // @ts-expect-error Test mock
      checkbox.props().onChange();

      expect(onChangeSpy).toHaveBeenCalledTimes(3);
      expect(onChangeSpy).toHaveBeenCalledWith([coordinator]);

      // Check that selected is a copy of value
      expect(onChangeSpy.mock.calls[2][0]).not.toBe(value);

      expect(onBlurSpy).toHaveBeenCalledTimes(3);
    });

    describe('isOptionEnabled', () => {
      it('should when "isOptionEnabled" is not defined always be true', () => {
        const { checkboxMultipleSelect } = setup({
          value: [adminUser()],
          isOptionEnabled: undefined
        });

        const checkboxes = checkboxMultipleSelect.find('Input');
        expect(checkboxes.length).toBe(3);

        expect(checkboxes.at(0).props().disabled).toBe(false);
        expect(checkboxes.at(1).props().disabled).toBe(false);
        expect(checkboxes.at(2).props().disabled).toBe(false);
      });

      it('should when "isOptionEnabled" is defined use that to determine if the option is enabled', () => {
        const isOptionEnabledSpy = jest.fn();

        // Disabled all option now
        isOptionEnabledSpy.mockReturnValue(false);

        const { checkboxMultipleSelect } = setup({
          value: undefined,
          isOptionEnabled: isOptionEnabledSpy
        });

        const checkboxes = checkboxMultipleSelect.find('Input');
        expect(checkboxes.length).toBe(3);

        expect(checkboxes.at(0).props().disabled).toBe(true);
        expect(checkboxes.at(1).props().disabled).toBe(true);
        expect(checkboxes.at(2).props().disabled).toBe(true);

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
      const { checkboxMultipleSelect } = setup({
        value: [userUser()],
        isOptionEnabled: undefined
      });

      let checkbox = checkboxMultipleSelect.find('Input').at(2);
      expect(checkbox.props().checked).toBe(true);

      checkboxMultipleSelect.setProps({ value: undefined });

      checkbox = checkboxMultipleSelect.find('Input').at(2);
      expect(checkbox.props().checked).toBe(false);
    });

    test('becomes filled', () => {
      const { checkboxMultipleSelect } = setup({
        value: undefined,
        isOptionEnabled: undefined
      });

      let checkbox = checkboxMultipleSelect.find('Input').at(1);
      expect(checkbox.props().checked).toBe(false);

      checkboxMultipleSelect.setProps({ value: [coordinatorUser()] });

      checkbox = checkboxMultipleSelect.find('Input').at(1);
      expect(checkbox.props().checked).toBe(true);
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
