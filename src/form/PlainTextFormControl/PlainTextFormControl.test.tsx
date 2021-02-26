import React from 'react';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';

import { PlainTextFormControl } from './PlainTextFormControl';

describe('Component: PlainTextFormControl', () => {
  function setup({
    label = 'name',
    labelClassName,
    valueClassName
  }: {
    label?: string;
    labelClassName?: string;
    valueClassName?: string;
  }) {
    const props = {
      label,
      labelClassName,
      valueClassName
    };
    const plainTextFormControl = shallow(
      <PlainTextFormControl {...props}>This is your name</PlainTextFormControl>
    );
    return { plainTextFormControl };
  }

  describe('ui', () => {
    test('default', () => {
      const { plainTextFormControl } = setup({});
      expect(toJson(plainTextFormControl)).toMatchSnapshot(
        'Component: PlainTextFormControl => ui => default'
      );
    });

    test('without label', () => {
      const { plainTextFormControl } = setup({
        label: ''
      });
      expect(toJson(plainTextFormControl)).toMatchSnapshot(
        'Component: PlainTextFormControl => ui => without label'
      );
    });

    test('with label class name', () => {
      const { plainTextFormControl } = setup({
        labelClassName: 'label-class-name'
      });
      expect(plainTextFormControl.find('Label').props().className).toBe(
        'label-class-name'
      );
    });

    test('with value class name', () => {
      const { plainTextFormControl } = setup({
        valueClassName: 'value-class-name'
      });
      expect(plainTextFormControl.find('div').props().className).toBe(
        'form-control-plaintext value-class-name'
      );
    });
  });
});
