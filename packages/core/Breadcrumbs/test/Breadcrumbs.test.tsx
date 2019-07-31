import React from 'react';
import { shallow, ShallowWrapper } from 'enzyme';
import toJson from 'enzyme-to-json';

import Breadcrumbs from '../src/Breadcrumbs';

describe('Component: Breadcrumbs', () => {
  let breadcrumbs: ShallowWrapper;

  function setup({ items }: { items?: { url: string; name: string }[] }) {
    breadcrumbs = shallow(<Breadcrumbs items={items} />);
  }

  describe('ui', () => {
    test('default', () => {
      setup({ items: [{ name: 'Dashboard', url: '/dashboard' }] });

      expect(toJson(breadcrumbs)).toMatchSnapshot(
        'Component: Breadcrumbs => ui => default'
      );
    });
  });
});
