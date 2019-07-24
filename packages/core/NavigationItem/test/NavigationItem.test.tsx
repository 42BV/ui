import React from 'react';
import { shallow, ShallowWrapper } from 'enzyme';
import toJson from 'enzyme-to-json';
import * as authentication from '@42.nl/authentication';

import NavigationItem from '../src/NavigationItem';
type UserRole = 'ADMIN' | 'USER';

jest.mock('@42.nl/authentication');

describe('Component: NavigationItem', () => {
  let navigationItem: ShallowWrapper;

  function setup({ requiresRole }: { requiresRole?: UserRole }) {
    // @ts-ignore
    authentication.useCurrentUser = () => ({
      roles: ['ADMIN']
    });

    navigationItem = shallow(
      <NavigationItem
        to="/dashboard"
        icon="dashboard"
        text="Dashboard"
        requiresRole={requiresRole}
      />
    );
  }

  test('ui', () => {
    setup({ requiresRole: undefined });
    expect(toJson(navigationItem)).toMatchSnapshot();
  });

  it('should not render an item when the user misses the rights', () => {
    setup({ requiresRole: 'USER' });
    expect(navigationItem.isEmptyRender()).toBe(true);
  });

  it('should render an item when no role is required', () => {
    setup({ requiresRole: undefined });
    expect(navigationItem.isEmptyRender()).toBe(false);
  });
});
