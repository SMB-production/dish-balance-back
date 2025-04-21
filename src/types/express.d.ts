import { User } from '../modules/user/user.model';

declare module 'express' {
  interface Request {
    user?: User;
  }
}
