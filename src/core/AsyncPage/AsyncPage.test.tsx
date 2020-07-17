import React from 'react';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';

import AsyncPage, { isEmpty } from './AsyncPage';

import { Page, emptyPage } from '@42.nl/spring-connect';
import { User } from '../../test/types';
import { pageOfUsers } from '../../test/fixtures';

type State = {
  isLoading: boolean;
  isFulfilled: boolean;
  data: Page<User>;
};

describe('Component: AsyncPage', () => {
  function setup({ state }: { state: State }) {
    const asyncPage = shallow(
      <AsyncPage
        // @ts-ignore
        state={state}
        showRetryButton={true}
        text={{ loading: 'Custom loading' }}
      >
        {data => (
          <ul>
            {data.content.map(user => (
              <li key={user.id}>{user.email}</li>
            ))}
          </ul>
        )}
      </AsyncPage>
    );

    return { asyncPage };
  }

  test('ui', () => {
    const state = {
      isLoading: false,
      isFulfilled: true,
      data: pageOfUsers()
    };

    const { asyncPage } = setup({ state });

    expect(toJson(asyncPage)).toMatchSnapshot();
  });
});

describe('isEmpty', () => {
  it('should consider it empty when the totalElements is zero', () => {
    expect(isEmpty(emptyPage())).toBe(true);
  });

  it('should consider it empty when the totalElements is zero', () => {
    expect(isEmpty(pageOfUsers())).toBe(false);
  });
});
