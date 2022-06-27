import React from 'react';
import { render } from '@testing-library/react';

import { AsyncPage, isEmpty } from './AsyncPage';

import { emptyPage, Page } from '@42.nl/spring-connect';
import { User } from '../../test/types';
import { pageOfUsers } from '../../test/fixtures';

type State = {
  isLoading: boolean;
  isError: boolean;
  data: Page<User>;
};

describe('Component: AsyncPage', () => {
  function setup({ state }: { state: State }) {
    const { container } = render(
      <AsyncPage
        // @ts-expect-error Test mock
        state={state}
        showRetryButton={true}
        text={{ loading: 'Custom loading' }}
      >
        {(data) => (
          <ul>
            {data.content.map((user) => (
              <li key={user.id}>{user.email}</li>
            ))}
          </ul>
        )}
      </AsyncPage>
    );

    return { container };
  }

  test('ui', () => {
    const state = {
      isLoading: false,
      isError: false,
      data: pageOfUsers()
    };

    const { container } = setup({ state });

    expect(container).toMatchSnapshot();
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
