import React from 'react';
import { render } from '@testing-library/react';

import { AsyncList, isEmpty } from './AsyncList';

import { User } from '../../test/types';
import { pageOfUsers } from '../../test/fixtures';

type State = {
  isLoading: boolean;
  isError: boolean;
  data: User[];
};

describe('Component: Async|AsyncList', () => {
  function setup({ state }: { state: State }) {
    const { container } = render(
      <AsyncList
        // @ts-expect-error Test mock
        state={state}
        showRetryButton={true}
        text={{ loading: 'Custom loading' }}
      >
        {(users) => (
          <ul>
            {users.map((user) => (
              <li key={user.id}>{user.email}</li>
            ))}
          </ul>
        )}
      </AsyncList>
    );

    return { container };
  }

  test('ui', () => {
    const state = {
      isLoading: false,
      isError: false,
      data: pageOfUsers().content
    };

    const { container } = setup({ state });

    expect(container).toMatchSnapshot();
  });
});

describe('isEmpty', () => {
  it('should consider it empty when the totalElements is zero', () => {
    expect(isEmpty([])).toBe(true);
  });

  it('should consider it empty when the totalElements is zero', () => {
    expect(isEmpty(pageOfUsers().content)).toBe(false);
  });
});
