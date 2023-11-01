import type { UserAuthScope } from '../src/modules/user/user.constant';

export type UserDTO = {
  id: string;
  name: string;
  email: string;
  scopes: UserAuthScope[];
  createdAt: Date;
  updatedAt: Date;
};
