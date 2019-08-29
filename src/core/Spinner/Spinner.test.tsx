import React from 'react';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';

import Spinner from './Spinner';

describe('Component: Spinner', () => {
  test('ui', () => {
    const spinner = shallow(<Spinner color="white" size={42} />);

    expect(toJson(spinner)).toMatchSnapshot('Component: Spinner => ui');
  });
});
