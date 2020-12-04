export type User = {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  active: boolean;
  roles: UserRole[];
};

export type UserRole = 'ADMIN' | 'USER';
