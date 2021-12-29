import React from 'react';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';

import { SuccessIcon } from './SuccessIcon';
import { Color } from '../types';

describe('Component: SuccessIcon', () => {
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

    const successIcon = shallow(
      <SuccessIcon
        value={value}
        color={color}
        hoverColor={hoverColor}
        size={size}
        onChange={hasOnChangeSpy ? onChangeSpy : undefined}
      />
    );

    return { successIcon, onChangeSpy };
  }

  describe('ui', () => {
    test('value true', () => {
      const { successIcon } = setup({ value: true });

      expect(toJson(successIcon)).toMatchSnapshot(
        'Component: SuccessIcon => ui => value true'
      );
    });

    test('value false', () => {
      const { successIcon } = setup({ value: false });

      expect(
        // @ts-expect-error Test mock
        successIcon.find('Icon').props().icon
      ).toBe('clear');
    });

    test('size', () => {
      const { successIcon } = setup({ value: false, size: 10 });

      expect(successIcon.find('Icon').props().size).toBe(10);
    });

    test('color', () => {
      const { successIcon } = setup({ value: false, color: 'primary' });

      expect(successIcon.find('Icon').props().color).toBe('primary');
    });

    describe('activeColor', () => {
      it('should not use activeColor when value is true if onChange is not defined', () => {
        const { successIcon } = setup({
          value: true,
          color: 'secondary',
          hasOnChangeSpy: false
        });

        expect(successIcon.find('Icon').props().color).toBe('secondary');
      });

      it('should use activeColor when value is true if onChange is defined', () => {
        const { successIcon } = setup({ value: true, hasOnChangeSpy: true });

        expect(successIcon.find('Icon').props().color).toBe('primary');
      });
    });

    describe('hoverColor', () => {
      it('should use hoverColor when onChange and hoverColor are defined', () => {
        const { successIcon } = setup({
          value: true,
          color: 'secondary',
          hoverColor: 'success',
          hasOnChangeSpy: true
        });

        // @ts-expect-error Mock test
        expect(successIcon.find('Icon').props().hoverColor).toBe('success');
      });

      it('should not use activeColor when onChange and hoverColor are not defined', () => {
        const { successIcon } = setup({
          value: true,
          color: 'secondary',
          hasOnChangeSpy: false
        });

        // @ts-expect-error Mock test
        expect(successIcon.find('Icon').props().hoverColor).toBe(undefined);
      });

      it('should use activeColor when hoverColor is not defined and onChange is defined', () => {
        const { successIcon } = setup({ value: true, hasOnChangeSpy: true });

        // @ts-expect-error Mock test
        expect(successIcon.find('Icon').props().hoverColor).toBe('primary');
      });
    });
  });

  describe('events', () => {
    it('should call onChange when clicked', () => {
      const { successIcon, onChangeSpy } = setup({
        value: false,
        hasOnChangeSpy: true
      });

      const event = {
        preventDefault: jest.fn()
      };
      successIcon.find('Icon').simulate('click', event);

      expect(onChangeSpy).toHaveBeenCalledTimes(1);
    });
  });
});
