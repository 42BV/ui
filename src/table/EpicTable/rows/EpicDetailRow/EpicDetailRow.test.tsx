import React from 'react';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';

import { EpicDetailRow } from './EpicDetailRow';

describe('Component: EpicDetailRow', () => {
  function setup({ active }: { active: boolean }) {
    function children() {
      return <h1>children</h1>;
    }

    const injected = {
      width: 100,
      top: 1900,
      height: 100
    };

    const epicDetailRow = shallow(
      <EpicDetailRow active={active} left={300} {...injected}>
        {children}
      </EpicDetailRow>
    );

    return { epicDetailRow };
  }

  test('is active', () => {
    const { epicDetailRow } = setup({ active: true });

    expect(toJson(epicDetailRow)).toMatchSnapshot();
  });

  test('is not active', () => {
    const { epicDetailRow } = setup({ active: false });

    expect(epicDetailRow.isEmptyRender()).toBe(true);
  });
});
