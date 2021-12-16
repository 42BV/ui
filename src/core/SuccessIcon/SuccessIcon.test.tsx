import React from 'react';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';

import { SuccessIcon } from './SuccessIcon';
import { Color } from '../types';
import * as UseHover from '../../hooks/useHover/useHover';

describe('Component: SuccessIcon', () => {
  function setup({
    value,
    color,
    size,
    hasOnChangeSpy
  }: {
    value: boolean;
    color?: Color;
    size?: number;
    hasOnChangeSpy?: boolean;
  }) {
    const onChangeSpy = jest.fn();

    const successIcon = shallow(
      <SuccessIcon
        value={value}
        color={color}
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

    it('should change the color of the icon when hovered', () => {
      jest
        .spyOn(UseHover, 'useHover')
        .mockReturnValue([
          true,
          { onMouseEnter: jest.fn(), onMouseLeave: jest.fn() }
        ]);

      const { successIcon } = setup({
        value: false,
        hasOnChangeSpy: true
      });

      expect(successIcon.find('Icon').props().color).toBe('primary');
    });
  });
});
