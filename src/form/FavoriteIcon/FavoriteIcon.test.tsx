import React from 'react';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';

import { FavoriteIcon } from './FavoriteIcon';
import { Color } from '../../core/types';

describe('Component: FavoriteIcon', () => {
  function setup({
    value,
    color,
    size
  }: {
    value: boolean;
    color?: Color;
    size?: number;
  }) {
    const onChangeSpy = jest.fn();

    const favoriteIcon = shallow(
      <FavoriteIcon
        onChange={onChangeSpy}
        value={value}
        color={color}
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
  });

  describe('events', () => {
    it('should when value is false and the icon is clicked call onChange with true', () => {
      const { favoriteIcon, onChangeSpy } = setup({ value: false });

      favoriteIcon.find('Icon').simulate('click');

      expect(onChangeSpy).toHaveBeenCalledTimes(1);
      expect(onChangeSpy).toHaveBeenCalledWith(true);
    });

    it('should when value is true and the icon is clicked call onChange with false', () => {
      const { favoriteIcon, onChangeSpy } = setup({ value: true });

      favoriteIcon.find('Icon').simulate('click');

      expect(onChangeSpy).toHaveBeenCalledTimes(1);
      expect(onChangeSpy).toHaveBeenCalledWith(false);
    });
  });
});
