import { JwtPayload } from '@/lib/dtos/JwtPayload.dto';
import { db } from 'db';
import { users } from 'db/schema/users';
import { eq } from 'drizzle-orm';
import { sign } from 'hono/jwt';
import { JWTPayload } from 'hono/utils/jwt/types';
import { User, UserCreate } from '../private/users/User.schema';
import { profiles } from 'db/schema/profiles';
import { messages } from '@/lib/constants/messages';
import { UnauthorizedException } from '@/lib/exceptions/UnauthorizedException';
import { CheckUsername, LoginData, RefreshRequest } from './Auth.schema';

export class AuthService {
  static async register(request: UserCreate) {
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
          password: await Bun.password.hash(request.password),
          profileId: profile.id,
        })
        .returning()

      return user
    })

    return user
  }

  static async login(user: User): Promise<LoginData> {
    const payload: JWTPayload = new JwtPayload(user);

    const secretKey = Bun.env.JWT_SECRET;

    const [token, [_user]] = await Promise.all([
      sign(payload, secretKey),
      db
        .update(users)
        .set({ refreshToken: crypto.randomUUID() })
        .where(eq(users.id, user.id))
        .returning({
          id: users.id,
          username: users.username,
          role: users.role,
        })
    ])

    return {
      token,
      user: _user
    }
  }

  static async refresh(request: RefreshRequest): Promise<LoginData> {
    const [user] = await db.select().from(users).where(eq(users.id, request.userId))

    if (!user) {
      throw new UnauthorizedException(messages.unauthorized)
    }

    const payload: JWTPayload = new JwtPayload(user);

    const secretKey = Bun.env.JWT_SECRET;

    const [token, [_user]] = await Promise.all([
      sign(payload, secretKey),
      db
        .update(users)
        .set({ refreshToken: crypto.randomUUID() })
        .where(eq(users.id, user.id))
        .returning({
          id: users.id,
          username: users.username,
          role: users.role,
        })
    ])

    return {
      token,
      user: _user
    }
  }

  static async logout(jwtPayload: JwtPayload) {
    await db.update(users).set({ refreshToken: null }).where(eq(users.id, jwtPayload.user.id))
  }

  static async checkUsername(request: CheckUsername) {
    const user = db
      .select({ id: users.id })
      .from(users)
      .where(eq(users.username, request.username))
      .get()

    return user
  }
}