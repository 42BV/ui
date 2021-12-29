import React from 'react';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';

import { BooleanIcon } from './BooleanIcon';
import { Color } from '../types';

describe('Component: BooleanIcon', () => {
  function setup({
    value,
    color,
    hoverColor,
    size,
    hasOnChangeSpy
  }: {
    value: boolean;
    color?: Color;
    hoverColor?: Color;
    size?: number;
    hasOnChangeSpy?: boolean;
  }) {
    const onChangeSpy = jest.fn();

    const booleanIcon = shallow(
      <BooleanIcon
        value={value}
        size={size}
        color={color}
        hoverColor={hoverColor}
        onChange={hasOnChangeSpy ? onChangeSpy : undefined}
      />
    );

    return { booleanIcon, onChangeSpy };
  }

  describe('ui', () => {
    test('value true', () => {
      const { booleanIcon } = setup({ value: true });

      expect(toJson(booleanIcon)).toMatchSnapshot(
        'Component: BooleanIcon => ui => value true'
      );
    });

    test('value false', () => {
      const { booleanIcon } = setup({ value: false });

      expect(
        // @ts-expect-error Test mock
        booleanIcon.find('Icon').props().icon
      ).toBe('check_box_outline_blank');
    });

    test('size', () => {
      const { booleanIcon } = setup({ value: false, size: 10 });

      expect(booleanIcon.find('Icon').props().size).toBe(10);
    });

    test('color', () => {
      const { booleanIcon } = setup({ value: false, color: 'secondary' });

      expect(booleanIcon.find('Icon').props().color).toBe('secondary');
    });

    describe('activeColor', () => {
      it('should not use activeColor when value is true if onChange is not defined', () => {
        const { booleanIcon } = setup({
          value: true,
          color: 'secondary',
          hasOnChangeSpy: false
        });

        expect(booleanIcon.find('Icon').props().color).toBe('secondary');
      });

      it('should use activeColor when value is true if onChange is defined', () => {
        const { booleanIcon } = setup({ value: true, hasOnChangeSpy: true });

        expect(booleanIcon.find('Icon').props().color).toBe('primary');
      });
    });

    describe('hoverColor', () => {
      it('should use hoverColor when onChange and hoverColor are defined', () => {
        const { booleanIcon } = setup({
          value: true,
          color: 'secondary',
          hoverColor: 'success',
          hasOnChangeSpy: true
        });

        // @ts-expect-error Mock test
        expect(booleanIcon.find('Icon').props().hoverColor).toBe('success');
      });

      it('should not use activeColor when onChange and hoverColor are not defined', () => {
        const { booleanIcon } = setup({
          value: true,
          color: 'secondary',
          hasOnChangeSpy: false
        });

        // @ts-expect-error Mock test
        expect(booleanIcon.find('Icon').props().hoverColor).toBe(undefined);
      });

      it('should use activeColor when hoverColor is not defined and onChange is defined', () => {
        const { booleanIcon } = setup({ value: true, hasOnChangeSpy: true });

        // @ts-expect-error Mock test
        expect(booleanIcon.find('Icon').props().hoverColor).toBe('primary');
      });
    });
  });

  describe('events', () => {
    it('should call onChange when clicked', () => {
      const { booleanIcon, onChangeSpy } = setup({
        value: false,
        hasOnChangeSpy: true
      });

      const event = {
        preventDefault: jest.fn()
      };
      booleanIcon.find('Icon').simulate('click', event);

      expect(onChangeSpy).toHaveBeenCalledTimes(1);
      expect(event.preventDefault).toHaveBeenCalledTimes(1);
    });
  });
});
