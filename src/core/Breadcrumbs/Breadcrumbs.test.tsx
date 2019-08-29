import React from 'react';
import { shallow, ShallowWrapper } from 'enzyme';
import toJson from 'enzyme-to-json';

import Breadcrumbs, { ItemProps } from './Breadcrumbs';

describe('Component: Breadcrumbs', () => {
  let breadcrumbs: ShallowWrapper;

  function setup({ items }: { items?: ItemProps[] }) {
    breadcrumbs = shallow(<Breadcrumbs items={items} />);
  }

  describe('ui', () => {
    test('default', () => {
      setup({ items: [{ name: 'Dashboard', url: '/dashboard' }] });

      expect(toJson(breadcrumbs)).toMatchSnapshot(
        'Component: Breadcrumbs => ui => default'
      );
    });

    test('with active', () => {
      setup({
        items: [
          { name: 'Dashboard', url: '/dashboard' },
          { name: 'Library', active: true }
        ]
      });

      expect(toJson(breadcrumbs)).toMatchSnapshot(
        'Component: Breadcrumbs => ui => with active'
      );
    });
  });
});
