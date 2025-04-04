import { JwtPayload } from '@/lib/dtos/JwtPayload.dto';
import { db } from 'db';
import { users } from 'db/schema/users';
import { and, eq, getTableColumns, isNotNull } from 'drizzle-orm';
import { sign } from 'hono/jwt';
import { JWTPayload } from 'hono/utils/jwt/types';
import { messages } from '@/lib/constants/messages';
import { UnauthorizedException } from '@/lib/exceptions/UnauthorizedException';
import { LoginData, RefreshRequest } from './Auth.schema';
import { logger } from '@/lib/utils/logger';
import dayjs from 'dayjs';

const { createdAt, deletedAt, password, refreshToken, updatedAt, ...columns } = getTableColumns(users)

export abstract class AuthService {
  static async login(userId: number): Promise<LoginData> {
    const secretKey = Bun.env.JWT_SECRET;

    const [_user] = await db
      .select(columns)
      .from(users)
      .where(eq(users.id, userId))
      .limit(1)

    await db
      .update(users)
      .set({ refreshToken: crypto.randomUUID() })
      .where(eq(users.id, userId))

    const payload: JWTPayload = new JwtPayload({ user: _user })
    const token = await sign(payload, secretKey)

    return {
      token,
      user: _user
    }
  }

  static async refresh(request: RefreshRequest): Promise<LoginData> {
    const [user] = await db
      .select()
      .from(users)
      .where(and(
        eq(users.id, request.userId),
        isNotNull(users.refreshToken)
      ))

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

    const [_user] = await db
      .select(columns)
      .from(users)
      .where(eq(users.id, user.id))
      .limit(1)

    return {
      token,
      user: _user
    }
  }

  static async logout(jwtPayload: JwtPayload) {
    await db.update(users).set({ refreshToken: null }).where(eq(users.id, jwtPayload.user.id))
  }
}