import type { UserAuthScope } from '../modules/user/user.constant';

export type UserDTO = {
  id: string;
  name: string;
  email: string;
  scopes: UserAuthScope[];
  createdAt: Date;
  updatedAt: Date;
};
