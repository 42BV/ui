import React from 'react';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';

import * as ShowAfter from '../../hooks/useShowAfter/useShowAfter';

import LoadingPage from './LoadingPage';

describe('Component: LoadingPage', () => {
  function setup({ show, height }: { show: boolean; height?: number }) {
    jest.spyOn(ShowAfter, 'useShowAfter').mockReturnValue(show);

    return shallow(<LoadingPage height={height} />);
  }

  describe('ui', () => {
    test('default', () => {
      const loadingPage = setup({ show: true });

      expect(toJson(loadingPage)).toMatchSnapshot();
    });

    test('with no spinner because it is not after the timeout', () => {
      const loadingPage = setup({ show: false });

      expect(toJson(loadingPage)).toMatchSnapshot();
    });

    test('with custom height', () => {
      const loadingPage = setup({ show: true, height: 200 });

      expect(toJson(loadingPage)).toMatchSnapshot();
    });
  });
});
