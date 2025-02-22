import { db } from 'db';
import { users } from 'db/schema/users';
import { eq } from 'drizzle-orm';
import { User, UserCreate } from './User.schema';
import { profiles } from 'db/schema/profiles';
import dayjs from 'dayjs';
import { UnauthorizedException } from '@/lib/exceptions/UnauthorizedException';
import { messages } from '@/lib/constants/messages';
import { BadRequestException } from '@/lib/exceptions/BadRequestException';
import { LoginRequest } from '@/api/auth/Auth.schema';

export class UserService {
  static async create(request: UserCreate): Promise<User> {
    const user = await db.transaction(async (tx) => {
      const [profile] = await tx
        .insert(profiles)
        .values(request.profile)
        .returning({
          id: profiles.id
        })

      const [user] = await tx
        .insert(users)
        .values({
          ...request,
          profileId: profile.id,
          confirmedAt: dayjs().unix()
        })
        .returning()

      return user
    })

    return user
  }

  static async checkCredentials(loginRequest: LoginRequest): Promise<User> {
    const user = db
      .select()
      .from(users)
      .where(eq(users.username, loginRequest.username))
      .get()

    if (!user) {
      throw new UnauthorizedException(messages.invalidCredential)
    }

    const isMatch = await Bun.password.verify(loginRequest.password, user.password);

    if (!isMatch) {
      throw new UnauthorizedException(messages.invalidCredential)
    }

    if (!user.confirmedAt) {
      throw new BadRequestException('Your account is not active.')
    }

    return user
  }
}