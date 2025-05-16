import { User } from '@/api/private/users/User.schema';
import dayjs from 'dayjs';

export class JwtPayload {
  user!: User
  exp!: number
  iat!: number
  [key: string]: unknown

  constructor(data: Partial<JwtPayload>) {
    if (data.user) {
      this.user = data.user;
    }
    this.exp = data.exp || dayjs().add(1, 'day').unix()
    this.iat = data.iat || dayjs().unix()
  }
}