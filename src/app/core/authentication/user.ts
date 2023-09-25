import { MyUser } from './interface';

export const admin: MyUser = {
  id: 1,
  name: 'Zongbin',
  email: 'nzb329@163.com',
  avatar: './assets/images/avatar.jpg',
};

export const guest: MyUser = {
  name: 'unknown',
  email: 'unknown',
  avatar: './assets/images/avatar-default.jpg',
};
