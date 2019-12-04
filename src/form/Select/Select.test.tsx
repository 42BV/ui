import React from 'react';
import { shallow, ShallowWrapper } from 'enzyme';
import toJson from 'enzyme-to-json';

import Select, { Text } from './Select';
import { User } from '../../test/types';
import {
  adminUser,
  coordinatorUser,
  userUser,
  pageOfUsers
} from '../../test/fixtures';
import { OptionEnabledCallback } from '../option';
import { pageWithContent } from '../../test/utils';

describe('Component: Select', () => {
  let select: ShallowWrapper;

  let onChangeSpy: jest.Mock<any, any>;
  let onBlurSpy: jest.Mock<any, any>;

  function setup({
    value,
    isOptionEnabled,
    text
  }: {
    value?: User;
    isOptionEnabled?: OptionEnabledCallback<User>;
    text?: Text;
  }) {
    onChangeSpy = jest.fn();
    onBlurSpy = jest.fn();

    select = shallow(
      <Select
        id="subject"
        label="Subject"
        placeholder="Please enter your subject"
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

      expect(toJson(select)).toMatchSnapshot(
        'Component: Select => ui => with value'
      );
    });

    describe('loading', () => {
      test('with custom text', () => {
        setup({ value: adminUser, text: { loadingMessage: 'Custom loading' } });

        // @ts-ignore
        select.setState({ loading: true });

        expect(select.find('Spinner').exists()).toBe(true);
        expect(select.find('span').text()).toBe('Custom loading');
      });

      test('with default text', () => {
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

      const rsInput = select.find('Input');

      expect(rsInput.props().value).toBe(undefined);
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

    describe('when options is a function', () => {
      test('when options is a function set options to empty and loading to true', async done => {
        const options = () => Promise.resolve(pageOfUsers);

        // @ts-ignore
        const select = new Select({ options, onChange: jest.fn() });

        jest.spyOn(select, 'setState').mockImplementation(() => undefined);

        try {
          await select.componentDidMount();

          expect(select.setState).toHaveBeenCalledTimes(1);
          expect(select.setState).toHaveBeenCalledWith({
            loading: false,
            options: [adminUser, coordinatorUser, userUser]
          });

          done();
        } catch (e) {
          console.error(e);
          done.fail();
        }
      });

      describe('setting of initial value after loading options', () => {
        test('do nothing when value is set and can be found in the loaded options', async done => {
          const onChange = jest.fn();
          const options = () => Promise.resolve(pageOfUsers);

          // @ts-ignore
          const select = new Select({ options, onChange });
          select.props.value = adminUser;
          select.props.optionForValue = (user: User) => user?.email;

          jest.spyOn(select, 'setState').mockImplementation(() => undefined);

          try {
            await select.componentDidMount();

            expect(onChange).toHaveBeenCalledTimes(0);

            done();
          } catch (e) {
            console.error(e);
            done.fail();
          }
        });

        test('select first option when value is set but not in the loaded options', async done => {
          const onChange = jest.fn();
          const options = () =>
            Promise.resolve(pageWithContent([adminUser, coordinatorUser]));

          // @ts-ignore
          const select = new Select({ options, onChange });
          select.props.value = userUser;
          select.props.optionForValue = (user: User) => user?.email;

          jest.spyOn(select, 'setState').mockImplementation(() => undefined);

          try {
            await select.componentDidMount();

            expect(onChange).toHaveBeenCalledTimes(1);
            expect(onChange).toBeCalledWith(adminUser);

            done();
          } catch (e) {
            console.error(e);
            done.fail();
          }
        });

        test('select first option when value is not set', async done => {
          const onChange = jest.fn();
          const options = () => Promise.resolve(pageOfUsers);

          // @ts-ignore
          const select = new Select({ options, onChange });

          jest.spyOn(select, 'setState').mockImplementation(() => undefined);

          try {
            await select.componentDidMount();

            expect(onChange).toHaveBeenCalledTimes(1);
            expect(onChange).toBeCalledWith(adminUser);

            done();
          } catch (e) {
            console.error(e);
            done.fail();
          }
        });
      });
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

      // @ts-ignore
      expect(option.value).toBe(undefined);
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
      expect(rsInput.props().value).toBe(undefined);
    });

    test('becomes filled', () => {
      setup({ value: undefined, isOptionEnabled: undefined });

      let rsInput = select.find('Input');
      expect(rsInput.props().value).toBe(undefined);

      select.setProps({ value: coordinatorUser });

      rsInput = select.find('Input');
      expect(rsInput.props().value).toBe(1);
    });
  });
});
