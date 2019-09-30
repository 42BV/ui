import React from 'react';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';

import { EpicCellLayout } from './EpicCellLayout';

describe('Component: EpicCellLayout', () => {
  test('vertical', () => {
    const vertical = shallow(
      <EpicCellLayout mode="vertical">vertical</EpicCellLayout>
    );
    expect(toJson(vertical)).toMatchSnapshot();
  });

  test('horizontal', () => {
    const horizontal = shallow(
      <EpicCellLayout mode="horizontal">horizontal</EpicCellLayout>
    );
    expect(toJson(horizontal)).toMatchSnapshot();
  });
});
