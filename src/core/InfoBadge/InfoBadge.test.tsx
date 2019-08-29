import React from 'react';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';

import InfoBadge from './InfoBadge';

describe('Component: InfoBadge', () => {
  test('ui', () => {
    const infoBadge = shallow(
      <InfoBadge value={5} color="primary">
        <h1>Children</h1>
      </InfoBadge>
    );
    expect(toJson(infoBadge)).toMatchSnapshot('Component: InfoBadge => ui');
  });

  test('with extra className', () => {
    const infoBadge = shallow(
      <InfoBadge className="extra-class" value={5} color="primary">
        <h1>Children</h1>
      </InfoBadge>
    );

    expect(infoBadge.find('.extra-class').length).toBe(1);
  });
});
