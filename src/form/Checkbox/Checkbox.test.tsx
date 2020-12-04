import React from 'react';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';

import Checkbox from './Checkbox';

describe('Component: Checkbox', () => {
  function setup({
    value,
    placeholder = true,
    allowIndeterminate = false
  }: {
    value?: boolean | '';
    placeholder?: boolean;
    allowIndeterminate?: boolean;
  }) {
    const onChangeSpy = jest.fn();
    const onBlurSpy = jest.fn();

    const checkbox = shallow(
      <Checkbox
        id="agree"
        label="Agree"
        placeholder={placeholder ? 'Do you agree' : ''}
        // @ts-expect-error Test mock
        value={value}
        valid={value === true}
        allowIndeterminate={allowIndeterminate}
        onChange={onChangeSpy}
        onBlur={onBlurSpy}
        error="Some error"
      />
    );

    return { checkbox, onBlurSpy, onChangeSpy };
  }

  describe('ui', () => {
    test('with placeholder', () => {
      const { checkbox } = setup({ value: true, placeholder: true });

      expect(toJson(checkbox)).toMatchSnapshot(
        'Component: Checkbox => ui => with placeholder'
      );
    });

    test('without placeholder', () => {
      const { checkbox } = setup({ value: false, placeholder: false });

      expect(toJson(checkbox)).toMatchSnapshot(
        'Component: Checkbox => ui => without placeholder'
      );
    });
  });

  describe('allowIndeterminate is true', () => {
    function setupAllowIndeterminate({
      value
    }: {
      value: boolean | undefined | '';
    }) {
      const { checkbox } = setup({
        value,
        allowIndeterminate: true
      });

      const fakeElement = { indeterminate: undefined };

      checkbox
        .find('Input')
        .props()
        // @ts-expect-error Test mock
        .innerRef(fakeElement);

      return fakeElement.indeterminate;
    }

    it('should set indeterminate to false when value is true', () => {
      const indeterminate = setupAllowIndeterminate({ value: true });

      expect(indeterminate).toBe(false);
    });

    it('should set indeterminate to false when value is false', () => {
      const indeterminate = setupAllowIndeterminate({ value: false });

      expect(indeterminate).toBe(false);
    });

    it('should set indeterminate to true when value is undefined', () => {
      const indeterminate = setupAllowIndeterminate({ value: undefined });

      expect(indeterminate).toBe(true);
    });

    it('should set indeterminate to true when value is empty string from final-form compat', () => {
      const indeterminate = setupAllowIndeterminate({ value: '' });

      expect(indeterminate).toBe(true);
    });
  });

  test('when innerRef has no element that the check for indeterminate is ignored', () => {
    const { checkbox } = setup({
      value: true,
      allowIndeterminate: true
    });

    // Nothing to check here really
    checkbox
      .find('Input')
      .props()
      // @ts-expect-error Test mock
      .innerRef(null);
  });

  describe('events', () => {
    test('onChange', () => {
      const { checkbox, onBlurSpy, onChangeSpy } = setup({ value: true });

      // @ts-expect-error Test mock
      checkbox
        .find('Input')
        .props()
        // @ts-expect-error Test mock
        .onChange();

      expect(onChangeSpy).toHaveBeenCalledTimes(1);
      expect(onChangeSpy).toHaveBeenCalledWith(false);

      expect(onBlurSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe('value changes', () => {
    test('becomes empty', () => {
      const { checkbox } = setup({ value: true });

      let input = checkbox.find('Input');
      expect(input.props().checked).toBe(true);

      checkbox.setProps({ value: undefined });

      input = checkbox.find('Input');
      expect(input.props().checked).toBe(false);
    });

    test('becomes filled from false', () => {
      const { checkbox } = setup({ value: false });

      let input = checkbox.find('Input');
      expect(input.props().checked).toBe(false);

      checkbox.setProps({ value: true });

      input = checkbox.find('Input');
      expect(input.props().checked).toBe(true);
    });

    test('becomes filled from undefined', () => {
      const { checkbox } = setup({ value: undefined });

      let input = checkbox.find('Input');
      expect(input.props().checked).toBe(false);

      checkbox.setProps({ value: true });

      input = checkbox.find('Input');
      expect(input.props().checked).toBe(true);
    });
  });
});
