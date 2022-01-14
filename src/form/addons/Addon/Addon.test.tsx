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
});
