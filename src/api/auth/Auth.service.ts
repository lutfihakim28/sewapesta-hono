import { JwtPayload } from '@/utils/dtos/JwtPayload.dto';
import { db } from 'db';
import { users } from 'db/schema/users';
import { and, eq, isNull } from 'drizzle-orm';
import { decode, sign } from 'hono/jwt';
import { JWTPayload } from 'hono/utils/jwt/types';
import { LoginData } from './Auth.schema';
import { usersRoles } from 'db/schema/users-roles';
import { buildJsonGroupArray } from '@/utils/helpers/build-json-group-array';
import { NotFoundException } from '@/utils/exceptions/NotFoundException';
import { UserRoleSchema } from '../private/users/User.schema';
import { UnauthorizedException } from '@/utils/exceptions/UnauthorizedException';
import { AppDate } from '@/utils/libs/AppDate';
import { pinoLogger } from '@/utils/helpers/logger';
import { messages } from '@/utils/constants/messages';

const accessTokenSecret = Bun.env.ACCESS_TOKEN_SECRET;
const refreshTokenSecret = Bun.env.REFRESH_TOKEN_SECRET;
export abstract class AuthService {
  static async login(userId: number): Promise<[LoginData, string]> {

    const [_user] = await db.select({
      id: users.id,
      username: users.username,
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

    const refreshPayload = new JwtPayload({ user }, 60 * 60 * 24 * 7); // exp in 7 days
    const refreshToken = await sign(refreshPayload, refreshTokenSecret)

    await db
      .update(users)
      .set({ refreshToken })
      .where(eq(users.id, userId))

    const payload: JWTPayload = new JwtPayload({ user })
    const token = await sign(payload, accessTokenSecret)

    return [{
      token,
    }, refreshToken]
  }

  static async refresh(refreshToken: string): Promise<[LoginData, string] | false> {
    const jwt = decode(refreshToken);
    const jwtPayload = new JwtPayload(jwt.payload)

    // If refresh token expired
    if (jwtPayload.exp < new AppDate().unix()) {
      await db.update(users).set({ refreshToken: null }).where(eq(users.id, jwtPayload.user.id))
      throw new UnauthorizedException('Your refresh token is expired. Please login again.');
    }

    const [user] = await db.select({
      id: users.id,
      username: users.username,
      roles: buildJsonGroupArray([usersRoles.role], true),
    }).from(users)
      .innerJoin(usersRoles, eq(usersRoles.userId, users.id))
      .where(and(
        isNull(users.deletedAt),
        eq(users.refreshToken, refreshToken)
      ))

    pinoLogger.debug(user, 'USER')

    if (!user || !user.id) {
      throw new UnauthorizedException(messages.unauthorized);
    }

    const payload: JWTPayload = new JwtPayload({
      user: {
        id: user.id,
        username: user.username,
        roles: (JSON.parse(user.roles) as unknown[]).map((role) => UserRoleSchema.parse(role))
      }
    });

    const refreshPayload: JWTPayload = new JwtPayload({
      user: {
        id: user.id,
        username: user.username,
        roles: (JSON.parse(user.roles) as unknown[]).map((role) => UserRoleSchema.parse(role))
      }
    }, 60 * 60 * 24 * 7);
    const newRefreshToken = await sign(refreshPayload, refreshTokenSecret)

    const [token, _] = await Promise.all([
      sign(payload, accessTokenSecret),
      db
        .update(users)
        .set({ refreshToken: newRefreshToken })
        .where(eq(users.id, user.id))
    ])

    return [{
      token,
    }, newRefreshToken]
  }

  static async logout(jwtPayload: JwtPayload) {
    await db.update(users).set({ refreshToken: null }).where(eq(users.id, jwtPayload.user.id))
  }
}