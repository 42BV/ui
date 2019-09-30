import React from 'react';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';

import { EpicCell } from './EpicCell';

describe('Component: EpicCell', () => {
  test('ui', () => {
    const epicCell = shallow(
      <EpicCell width={300} height={44}>
        epic cell
      </EpicCell>
    );

    expect(toJson(epicCell)).toMatchSnapshot();
  });
});
