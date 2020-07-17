import React from 'react';
import { shallow, ShallowWrapper } from 'enzyme';
import toJson from 'enzyme-to-json';

import CheckboxMultipleSelect, { Text } from './CheckboxMultipleSelect';
import { User } from '../../test/types';
import {
  adminUser,
  coordinatorUser,
  pageOfUsers,
  userUser
} from '../../test/fixtures';
import { OptionEnabledCallback } from '../option';

describe('Component: CheckboxMultipleSelect', () => {
  let checkboxMultipleSelect: ShallowWrapper;

  let onChangeSpy: jest.Mock;
  let onBlurSpy: jest.Mock;

  function setup({
    value,
    isOptionEnabled,
    text,
    hasPlaceholder = true,
    hasLabel = true,
    horizontal,
    hasIsOptionEqual = false,
    options
  }: {
    value?: User[];
    isOptionEnabled?: OptionEnabledCallback<User>;
    options?: User[];
    text?: Text;
    hasPlaceholder?: boolean;
    hasLabel?: boolean;
    horizontal?: boolean;
    hasIsOptionEqual?: boolean;
  }) {
    onChangeSpy = jest.fn();
    onBlurSpy = jest.fn();

    const props = {
      placeholder: hasPlaceholder ? 'Please select your subjects' : undefined,
      text,
      isOptionEnabled,
      optionForValue: (user: User) => user.email,
      options: options ? options : [adminUser(), coordinatorUser(), userUser()],
      value,
      onChange: onChangeSpy,
      onBlur: onBlurSpy,
      error: 'Some error',
      horizontal,
      isOptionEqual: hasIsOptionEqual
        ? (a: User, b: User) => a.id === b.id
        : undefined
    };

    if (hasLabel) {
      checkboxMultipleSelect = shallow(
        <CheckboxMultipleSelect id="subject" label="Subject" {...props} />
      );
    } else {
      checkboxMultipleSelect = shallow(<CheckboxMultipleSelect {...props} />);
    }
  }

  describe('ui', () => {
    test('with value', () => {
      setup({ value: [adminUser()] });

      expect(toJson(checkboxMultipleSelect)).toMatchSnapshot(
        'Component: CheckboxMultipleSelect => ui => with value'
      );
    });

    describe('loading', () => {
      test('with custom text', () => {
        setup({
          value: [adminUser()],
          text: { loadingMessage: 'Custom loading' }
        });

        // @ts-ignore
        checkboxMultipleSelect.setState({ loading: true });

        expect(checkboxMultipleSelect.find('Spinner').exists()).toBe(true);
        expect(checkboxMultipleSelect.find('span').text()).toBe(
          'Custom loading'
        );
      });

      test('with default text', () => {
        setup({ value: [adminUser()] });

        // @ts-ignore
        checkboxMultipleSelect.setState({ loading: true });

        expect(checkboxMultipleSelect.find('Spinner').exists()).toBe(true);
        expect(checkboxMultipleSelect.find('span').text()).toBe('Loading...');
      });
    });

    test('without placeholder', () => {
      setup({ value: [adminUser()], hasPlaceholder: false });

      expect(toJson(checkboxMultipleSelect)).toMatchSnapshot(
        'Component: CheckboxMultipleSelect => ui => without placeholder'
      );
    });

    test('without label', () => {
      setup({ value: [adminUser()], hasLabel: false });

      expect(toJson(checkboxMultipleSelect)).toMatchSnapshot(
        'Component: CheckboxMultipleSelect => ui => without label'
      );
    });

    test('horizontal', () => {
      setup({ value: [adminUser()], horizontal: true });

      expect(toJson(checkboxMultipleSelect)).toMatchSnapshot(
        'Component: CheckboxMultipleSelect => ui => horizontal'
      );
    });
  });

  describe('constructor', () => {
    test('when options is an array use that options and set loading to false', () => {
      // @ts-ignore
      const checkboxMultipleSelect = new CheckboxMultipleSelect({
        options: [adminUser()]
      });

      expect(checkboxMultipleSelect.state).toEqual({
        loading: false,
        options: [adminUser()]
      });
    });

    test('when options is a function set options to empty and loading to true', () => {
      // @ts-ignore
      const checkboxMultipleSelect = new CheckboxMultipleSelect({
        options: jest.fn()
      });

      expect(checkboxMultipleSelect.state).toEqual({
        loading: true,
        options: []
      });
    });
  });

  describe('componentDidMount', () => {
    test('when options is an array do nothing', async done => {
      const onChange = jest.fn();

      // @ts-ignore
      const checkboxMultipleSelect = new CheckboxMultipleSelect({
        options: [adminUser(), coordinatorUser(), userUser()],
        onChange
      });

      jest
        .spyOn(checkboxMultipleSelect, 'setState')
        .mockImplementation(() => undefined);

      try {
        await checkboxMultipleSelect.componentDidMount();

        expect(checkboxMultipleSelect.setState).toHaveBeenCalledTimes(0);

        expect(onChange).toHaveBeenCalledTimes(0);

        done();
      } catch (e) {
        console.error(e);
        done.fail();
      }
    });

    test('when options is a function set options to empty and loading to true', async done => {
      const onChange = jest.fn();
      const options = () => Promise.resolve(pageOfUsers());

      // @ts-ignore
      const checkboxMultipleSelect = new CheckboxMultipleSelect({
        options,
        onChange
      });

      jest
        .spyOn(checkboxMultipleSelect, 'setState')
        .mockImplementation(() => undefined);

      try {
        await checkboxMultipleSelect.componentDidMount();

        expect(checkboxMultipleSelect.setState).toHaveBeenCalledTimes(1);
        expect(checkboxMultipleSelect.setState).toHaveBeenCalledWith({
          loading: false,
          options: [adminUser(), coordinatorUser(), userUser()]
        });

        done();
      } catch (e) {
        console.error(e);
        done.fail();
      }
    });
  });

  describe('events', () => {
    describe('onChange', () => {
      it('should when there is no isOptionEqual fall back to simple equality check', () => {
        const admin = adminUser();
        const coordinator = coordinatorUser();
        const user = userUser();

        let value: User[] | undefined = undefined;

        setup({
          value,
          isOptionEnabled: undefined,
          hasIsOptionEqual: false,
          options: [admin, coordinator, user]
        });

        // First lets click on the admin it should be added
        let checkbox = checkboxMultipleSelect.find('Input').at(0);
        // @ts-ignore
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

        // @ts-ignore
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

        // @ts-ignore
        checkbox.props().onChange();

        expect(onChangeSpy).toHaveBeenCalledTimes(3);
        expect(onChangeSpy).toHaveBeenCalledWith([coordinator]);

        // Check that selected is a copy of value
        expect(onChangeSpy.mock.calls[2][0]).not.toBe(value);

        expect(onBlurSpy).toHaveBeenCalledTimes(3);
      });

      it('should when there is a custom isOptionEqual use that for the equality check', () => {
        let value: User[] | undefined = undefined;

        setup({ value, isOptionEnabled: undefined, hasIsOptionEqual: true });

        // First lets click on the admin it should be added
        let checkbox = checkboxMultipleSelect.find('Input').at(0);
        // @ts-ignore
        checkbox.props().onChange();

        expect(onChangeSpy).toHaveBeenCalledTimes(1);
        expect(onChangeSpy).toHaveBeenCalledWith([adminUser()]);

        // Check that selected is a copy of value
        expect(onChangeSpy.mock.calls[0][0]).not.toBe(value);

        expect(onBlurSpy).toHaveBeenCalledTimes(1);

        // Manually set the value since it is external
        value = [adminUser()];
        checkboxMultipleSelect.setProps({ value });

        // Now lets click on the coordinator it should be added
        checkbox = checkboxMultipleSelect.find('Input').at(1);

        // @ts-ignore
        checkbox.props().onChange();

        expect(onChangeSpy).toHaveBeenCalledTimes(2);
        expect(onChangeSpy).toHaveBeenCalledWith([
          adminUser(),
          coordinatorUser()
        ]);

        // Check that selected is a copy of value
        expect(onChangeSpy.mock.calls[1][0]).not.toBe(value);

        expect(onBlurSpy).toHaveBeenCalledTimes(2);

        // Manually set the value since it is external
        value = [adminUser(), coordinatorUser()];
        checkboxMultipleSelect.setProps({ value });

        // Now lets click on the admin again it should be removed
        checkbox = checkboxMultipleSelect.find('Input').at(0);

        // @ts-ignore
        checkbox.props().onChange();

        expect(onChangeSpy).toHaveBeenCalledTimes(3);
        expect(onChangeSpy).toHaveBeenCalledWith([coordinatorUser()]);

        // Check that selected is a copy of value
        expect(onChangeSpy.mock.calls[2][0]).not.toBe(value);

        expect(onBlurSpy).toHaveBeenCalledTimes(3);
      });
    });

    describe('isOptionEnabled', () => {
      it('should when "isOptionEnabled" is not defined always be true', () => {
        setup({ value: [adminUser()], isOptionEnabled: undefined });

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

        setup({ value: undefined, isOptionEnabled: isOptionEnabledSpy });

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
      setup({ value: [userUser()], isOptionEnabled: undefined });

      let checkbox = checkboxMultipleSelect.find('Input').at(2);
      expect(checkbox.props().checked).toBe(true);

      checkboxMultipleSelect.setProps({ value: undefined });

      checkbox = checkboxMultipleSelect.find('Input').at(2);
      expect(checkbox.props().checked).toBe(false);
    });

    test('becomes filled', () => {
      setup({ value: undefined, isOptionEnabled: undefined });

      let checkbox = checkboxMultipleSelect.find('Input').at(1);
      expect(checkbox.props().checked).toBe(false);

      checkboxMultipleSelect.setProps({ value: [coordinatorUser()] });

      checkbox = checkboxMultipleSelect.find('Input').at(1);
      expect(checkbox.props().checked).toBe(true);
    });
  });
});
