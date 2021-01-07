import React from 'react';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';

import { Addon } from './Addon';
import { ButtonIconPosition } from '../../../core/Button/Button';

describe('Component: Addon', () => {
  function setup({ position }: { position?: ButtonIconPosition }) {
    const addon = shallow(<Addon position={position}>42</Addon>);

    return { addon };
  }

  test('ui', () => {
    const { addon } = setup({});

    expect(toJson(addon)).toMatchSnapshot('Component: Addon');
  });

  describe('position behavior', () => {
    it('should use addonType "append" when right', () => {
      const { addon } = setup({ position: 'right' });

      // @ts-expect-error Test mock
      expect(addon.find('InputGroupAddon').props().addonType).toBe('append');
    });

    it('should use addonType "prepend" when no position is given', () => {
      const { addon } = setup({ position: undefined });

      // @ts-expect-error Test mock
      expect(addon.find('InputGroupAddon').props().addonType).toBe('prepend');
    });

    it('should use addonType "prepend" when left', () => {
      const { addon } = setup({ position: 'left' });

      // @ts-expect-error Test mock
      expect(addon.find('InputGroupAddon').props().addonType).toBe('prepend');
    });
  });
});
