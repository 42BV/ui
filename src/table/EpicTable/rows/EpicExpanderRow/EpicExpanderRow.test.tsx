import React from 'react';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';

import { EpicExpanderRow } from './EpicExpanderRow';

describe('Component: EpicExpanderRow', () => {
  function setup({ active }: { active: boolean }) {
    function children() {
      return <h1>children</h1>;
    }

    const injected = {
      width: 100
    };

    const epicExpanderRow = shallow(
      <EpicExpanderRow active={active} height={44} {...injected}>
        {children}
      </EpicExpanderRow>
    );

    return { epicExpanderRow };
  }

  test('is active', () => {
    const { epicExpanderRow } = setup({ active: true });

    expect(toJson(epicExpanderRow)).toMatchSnapshot();
  });

  test('is not active', () => {
    const { epicExpanderRow } = setup({ active: false });

    expect(epicExpanderRow.isEmptyRender()).toBe(true);
  });
});
