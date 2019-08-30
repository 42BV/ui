export type User = {
  id: number;
  email: string;
  active: boolean;
  roles: UserRole[];
};

export enum UserRole {
  ADMIN = 'ADMIN',
  USER = 'USER'
}

/*
    Represents a user which is currently logged-in.
  */
export interface CurrentUser {
  id: number;
  email: string;
  active: boolean;
  roles: UserRole[];
  switched: boolean; // Whether an ADMIN is impersonating the user.
}
