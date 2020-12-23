import React from 'react';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';

import RadioGroup, { Text } from './RadioGroup';
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

describe('Component: RadioGroup', () => {
  function setup({
    value,
    isOptionEnabled,
    text,
    hasPlaceholder = true,
    hasLabel = true,
    horizontal,
    canClear,
    loading = false
  }: {
    value?: User;
    isOptionEnabled?: IsOptionEnabled<User>;
    text?: Text;
    hasPlaceholder?: boolean;
    hasLabel?: boolean;
    horizontal?: boolean;
    canClear?: boolean;
    loading?: boolean;
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
        expect(size).toBe(10);
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
      valid: false,
      horizontal,
      canClear
    };

    const labelProps = hasLabel ? { id: 'subject', label: 'Subject' } : {};

    const radioGroup = shallow(<RadioGroup {...props} {...labelProps} />);

    return {
      radioGroup,
      onChangeSpy,
      onBlurSpy
    };
  }

  describe('ui', () => {
    test('with value', () => {
      const { radioGroup } = setup({
        value: adminUser(),
        isOptionEnabled: undefined
      });

      expect(toJson(radioGroup)).toMatchSnapshot(
        'Component: RadioGroup => ui => with value'
      );
    });

    test('loading', () => {
      const { radioGroup } = setup({
        loading: true
      });

      expect(toJson(radioGroup)).toMatchSnapshot(
        'Component: RadioGroup => ui => loading'
      );
    });

    test('without placeholder', () => {
      const { radioGroup } = setup({
        value: adminUser(),
        isOptionEnabled: undefined,
        hasPlaceholder: false
      });

      expect(toJson(radioGroup)).toMatchSnapshot(
        'Component: RadioGroup => ui => without placeholder'
      );
    });

    test('without label', () => {
      const { radioGroup } = setup({
        value: adminUser(),
        isOptionEnabled: undefined,
        hasLabel: false
      });

      expect(toJson(radioGroup)).toMatchSnapshot(
        'Component: RadioGroup => ui => without label'
      );
    });

    test('horizontal', () => {
      const { radioGroup } = setup({
        value: adminUser(),
        isOptionEnabled: undefined,
        horizontal: true
      });

      expect(toJson(radioGroup)).toMatchSnapshot(
        'Component: RadioGroup => ui => horizontal'
      );
    });
  });

  describe('events', () => {
    test('onChange', () => {
      const { radioGroup, onChangeSpy } = setup({
        value: undefined,
        isOptionEnabled: undefined
      });

      const radio = radioGroup.find('Input').at(0);

      // @ts-expect-error Test mock
      radio.props().onChange({ target: { value: 0 } });

      expect(onChangeSpy).toHaveBeenCalledTimes(1);
      expect(onChangeSpy).toHaveBeenCalledWith(adminUser());
    });

    it('should clear the value when the cancel button is clicked', () => {
      const { radioGroup, onChangeSpy } = setup({
        value: adminUser(),
        canClear: true
      });

      // @ts-expect-error Test mock
      radioGroup
        .find('TextButton')
        .props()
        // @ts-expect-error Test mock
        .onClick();

      expect(onChangeSpy).toHaveBeenCalledTimes(1);
      expect(onChangeSpy).toHaveBeenCalledWith(undefined);
    });

    describe('isOptionEnabled', () => {
      it('should when "isOptionEnabled" is not defined always be true', () => {
        const { radioGroup } = setup({
          value: adminUser(),
          isOptionEnabled: undefined
        });

        const radios = radioGroup.find('Input');
        expect(radios.length).toBe(3);

        // Other options should be enabled
        expect(radios.at(0).props().disabled).toBe(false);
        expect(radios.at(1).props().disabled).toBe(false);
        expect(radios.at(2).props().disabled).toBe(false);
      });

      it('should when "isOptionEnabled" is defined use that to determine if the option is enabled', () => {
        const isOptionEnabledSpy = jest.fn();

        // Disabled all option now
        isOptionEnabledSpy.mockReturnValue(false);

        const { radioGroup } = setup({
          value: undefined,
          isOptionEnabled: isOptionEnabledSpy
        });

        const radios = radioGroup.find('Input');
        expect(radios.length).toBe(3);

        // Other options should be enabled
        expect(radios.at(0).props().disabled).toBe(true);
        expect(radios.at(1).props().disabled).toBe(true);
        expect(radios.at(2).props().disabled).toBe(true);

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
      const { radioGroup } = setup({
        value: userUser(),
        isOptionEnabled: undefined
      });

      let radios = radioGroup.find('Input');

      expect(radios.at(0).props().checked).toBe(false);
      expect(radios.at(1).props().checked).toBe(false);
      expect(radios.at(2).props().checked).toBe(true);

      radioGroup.setProps({ value: undefined });

      radios = radioGroup.find('Input');

      expect(radios.at(0).props().checked).toBe(false);
      expect(radios.at(1).props().checked).toBe(false);
      expect(radios.at(2).props().checked).toBe(false);
    });

    test('becomes filled', () => {
      const { radioGroup } = setup({
        value: undefined,
        isOptionEnabled: undefined
      });

      let radios = radioGroup.find('Input');

      expect(radios.at(0).props().checked).toBe(false);
      expect(radios.at(1).props().checked).toBe(false);
      expect(radios.at(2).props().checked).toBe(false);

      radioGroup.setProps({ value: coordinatorUser() });

      radios = radioGroup.find('Input');

      expect(radios.at(0).props().checked).toBe(false);
      expect(radios.at(1).props().checked).toBe(true);
      expect(radios.at(2).props().checked).toBe(false);
    });
  });
});
