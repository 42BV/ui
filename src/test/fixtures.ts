import { Page } from '@42.nl/spring-connect';
import { Meta } from '../form/types';
import { User } from './types';
import { random } from 'lodash';

export const validMeta: Meta = Object.freeze({
  blur: () => undefined,
  change: () => undefined,
  focus: () => undefined,
  name: '',
  error: '',
  invalid: false,
  valid: true
});

export function randomUser(): User {
  const id = random(1, 1000000);

  return {
    id,
    email: `user-${id}@42.nl`,
    firstName: `user-${id}`,
    lastName: 'random',
    active: true,
    roles: ['ADMIN']
  };
}

export function adminUser(): User {
  return {
    id: 42,
    email: 'admin@42.nl',
    firstName: 'admin',
    lastName: 'user',
    active: true,
    roles: ['ADMIN']
  };
}

export function userUser(): User {
  return {
    id: 1337,
    email: 'user@42.nl',
    firstName: 'test',
    lastName: 'user',
    active: false,
    roles: ['USER']
  };
}

export function coordinatorUser(): User {
  return {
    id: 777,
    email: 'coordinator@42.nl',
    firstName: 'coordinator',
    lastName: 'user',
    active: false,
    roles: ['ADMIN', 'USER']
  };
}

export function nobodyUser(): User {
  return {
    id: 999,
    email: 'nobody@42.nl',
    firstName: 'no',
    lastName: 'body',
    active: false,
    roles: []
  };
}

export function pageOfUsers(): Page<User> {
  return {
    content: [adminUser(), coordinatorUser(), userUser()],
    last: false,
    totalElements: 9,
    totalPages: 3,
    size: 3,
    number: 2,
    first: false,
    numberOfElements: 3
  };
}
