import React from 'react';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';

import { EpicRow } from './EpicRow';

describe('Component: EpicRow', () => {
  function setup({ header }: { header: boolean }) {
    function children() {
      return <h1>children</h1>;
    }

    const epicRow = shallow(<EpicRow header={header}>{children}</EpicRow>);

    return { epicRow };
  }

  test('is header row', () => {
    const { epicRow } = setup({ header: true });

    expect(toJson(epicRow)).toMatchSnapshot();
  });

  test('is regular row', () => {
    const { epicRow } = setup({ header: false });

    expect(epicRow).toMatchSnapshot();
  });
});
