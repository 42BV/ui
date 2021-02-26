import React from 'react';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';

import { AttributeList } from './AttributeList';
import { AttributeView } from '../AttributeView/AttributeView';

describe('Component: AttributeList', () => {
  test('ui', () => {
    const attributeList = shallow(
      <AttributeList>
        <AttributeView label="Name">42 BV</AttributeView>
        <AttributeView label="City">Zoetermeer</AttributeView>
        <AttributeView label="Country">Netherlands</AttributeView>
      </AttributeList>
    );

    expect(toJson(attributeList)).toMatchSnapshot();
  });
});
