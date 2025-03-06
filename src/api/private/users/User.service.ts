import { db } from 'db';
import { users } from 'db/schema/users';
import { and, eq, getTableColumns } from 'drizzle-orm';
import { User, UserCreate } from './User.schema';
import { profiles } from 'db/schema/profiles';
import { UnauthorizedException } from '@/lib/exceptions/UnauthorizedException';
import { messages } from '@/lib/constants/messages';
import { LoginRequest } from '@/api/auth/Auth.schema';

const { createdAt, deletedAt, password, profileId, refreshToken, updatedAt, ...columns } = getTableColumns(users)

export abstract class UserService {
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
        })
        .returning()

      return user
    })

    return user
  }

  static async checkCredentials(loginRequest: LoginRequest): Promise<number> {
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

    return user.id
  }

  static async isInBranch(branchId: number, userId: number) {
    return db
      .select({ id: users.id })
      .from(users)
      .where(and(
        eq(users.id, userId),
        eq(users.branchId, branchId)
      ))
      .get()
  }
}