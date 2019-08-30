import React from 'react';
import { shallow, ShallowWrapper } from 'enzyme';
import toJson from 'enzyme-to-json';

import Select, { OptionEnabledCallback } from './Select';
import { User } from '../../test/types';
import {
  adminUser,
  coordinatorUser,
  userUser,
  pageOfUsers
} from '../../test/fixtures';

describe('Component: Select', () => {
  let select: ShallowWrapper;

  let onChangeSpy: jest.Mock<any, any>;
  let onBlurSpy: jest.Mock<any, any>;

  function setup({
    value,
    isOptionEnabled,
    loadingMessage
  }: {
    value?: User;
    isOptionEnabled?: OptionEnabledCallback<User>;
    loadingMessage?: string;
  }) {
    onChangeSpy = jest.fn();
    onBlurSpy = jest.fn();

    select = shallow(
      <Select
        id="subject"
        label="Subject"
        placeholder="Please enter your subject"
        isOptionEnabled={isOptionEnabled}
        optionForValue={(user: User) => user.email}
        options={[adminUser, coordinatorUser, userUser]}
        value={value}
        onChange={onChangeSpy}
        onBlur={onBlurSpy}
        loadingMessage={loadingMessage}
        error="Some error"
      />
    );
  }

  describe('ui', () => {
    test('with value', () => {
      setup({ value: adminUser, isOptionEnabled: undefined });

      expect(toJson(select)).toMatchSnapshot(
        'Component: Select => ui => with value'
      );
    });

    describe('loading', () => {
      test('with custom loading message', () => {
        setup({ value: adminUser, loadingMessage: 'Custom loading' });

        // @ts-ignore
        select.setState({ loading: true });

        expect(select.find('Spinner').exists()).toBe(true);
        expect(select.find('span').text()).toBe('Custom loading');
      });

      test('with default loading message', () => {
        setup({ value: adminUser });

        // @ts-ignore
        select.setState({ loading: true });

        expect(select.find('Spinner').exists()).toBe(true);
        expect(select.find('span').text()).toBe('Loading...');
      });
    });

    test('empty value string, should show placeholder', () => {
      setup({ value: undefined, isOptionEnabled: undefined });

      const rsInput = select.find('Input');

      expect(rsInput.props().className).toBe('showing-placeholder');
    });
  });

  describe('constructor', () => {
    test('when options is an array use that options and set loading to false', () => {
      // @ts-ignore
      const select = new Select({ options: [adminUser] });

      expect(select.state).toEqual({ loading: false, options: [adminUser] });
    });

    test('when options is a function set options to empty and loading to true', () => {
      // @ts-ignore
      const select = new Select({ options: jest.fn() });

      expect(select.state).toEqual({ loading: true, options: [] });
    });
  });

  describe('componentDidMount', () => {
    test('when options is an array do nothing', async done => {
      const onChange = jest.fn();

      // @ts-ignore
      const select = new Select({
        options: [adminUser, coordinatorUser, userUser],
        onChange
      });

      jest.spyOn(select, 'setState').mockImplementation(() => undefined);

      try {
        await select.componentDidMount();

        expect(select.setState).toHaveBeenCalledTimes(0);

        expect(onChange).toHaveBeenCalledTimes(0);

        done();
      } catch (e) {
        console.error(e);
        done.fail();
      }
    });

    test('when options is a function set options to empty and loading to true', async done => {
      const onChange = jest.fn();
      const options = () => Promise.resolve(pageOfUsers);

      // @ts-ignore
      const select = new Select({ options, onChange });

      jest.spyOn(select, 'setState').mockImplementation(() => undefined);

      try {
        await select.componentDidMount();

        expect(select.setState).toHaveBeenCalledTimes(1);
        expect(select.setState).toHaveBeenCalledWith({
          loading: false,
          options: [adminUser, coordinatorUser, userUser]
        });

        expect(onChange).toHaveBeenCalledTimes(1);
        expect(onChange).toBeCalledWith(adminUser);

        done();
      } catch (e) {
        console.error(e);
        done.fail();
      }
    });
  });

  describe('selectDefaultOption', () => {
    it('should select the placeholder as the default value when value is empty string', () => {
      setup({ value: undefined, isOptionEnabled: undefined });

      const defaultOption = select.find('option').first();
      expect(defaultOption.text()).toBe('Please enter your subject');

      const option = { selected: false };
      // @ts-ignore
      defaultOption.getElement().ref(option);

      expect(option.selected).toBe(true);
    });

    it('should not select the placeholder as the default value when value is not an empty string', () => {
      setup({ value: adminUser, isOptionEnabled: undefined });

      const defaultOption = select.find('option').first();
      expect(defaultOption.text()).toBe('Please enter your subject');

      const option = { selected: false };
      // @ts-ignore
      defaultOption.getElement().ref(option);

      expect(option.selected).toBe(false);
    });

    it('should not select the placeholder as the default value when the option is not defined', () => {
      setup({ value: undefined, isOptionEnabled: undefined });

      const defaultOption = select.find('option').first();
      expect(defaultOption.text()).toBe('Please enter your subject');

      const option = undefined;
      // @ts-ignore
      defaultOption.getElement().ref(option);
    });
  });

  describe('events', () => {
    test('onChange', () => {
      setup({ value: undefined, isOptionEnabled: undefined });

      const rsInput = select.find('Input');

      // @ts-ignore
      rsInput.props().onChange({ target: { value: 0 } });

      expect(onChangeSpy).toHaveBeenCalledTimes(1);
      expect(onChangeSpy).toHaveBeenCalledWith(adminUser);
    });

    test('onBlur', () => {
      setup({ value: undefined, isOptionEnabled: undefined });

      const rsInput = select.find('Input');
      // @ts-ignore
      rsInput.props().onBlur();

      expect(onBlurSpy).toHaveBeenCalledTimes(1);
    });

    describe('isOptionEnabled', () => {
      it('should when "isOptionEnabled" is not defined always be true', () => {
        setup({ value: adminUser, isOptionEnabled: undefined });

        const options = select.find('option');
        expect(options.length).toBe(4);

        // Default option should be disabled
        expect(options.at(0).props().disabled).toBe(true);

        // Other options should be enabled
        expect(options.at(1).props().disabled).toBe(false);
        expect(options.at(2).props().disabled).toBe(false);
        expect(options.at(3).props().disabled).toBe(false);
      });

      it('should when "isOptionEnabled" is defined use that to determine if the option is enabled', () => {
        const isOptionEnabledSpy = jest.fn();

        // Disabled all option now
        isOptionEnabledSpy.mockReturnValue(false);

        setup({ value: undefined, isOptionEnabled: isOptionEnabledSpy });

        const options = select.find('option');
        expect(options.length).toBe(4);

        // Default option should be disabled
        expect(options.at(0).props().disabled).toBe(true);

        // Other options should be enabled
        expect(options.at(1).props().disabled).toBe(true);
        expect(options.at(2).props().disabled).toBe(true);
        expect(options.at(3).props().disabled).toBe(true);

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

      let rsInput = select.find('Input');
      expect(rsInput.props().value).toBe(2);

      select.setProps({ value: undefined });

      rsInput = select.find('Input');
      expect(rsInput.props().value).toBe(-1);
    });

    test('becomes filled', () => {
      setup({ value: undefined, isOptionEnabled: undefined });

      let rsInput = select.find('Input');
      expect(rsInput.props().value).toBe(-1);

      select.setProps({ value: coordinatorUser });

      rsInput = select.find('Input');
      expect(rsInput.props().value).toBe(1);
    });
  });
});
