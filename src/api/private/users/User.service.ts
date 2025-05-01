import { db } from 'db';
import { users } from 'db/schema/users';
import { and, eq, isNull } from 'drizzle-orm';
import { User, UserCreate } from './User.schema';
import { profiles } from 'db/schema/profiles';
import { UnauthorizedException } from '@/lib/exceptions/UnauthorizedException';
import { messages } from '@/lib/constants/messages';
import { LoginRequest } from '@/api/auth/Auth.schema';
import { NotFoundException } from '@/lib/exceptions/NotFoundException';
import { RoleEnum } from '@/lib/enums/RoleEnum';
import { userColumns } from './User.column';

export abstract class UserService {
  static async create(request: UserCreate): Promise<User> {
    const user = await db.transaction(async (transaction) => {
      const [user] = await transaction
        .insert(users)
        .values(request)
        .returning({
          id: users.id
        })

      if (request.profile) {
        await transaction
          .insert(profiles)
          .values({
            ...request.profile,
            userId: user.id
          })
      }

      return user
    })

    return {
      branchId: request.branchId,
      id: user.id,
      role: request.role,
      username: request.username,
    }
  }

  static async checkCredentials(loginRequest: LoginRequest): Promise<number> {
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.username, loginRequest.username))
      .limit(1)

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
    const [user] = await db
      .select({ id: users.id })
      .from(users)
      .where(and(
        eq(users.id, userId),
        eq(users.branchId, branchId)
      ))
      .limit(1)

    return user
  }

  static async check(id: number, loggedUser: User): Promise<User> {
    const conditions: ReturnType<typeof and>[] = [
      eq(users.id, id),
      isNull(users.deletedAt)
    ]

    if (loggedUser.role !== RoleEnum.SuperAdmin) {
      conditions.push(eq(users.branchId, loggedUser.branchId))
    }

    const [user] = await db
      .select(userColumns)
      .from(users)
      .where(and(
        ...conditions
      ))
      .limit(1)

    if (!user) {
      throw new NotFoundException(messages.errorConstraint('User'))
    }

    return user
  }
}