import React from 'react';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';

import Loading from './Loading';

describe('Component: Loading', () => {
  describe('ui', () => {
    test('without children', () => {
      const loading = shallow(<Loading />);

      expect(toJson(loading)).toMatchSnapshot(
        'Component: Loading => ui => without children'
      );
    });

    test('with children', () => {
      const loading = shallow(
        <Loading>
          We are <b>loading</b> the world!
        </Loading>
      );

      expect(toJson(loading)).toMatchSnapshot(
        'Component: Loading => ui => with children'
      );
    });
  });
});
