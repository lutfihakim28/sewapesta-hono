import { User } from '@/api/private/users/User.schema';
import { AppDate } from '../libs/AppDate';

export class JwtPayload {
  user!: User
  exp!: number
  iat!: number
  [key: string]: unknown

  constructor(data: Partial<JwtPayload>) {
    if (data.user) {
      this.user = data.user;
    }
    this.exp = data.exp || new AppDate().add(1, 'day').unix
    this.iat = data.iat || new AppDate().unix
  }
}