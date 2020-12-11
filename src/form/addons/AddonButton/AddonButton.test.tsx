import React from 'react';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';

import { AddonButton } from './AddonButton';
import { IconPosition } from '../../../core/Button/Button';
import { Color } from '../../../core/types';

describe('Component: AddonButton', () => {
  function setup({
    position,
    color
  }: {
    position?: IconPosition;
    color?: Color;
  }) {
    const onClickSpy = jest.fn();

    const addonButton = shallow(
      <AddonButton position={position} color={color} onClick={onClickSpy}>
        42
      </AddonButton>
    );

    return { addonButton, onClickSpy };
  }

  test('ui', () => {
    const { addonButton } = setup({});

    expect(toJson(addonButton)).toMatchSnapshot('Component: AddonButton');
  });

  describe('color behavior', () => {
    it('should show a primary button when color is empty', () => {
      const { addonButton } = setup({ color: undefined });

      expect(addonButton.find('Button').props().color).toBe('primary');
    });

    it('should show the color when property color is set', () => {
      const { addonButton } = setup({ color: 'danger' });

      expect(addonButton.find('Button').props().color).toBe('danger');
    });
  });

  it('should call onClick when the button is clicked', () => {
    const { addonButton, onClickSpy } = setup({ color: 'danger' });

    const button = addonButton.find('Button');

    button.simulate('click');

    expect(onClickSpy).toHaveBeenCalledTimes(1);
  });
});
