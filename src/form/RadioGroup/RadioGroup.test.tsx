import React from 'react';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';

import RadioGroup, { Text } from './RadioGroup';
import { User } from '../../test/types';
import { adminUser, coordinatorUser, userUser } from '../../test/fixtures';
import { OptionEnabledCallback } from '../option';

describe('Component: RadioGroup', () => {
  function setup({
    value,
    isOptionEnabled,
    text,
    hasPlaceholder = true,
    hasLabel = true,
    horizontal,
    canClear
  }: {
    value?: User;
    isOptionEnabled?: OptionEnabledCallback<User>;
    text?: Text;
    hasPlaceholder?: boolean;
    hasLabel?: boolean;
    horizontal?: boolean;
    canClear?: boolean;
  }) {
    const onChangeSpy = jest.fn();
    const onBlurSpy = jest.fn();

    const props = {
      placeholder: hasPlaceholder ? 'Please enter your subject' : undefined,
      text,
      isOptionEnabled,
      optionForValue: (user: User) => user?.email,
      options: [adminUser, coordinatorUser, userUser],
      value,
      onChange: onChangeSpy,
      onBlur: onBlurSpy,
      error: 'Some error',
      valid: false,
      horizontal,
      label: hasLabel ? 'Subject' : undefined,
      canClear
    };

    const radioGroup = shallow(<RadioGroup {...props} />);

    return {
      radioGroup,
      onChangeSpy,
      onBlurSpy
    };
  }

  describe('ui', () => {
    test('with value', () => {
      const { radioGroup } = setup({
        value: adminUser,
        isOptionEnabled: undefined
      });

      expect(toJson(radioGroup)).toMatchSnapshot(
        'Component: RadioGroup => ui => with value'
      );
    });

    test('when value is not in options select nothing', () => {
      const { radioGroup } = setup({
        value: {
          id: -1,
          email: 'none',
          firstName: 'none',
          lastName: 'none',
          active: false,
          roles: []
        },
        isOptionEnabled: undefined
      });

      const radios = radioGroup.find('Input');

      expect(radios.length).toBe(3);

      expect(radios.at(0).props().checked).toBe(false);
      expect(radios.at(1).props().checked).toBe(false);
      expect(radios.at(2).props().checked).toBe(false);
    });

    test('without placeholder', () => {
      const { radioGroup } = setup({
        value: adminUser,
        isOptionEnabled: undefined,
        hasPlaceholder: false
      });

      expect(toJson(radioGroup)).toMatchSnapshot(
        'Component: RadioGroup => ui => without placeholder'
      );
    });

    test('without label', () => {
      const { radioGroup } = setup({
        value: adminUser,
        isOptionEnabled: undefined,
        hasLabel: false
      });

      expect(toJson(radioGroup)).toMatchSnapshot(
        'Component: RadioGroup => ui => without label'
      );
    });

    test('horizontal', () => {
      const { radioGroup } = setup({
        value: adminUser,
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

      // @ts-ignore
      radio.props().onChange({ target: { value: 0 } });

      expect(onChangeSpy).toHaveBeenCalledTimes(1);
      expect(onChangeSpy).toHaveBeenCalledWith(adminUser);
    });

    it('should clear the value when the cancel button is clicked', () => {
      const { radioGroup, onChangeSpy } = setup({
        value: adminUser,
        canClear: true
      });

      // @ts-ignore
      radioGroup
        .find('TextButton')
        .props()
        // @ts-ignore
        .onClick();

      expect(onChangeSpy).toHaveBeenCalledTimes(1);
      expect(onChangeSpy).toHaveBeenCalledWith(undefined);
    });

    describe('isOptionEnabled', () => {
      it('should when "isOptionEnabled" is not defined always be true', () => {
        const { radioGroup } = setup({
          value: adminUser,
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
          [adminUser],
          [coordinatorUser],
          [userUser]
        ]);
      });
    });
  });

  describe('value changes', () => {
    test('becomes empty', () => {
      const { radioGroup } = setup({
        value: userUser,
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

      radioGroup.setProps({ value: coordinatorUser });

      radios = radioGroup.find('Input');

      expect(radios.at(0).props().checked).toBe(false);
      expect(radios.at(1).props().checked).toBe(true);
      expect(radios.at(2).props().checked).toBe(false);
    });
  });
});
