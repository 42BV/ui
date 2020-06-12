export type User = {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  active: boolean;
  roles: UserRole[];
};

export enum UserRole {
  ADMIN = 'ADMIN',
  USER = 'USER'
}
