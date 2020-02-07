import React from 'react';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';

import { EpicFormCell } from './EpicFormCell';

describe('Component: EpicFormCell', () => {
  test('ui', () => {
    const epicFormCell = shallow(
      <EpicFormCell width={200} height={48}>
        just a test
      </EpicFormCell>
    );
    expect(toJson(epicFormCell)).toMatchSnapshot();
  });
});
