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
    const today = new AppDate()
    this.iat = data.iat || today.unix() // must before exp, because of mutable today date after addition
    this.exp = data.exp || today.add(1, 'day').unix()
  }
}