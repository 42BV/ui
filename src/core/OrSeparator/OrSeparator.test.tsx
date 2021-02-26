import React from 'react';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';

import { OrSeparator } from './OrSeparator';

describe('Component: OrSeparator', () => {
  function setup() {
    const orSeparator = shallow(<OrSeparator />);

    return { orSeparator };
  }

  describe('ui', () => {
    test('default', () => {
      const { orSeparator } = setup();

      expect(toJson(orSeparator)).toMatchSnapshot(
        'Component: OrSeparator => ui => default'
      );
    });
  });
});
