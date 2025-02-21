import { User } from '@/api/private/users/User.schema';
import dayjs from 'dayjs';

export class JwtPayload {
  user!: User
  exp!: number
  iat!: number
  [key: string]: unknown

  constructor(user: User) {
    this.user = user;
    this.exp = dayjs().add(1, 'day').unix()
    this.iat = dayjs().unix()
  }
}