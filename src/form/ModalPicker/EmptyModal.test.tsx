import React from 'react';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';

import EmptyModal from './EmptyModal';

describe('Component: EmptyModal', () => {
  test('mode: empty', () => {
    const emptyModal = shallow(<EmptyModal userHasSearched={false} />);

    expect(toJson(emptyModal)).toMatchSnapshot(
      'Component: EmptyModal => mode: empty'
    );
  });

  test('mode: no-results', () => {
    const emptyModal = shallow(<EmptyModal userHasSearched={true} />);

    expect(toJson(emptyModal)).toMatchSnapshot(
      'Component: EmptyModal => mode: no-results'
    );
  });
});
