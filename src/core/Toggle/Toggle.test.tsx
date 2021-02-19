import React from 'react';
import { shallow, ShallowWrapper } from 'enzyme';
import toJson from 'enzyme-to-json';

import Toggle from './Toggle';
import Tooltip from '../Tooltip/Tooltip';

describe('Component: Toggle', () => {
  let toggle: ShallowWrapper;
  let onChangeSpy: jest.Mock<any, any>;
  let onBlurSpy: jest.Mock<any, any>;

  function setup({
    value,
    label
  }: {
    value?: boolean;
    label?: React.ReactNode;
  }) {
    onChangeSpy = jest.fn();
    onBlurSpy = jest.fn();

    toggle = shallow(
      <Toggle
        id="toggle"
        color="primary"
        value={value}
        onChange={onChangeSpy}
        onBlur={onBlurSpy}
        label={label}
      />
    );
  }

  describe('ui', () => {
    test('without label', () => {
      setup({ value: true });
      expect(toJson(toggle)).toMatchSnapshot(
        'Component: Toggle => ui => without label'
      );
    });

    test('with text label', () => {
      setup({ value: false, label: 'test' });
      expect(toJson(toggle)).toMatchSnapshot(
        'Component: Toggle => ui => with text label'
      );
    });

    test('with custom label', () => {
      const label = <Tooltip content="Is this a test?">test</Tooltip>;
      setup({ value: false, label });
      expect(toJson(toggle)).toMatchSnapshot(
        'Component: Toggle => ui => with custom label'
      );
    });
  });

  describe('events', () => {
    test('onChange', () => {
      setup({ value: false });
      const input = toggle.find('input');
      // @ts-expect-error Test mock
      input.props().onChange({ target: { checked: true } });

      expect(onChangeSpy).toHaveBeenCalledTimes(1);
      expect(onChangeSpy).toHaveBeenCalledWith(true);

      // @ts-expect-error Test mock
      input.props().onChange({ target: { checked: false } });

      expect(onChangeSpy).toHaveBeenCalledTimes(2);
      expect(onChangeSpy).toHaveBeenCalledWith(false);
    });

    test('onBlur', () => {
      setup({ value: true });
      const input = toggle.find('input');

      // @ts-expect-error Test mock
      input.props().onBlur();
      expect(onBlurSpy).toHaveBeenCalledTimes(1);
    });

    test('click on label should call onChange', () => {
      setup({ value: false, label: 'test' });
      const label = toggle.find('span').last();

      // @ts-expect-error Test mock
      label.props().onClick();

      expect(onChangeSpy).toHaveBeenCalledTimes(1);
      expect(onChangeSpy).toHaveBeenCalledWith(true);
    });
  });

  describe('checked changes', () => {
    test('becomes empty', () => {
      setup({ value: false });

      let input = toggle.find('input');
      expect(input.props().checked).toBe(false);

      toggle.setProps({ value: undefined });

      input = toggle.find('input');
      expect(input.props().checked).toBe(false);
    });

    test('becomes filled', () => {
      setup({ value: undefined });

      let input = toggle.find('input');
      expect(input.props().checked).toBe(false);

      toggle.setProps({ value: true });

      input = toggle.find('input');
      expect(input.props().checked).toBe(true);
    });
  });
});
