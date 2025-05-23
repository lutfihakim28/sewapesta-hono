import { User } from '@/api/private/users/User.schema';
import { AppDate } from '../libs/AppDate';

export class JwtPayload {
  user!: User
  exp!: number
  iat!: number
  sub?: string
  [key: string]: unknown

  constructor(data: Partial<JwtPayload>, expiredIn?: number) {
    if (data.user) {
      this.user = data.user;
      this.sub = data.user.id.toString()
    }
    const today = new AppDate()
    this.iat = data.iat || today.unix() // must before exp, because of mutable today date after addition
    this.exp = data.exp || today.add(expiredIn || 3, 'seconds').unix()
  }
}