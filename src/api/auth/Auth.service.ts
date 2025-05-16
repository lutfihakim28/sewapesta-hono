import { JwtPayload } from '@/utils/dtos/JwtPayload.dto';
import { db } from 'db';
import { users } from 'db/schema/users';
import { and, eq, isNotNull, isNull } from 'drizzle-orm';
import { sign } from 'hono/jwt';
import { JWTPayload } from 'hono/utils/jwt/types';
import { messages } from '@/utils/constants/messages';
import { UnauthorizedException } from '@/utils/exceptions/UnauthorizedException';
import { LoginData, RefreshRequest } from './Auth.schema';
import { UserService } from '../private/users/User.service';
import { userColumns } from '../private/users/User.column';
import { usersRoles } from 'db/schema/users-roles';
import { buildJsonGroupArray } from '@/utils/helpers/build-json-group-array';
import { NotFoundException } from '@/utils/exceptions/NotFoundException';
import { UserRoleSchema } from '../private/users/User.schema';

export abstract class AuthService {
  static async login(userId: number): Promise<LoginData> {
    const secretKey = Bun.env.JWT_SECRET;

    const [_user] = await db.select({
      ...userColumns,
      roles: buildJsonGroupArray([usersRoles.role], true),
    })
      .from(users)
      .innerJoin(usersRoles, eq(usersRoles.userId, users.id))
      .where(and(
        isNull(users.deletedAt),
        eq(users.id, userId)
      ))
      .limit(1)

    if (!_user) {
      throw new NotFoundException('User not found');
    }

    const user = {
      ..._user,
      roles: (JSON.parse(_user.roles) as unknown[]).map((role) => UserRoleSchema.parse(role))
    }


    await db
      .update(users)
      .set({ refreshToken: crypto.randomUUID() })
      .where(eq(users.id, userId))

    const payload: JWTPayload = new JwtPayload({ user })
    const token = await sign(payload, secretKey)

    return {
      token,
      user
    }
  }

  static async refresh(request: RefreshRequest): Promise<LoginData> {
    const user = await UserService.get(request.userId, [isNotNull(users.refreshToken)])

    if (!user) {
      throw new UnauthorizedException(messages.unauthorized)
    }

    const payload: JWTPayload = new JwtPayload({ user });

    const secretKey = Bun.env.JWT_SECRET;

    const [token, _] = await Promise.all([
      sign(payload, secretKey),
      db
        .update(users)
        .set({ refreshToken: crypto.randomUUID() })
        .where(eq(users.id, user.id))
    ])

    const _user = await UserService.get(user.id)

    return {
      token,
      user: _user
    }
  }

  static async logout(jwtPayload: JwtPayload) {
    await db.update(users).set({ refreshToken: null }).where(eq(users.id, jwtPayload.user.id))
  }
}