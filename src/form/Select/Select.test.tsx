import React from 'react';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';

import Select, { Text } from './Select';
import { User } from '../../test/types';
import {
  adminUser,
  coordinatorUser,
  listOfUsers,
  userUser
} from '../../test/fixtures';
import { IsOptionEnabled } from '../option';

import { pageOf } from '../../utilities/page/page';
import { useOptions } from '../useOptions';

jest.mock('../useOptions', () => {
  return { useOptions: jest.fn() };
});

describe('Component: Select', () => {
  function setup({
    value,
    isOptionEnabled,
    text,
    hasPlaceholder = true,
    hasLabel = true,
    loading = false,
    valid
  }: {
    value?: User;
    isOptionEnabled?: IsOptionEnabled<User>;
    text?: Text;
    hasPlaceholder?: boolean;
    hasLabel?: boolean;
    loading?: boolean;
    valid?: boolean;
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
        expect(size).toBe(3);
        expect(optionsShouldAlwaysContainValue).toBe(true);

        return {
          page: pageOf(options, pageNumber, size),
          loading
        };
      }
    );

    const props = {
      placeholder: hasPlaceholder ? 'Please enter your subject' : undefined,
      text,
      isOptionEnabled,
      labelForOption: (user: User) => user?.email,
      options: listOfUsers(),
      value,
      onChange: onChangeSpy,
      onBlur: onBlurSpy,
      error: 'Some error',
      valid
    };

    const labelProps = hasLabel ? { id: 'subject', label: 'Subject' } : {};

    const select = shallow(<Select {...props} {...labelProps} />);

    return { select, onChangeSpy, onBlurSpy };
  }

  describe('ui', () => {
    test('with value', () => {
      const { select } = setup({
        value: adminUser(),
        valid: true,
        isOptionEnabled: undefined
      });

      expect(toJson(select)).toMatchSnapshot(
        'Component: Select => ui => with value'
      );
    });

    test('loading', () => {
      const { select } = setup({
        loading: true
      });

      expect(toJson(select)).toMatchSnapshot(
        'Component: Select => ui => loading'
      );
    });

    test('empty value string, should show placeholder', () => {
      const { select } = setup({
        value: undefined,
        isOptionEnabled: undefined,
        valid: false
      });

      const rsInput = select.find('Input');

      expect(rsInput.props().className).toBe('showing-placeholder');
    });

    test('without placeholder', () => {
      const { select } = setup({
        value: adminUser(),
        isOptionEnabled: undefined,
        hasPlaceholder: false
      });

      expect(toJson(select)).toMatchSnapshot(
        'Component: Select => ui => without placeholder'
      );
    });

    test('without label', () => {
      const { select } = setup({
        value: adminUser(),
        isOptionEnabled: undefined,
        hasLabel: false
      });

      expect(toJson(select)).toMatchSnapshot(
        'Component: Select => ui => without label'
      );
    });
  });

  describe('selectDefaultOption', () => {
    it('should select the placeholder as the default value when value is empty string', () => {
      const { select } = setup({
        value: undefined,
        isOptionEnabled: undefined
      });

      const defaultOption = select.find('option').first();
      expect(defaultOption.text()).toBe('Please enter your subject');

      const option = { selected: false };
      // @ts-expect-error Test mock
      defaultOption.getElement().ref(option);

      expect(option.selected).toBe(true);

      // @ts-expect-error Test mock
      expect(option.value).toBe(undefined);
    });

    it('should not select the placeholder as the default value when value is not an empty string', () => {
      const { select } = setup({
        value: adminUser(),
        isOptionEnabled: undefined
      });

      const defaultOption = select.find('option').first();
      expect(defaultOption.text()).toBe('Please enter your subject');

      const option = { selected: false };
      // @ts-expect-error Test mock
      defaultOption.getElement().ref(option);

      expect(option.selected).toBe(false);
    });

    it('should not select the placeholder as the default value when the option is not defined', () => {
      const { select } = setup({
        value: undefined,
        isOptionEnabled: undefined
      });

      const defaultOption = select.find('option').first();
      expect(defaultOption.text()).toBe('Please enter your subject');

      const option = undefined;
      // @ts-expect-error Test mock
      defaultOption.getElement().ref(option);
    });
  });

  describe('events', () => {
    test('onChange', () => {
      const { select, onChangeSpy } = setup({
        value: undefined,
        isOptionEnabled: undefined
      });

      const rsInput = select.find('Input');

      // @ts-expect-error Test mock
      rsInput.props().onChange({ target: { value: 0 } });

      expect(onChangeSpy).toHaveBeenCalledTimes(1);
      expect(onChangeSpy).toHaveBeenCalledWith(adminUser());
    });

    test('onBlur', () => {
      const { select, onBlurSpy } = setup({
        value: undefined,
        isOptionEnabled: undefined
      });

      const rsInput = select.find('Input');
      // @ts-expect-error Test mock
      rsInput.props().onBlur();

      expect(onBlurSpy).toHaveBeenCalledTimes(1);
    });

    describe('isOptionEnabled', () => {
      it('should when "isOptionEnabled" is not defined always be true', () => {
        const { select } = setup({
          value: adminUser(),
          isOptionEnabled: undefined
        });

        const options = select.find('option');
        expect(options.length).toBe(4);

        // Other options should be enabled
        expect(options.at(1).props().disabled).toBe(false);
        expect(options.at(2).props().disabled).toBe(false);
        expect(options.at(3).props().disabled).toBe(false);
      });

      it('should when "isOptionEnabled" is defined use that to determine if the option is enabled', () => {
        const isOptionEnabledSpy = jest.fn();

        // Disabled all option now
        isOptionEnabledSpy.mockReturnValue(false);

        const { select } = setup({
          value: undefined,
          isOptionEnabled: isOptionEnabledSpy
        });

        const options = select.find('option');
        expect(options.length).toBe(4);

        // Other options should be enabled
        expect(options.at(1).props().disabled).toBe(true);
        expect(options.at(2).props().disabled).toBe(true);
        expect(options.at(3).props().disabled).toBe(true);

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
      const { select } = setup({
        value: userUser(),
        isOptionEnabled: undefined
      });

      let rsInput = select.find('Input');
      expect(rsInput.props().value).toBe(2);

      select.setProps({ value: undefined });

      rsInput = select.find('Input');
      expect(rsInput.props().value).toBe(undefined);
    });

    test('becomes filled', () => {
      const { select } = setup({
        value: undefined,
        isOptionEnabled: undefined
      });

      let rsInput = select.find('Input');
      expect(rsInput.props().value).toBe(undefined);

      select.setProps({ value: coordinatorUser() });

      rsInput = select.find('Input');
      expect(rsInput.props().value).toBe(1);
    });
  });
});
