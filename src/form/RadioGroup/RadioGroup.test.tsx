import React from 'react';
import { shallow, ShallowWrapper } from 'enzyme';
import toJson from 'enzyme-to-json';

import RadioGroup, { Text } from './RadioGroup';
import { User } from '../../test/types';
import { adminUser, coordinatorUser, userUser } from '../../test/fixtures';
import { OptionEnabledCallback } from '../option';

describe('Component: RadioGroup', () => {
  let radioGroup: ShallowWrapper;

  let onChangeSpy: jest.Mock<any, any>;
  let onBlurSpy: jest.Mock<any, any>;

  function setup({
    value,
    isOptionEnabled,
    text,
    hasPlaceholder = true
  }: {
    value?: User;
    isOptionEnabled?: OptionEnabledCallback<User>;
    text?: Text;
    hasPlaceholder?: boolean;
  }) {
    onChangeSpy = jest.fn();
    onBlurSpy = jest.fn();

    radioGroup = shallow(
      <RadioGroup
        id="subject"
        label="Subject"
        placeholder={hasPlaceholder ? 'Please enter your subject' : undefined}
        text={text}
        isOptionEnabled={isOptionEnabled}
        optionForValue={(user: User) => user?.email}
        options={[adminUser, coordinatorUser, userUser]}
        value={value}
        onChange={onChangeSpy}
        onBlur={onBlurSpy}
        error="Some error"
        valid={false}
      />
    );
  }

  describe('ui', () => {
    test('with value', () => {
      setup({ value: adminUser, isOptionEnabled: undefined });

      expect(toJson(radioGroup)).toMatchSnapshot(
        'Component: RadioGroup => ui => with value'
      );
    });

    test('when value is not in options select nothing', () => {
      setup({
        value: {
          id: -1,
          email: 'none',
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
      setup({
        value: adminUser,
        isOptionEnabled: undefined,
        hasPlaceholder: false
      });

      expect(toJson(radioGroup)).toMatchSnapshot(
        'Component: RadioGroup => ui => without placeholder'
      );
    });
  });

  describe('events', () => {
    test('onChange', () => {
      setup({ value: undefined, isOptionEnabled: undefined });

      const radio = radioGroup.find('Input').at(0);

      // @ts-ignore
      radio.props().onChange({ target: { value: 0 } });

      expect(onChangeSpy).toHaveBeenCalledTimes(1);
      expect(onChangeSpy).toHaveBeenCalledWith(adminUser);
    });

    describe('isOptionEnabled', () => {
      it('should when "isOptionEnabled" is not defined always be true', () => {
        setup({ value: adminUser, isOptionEnabled: undefined });

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

        setup({ value: undefined, isOptionEnabled: isOptionEnabledSpy });

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
      setup({ value: userUser, isOptionEnabled: undefined });

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
      setup({ value: undefined, isOptionEnabled: undefined });

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
