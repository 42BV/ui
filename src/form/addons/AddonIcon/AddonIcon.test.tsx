import React from 'react';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';

import { AddonIcon } from './AddonIcon';

describe('Component: AddonIcon', () => {
  function setup() {
    const addonIcon = shallow(
      <AddonIcon icon="360" position="right" className="custom-class" />
    );

    return { addonIcon };
  }

  test('ui', () => {
    const { addonIcon } = setup();

    expect(toJson(addonIcon)).toMatchSnapshot('Component: AddonIcon');
  });
});
