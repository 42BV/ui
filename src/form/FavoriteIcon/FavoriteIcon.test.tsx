import React from 'react';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';

import { FavoriteIcon } from './FavoriteIcon';

describe('Component: FavoriteIcon', () => {
  function setup({ value }: { value: boolean }) {
    const onChangeSpy = jest.fn();

    const favoriteIcon = shallow(
      <FavoriteIcon onChange={onChangeSpy} value={value} />
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
