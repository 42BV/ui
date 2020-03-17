import React from 'react';
import { shallow, ShallowWrapper } from 'enzyme';
import toJson from 'enzyme-to-json';

import Toggle from './Toggle';

describe('Component: Toggle', () => {
  let toggle: ShallowWrapper;
  let onChangeSpy: jest.Mock<any, any>;
  let onBlurSpy: jest.Mock<any, any>;

  function setup({ value }: { value?: boolean }) {
    onChangeSpy = jest.fn();
    onBlurSpy = jest.fn();

    toggle = shallow(
      <Toggle
        id="toggle"
        color="primary"
        value={value}
        onChange={onChangeSpy}
        onBlur={onBlurSpy}
      />
    );
  }

  test('ui', () => {
    setup({ value: true });
    expect(toJson(toggle)).toMatchSnapshot('Component: Toggle => ui');
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
