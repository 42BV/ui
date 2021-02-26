import React from 'react';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';

import { AttributeView } from './AttributeView';

describe('Component: AttributeView', () => {
  test('ui', () => {
    const attributeView = shallow(
      <AttributeView label="Name">42 BV</AttributeView>
    );

    expect(toJson(attributeView)).toMatchSnapshot();
  });
});
