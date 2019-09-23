import { Page } from '@42.nl/spring-connect';
import { Meta } from '../form/types';
import { CurrentUser, UserRole, User } from './types';
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
    active: true,
    roles: [UserRole.ADMIN]
  }
}

const admin = {
  id: 42,
  email: 'admin@42.nl',
  active: true,
  roles: [UserRole.ADMIN]
};

export const adminUser = Object.freeze(admin);

const user = {
  id: 1337,
  email: 'user@42.nl',
  active: false,
  roles: [UserRole.USER]
};

export const userUser = Object.freeze(user);

const coordinator = {
  id: 1337,
  email: 'coordinator@42.nl',
  active: false,
  roles: [UserRole.ADMIN, UserRole.USER]
};

export const coordinatorUser = Object.freeze(coordinator);

export const pageOfUsers: Page<User> = Object.freeze({
  content: [adminUser, coordinatorUser, userUser],
  last: false,
  totalElements: 9,
  totalPages: 3,
  size: 3,
  number: 2,
  first: false,
  numberOfElements: 3
});

export const currentUserAdmin: CurrentUser = Object.freeze({
  id: 42,
  email: 'maarten@42.nl',
  active: true,
  roles: [UserRole.ADMIN],
  switched: false // Whether an ADMIN is impersonating the user.
});

export const currentUserSwitched: CurrentUser = Object.freeze({
  id: 42,
  email: 'sander@42.nl',
  active: true,
  roles: [UserRole.USER],
  switched: true // Whether an ADMIN is impersonating the user.
});

export const currentUserUser: CurrentUser = Object.freeze({
  id: 42,
  email: 'peter@42.nl',
  active: true,
  roles: [UserRole.USER],
  switched: false // Whether an ADMIN is impersonating the user.
});
