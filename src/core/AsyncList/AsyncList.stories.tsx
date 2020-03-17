import React from 'react';
import { storiesOf } from '@storybook/react';
import { useAsync } from 'react-async';
import { Button, Card, ListGroup, ListGroupItem } from 'reactstrap';

import AsyncList from './AsyncList';

import { pageOfUsers } from '../../test/fixtures';
import { User } from '../../test/types';
import { ContentState } from '../..';
import { action } from '@storybook/addon-actions';

function loadData(): Promise<User[]> {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(pageOfUsers.content);
    }, 1000);
  });
}

function emptyData(): Promise<User[]> {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve([]);
    }, 1000);
  });
}

function rejectData(): Promise<User[]> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      reject('could not load');
    }, 1000);
  });
}

function loadingData(): Promise<User[]> {
  return new Promise(() => undefined);
}

storiesOf('core|Async/AsyncList', module)
  .addParameters({ component: AsyncList })
  .add('when loaded', () => {
    const state = useAsync(loadData);

    return (
      <Card body>
        <AsyncList state={state}>
          {users => (
            <ListGroup>
              {users.map(user => (
                <ListGroupItem key={user.id}>{user.email}</ListGroupItem>
              ))}
            </ListGroup>
          )}
        </AsyncList>
      </Card>
    );
  })

  .add('when error', () => {
    const state = useAsync(rejectData);

    return (
      <Card body>
        <AsyncList state={state}>
          {users => (
            <ListGroup>
              {users.map(user => (
                <ListGroupItem key={user.id}>{user.email}</ListGroupItem>
              ))}
            </ListGroup>
          )}
        </AsyncList>
      </Card>
    );
  })

  .add('when error with custom text', () => {
    const state = useAsync(rejectData);

    return (
      <Card body>
        <AsyncList
          state={state}
          text={{ error: 'I’m sorry Dave, I’m afraid I can’t do that' }}
        >
          {users => (
            <ListGroup>
              {users.map(user => (
                <ListGroupItem key={user.id}>{user.email}</ListGroupItem>
              ))}
            </ListGroup>
          )}
        </AsyncList>
      </Card>
    );
  })

  .add('when error with no retry button', () => {
    const state = useAsync(rejectData);

    return (
      <Card body>
        <AsyncList state={state} showRetryButton={false}>
          {users => (
            <ListGroup>
              {users.map(user => (
                <ListGroupItem key={user.id}>{user.email}</ListGroupItem>
              ))}
            </ListGroup>
          )}
        </AsyncList>
      </Card>
    );
  })

  .add('when loading', () => {
    const state = useAsync(loadingData);

    return (
      <Card body>
        <AsyncList state={state}>
          {users => (
            <ListGroup>
              {users.map(user => (
                <ListGroupItem key={user.id}>{user.email}</ListGroupItem>
              ))}
            </ListGroup>
          )}
        </AsyncList>
      </Card>
    );
  })

  .add('when loading with custom title', () => {
    const state = useAsync(loadingData);

    return (
      <Card body>
        <AsyncList state={state} text={{ loading: 'Loading Jeffrey' }}>
          {users => (
            <ListGroup>
              {users.map(user => (
                <ListGroupItem key={user.id}>{user.email}</ListGroupItem>
              ))}
            </ListGroup>
          )}
        </AsyncList>
      </Card>
    );
  })

  .add('when empty', () => {
    const state = useAsync(emptyData);

    return (
      <Card body>
        <AsyncList state={state}>
          {users => (
            <ListGroup>
              {users.map(user => (
                <ListGroupItem key={user.id}>{user.email}</ListGroupItem>
              ))}
            </ListGroup>
          )}
        </AsyncList>
      </Card>
    );
  })

  .add('when empty with custom title', () => {
    const state = useAsync(emptyData);

    return (
      <Card body>
        <AsyncList
          state={state}
          text={{ empty: "No Jeffrey's match your parameters try again" }}
        >
          {users => (
            <ListGroup>
              {users.map(user => (
                <ListGroupItem key={user.id}>{user.email}</ListGroupItem>
              ))}
            </ListGroup>
          )}
        </AsyncList>
      </Card>
    );
  })

  .add('when empty with custom empty', () => {
    const state = useAsync(emptyData);

    return (
      <Card body>
        <AsyncList
          state={state}
          emptyContent={() => (
            <ContentState mode="empty" title="No results found">
              <Button icon="refresh" onClick={action('clear filters')}>
                Clear filters
              </Button>
            </ContentState>
          )}
        >
          {users => (
            <ListGroup>
              {users.map(user => (
                <ListGroupItem key={user.id}>{user.email}</ListGroupItem>
              ))}
            </ListGroup>
          )}
        </AsyncList>
      </Card>
    );
  });
