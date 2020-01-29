import React from 'react';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';

import AsyncList, { isEmpty } from './AsyncList';

import { User } from '../../../test/types';
import { pageOfUsers } from '../../../test/fixtures';

type State = {
  isLoading: boolean;
  isFulfilled: boolean;
  data: User[];
};

describe('Component: Async|AsyncList', () => {
  function setup({ state }: { state: State }) {
    const asyncList = shallow(
      <AsyncList
        // @ts-ignore
        state={state}
        showRetryButton={true}
        text={{ loading: 'Custom loading' }}
      >
        {users => (
          <ul>
            {users.map(user => (
              <li key={user.id}>{user.email}</li>
            ))}
          </ul>
        )}
      </AsyncList>
    );

    return { asyncList };
  }

  test('ui', () => {
    const state = {
      isLoading: false,
      isFulfilled: true,
      data: pageOfUsers.content
    };

    const { asyncList } = setup({ state });

    expect(toJson(asyncList)).toMatchSnapshot();
  });
});

describe('isEmpty', () => {
  it('should consider it empty when the totalElements is zero', () => {
    expect(isEmpty([])).toBe(true);
  });

  it('should consider it empty when the totalElements is zero', () => {
    expect(isEmpty(pageOfUsers.content)).toBe(false);
  });
});
