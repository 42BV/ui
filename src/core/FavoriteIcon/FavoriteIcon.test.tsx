import React from 'react';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';

import { FavoriteIcon } from './FavoriteIcon';
import { Color } from '../types';

describe('Component: FavoriteIcon', () => {
  function setup({
    value,
    color,
    hoverColor,
    size
  }: {
    value: boolean;
    color?: Color;
    hoverColor?: Color;
    size?: number;
  }) {
    const onChangeSpy = jest.fn();

    const favoriteIcon = shallow(
      <FavoriteIcon
        onChange={onChangeSpy}
        value={value}
        color={color}
        hoverColor={hoverColor}
        size={size}
      />
    );

    return { favoriteIcon, onChangeSpy };
  }

  describe('ui', () => {
    test('favorite', () => {
      const { favoriteIcon } = setup({ value: true });

      expect(toJson(favoriteIcon)).toMatchSnapshot(
        'Component: FavoriteIcon => ui => favorite'
      );
    });

    test('not favorite', () => {
      const { favoriteIcon } = setup({ value: false });

      expect(toJson(favoriteIcon)).toMatchSnapshot(
        'Component: FavoriteIcon => ui => not favorite'
      );
    });

    test('size', () => {
      const { favoriteIcon } = setup({ value: false, size: 10 });

      expect(favoriteIcon.find('Icon').props().size).toBe(10);
    });

    test('color', () => {
      const { favoriteIcon } = setup({ value: false, color: 'primary' });

      expect(favoriteIcon.find('Icon').props().color).toBe('primary');
    });

    describe('hoverColor', () => {
      it('should use hoverColor when hoverColor is defined', () => {
        const { favoriteIcon } = setup({
          value: true,
          color: 'secondary',
          hoverColor: 'success'
        });

        // @ts-expect-error Mock test
        expect(favoriteIcon.find('Icon').props().hoverColor).toBe('success');
      });

      it('should use activeColor when hoverColor is not defined', () => {
        const { favoriteIcon } = setup({ value: true });

        // @ts-expect-error Mock test
        expect(favoriteIcon.find('Icon').props().hoverColor).toBe('primary');
      });
    });
  });

  describe('events', () => {
    it('should when value is false and the icon is clicked call onChange with true', () => {
      const { favoriteIcon, onChangeSpy } = setup({ value: false });

      const event = {
        preventDefault: jest.fn()
      };
      favoriteIcon.find('Icon').simulate('click', event);

      expect(onChangeSpy).toHaveBeenCalledTimes(1);
      expect(onChangeSpy).toHaveBeenCalledWith(true);
    });

    it('should when value is true and the icon is clicked call onChange with false', () => {
      const { favoriteIcon, onChangeSpy } = setup({ value: true });

      const event = {
        preventDefault: jest.fn()
      };
      favoriteIcon.find('Icon').simulate('click', event);

      expect(onChangeSpy).toHaveBeenCalledTimes(1);
      expect(onChangeSpy).toHaveBeenCalledWith(false);
    });

    it('should prevent click callbacks in parent components from being called', () => {

      const { favoriteIcon } = setup({ value: true });

      const event = {
        preventDefault: jest.fn()
      };
      favoriteIcon.find('Icon').simulate('click', event);

      expect(event.preventDefault).toHaveBeenCalledTimes(1);
    });
  });
});
