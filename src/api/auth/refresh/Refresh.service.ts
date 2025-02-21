import { messages } from '@/lib/constants/messages';
import { JwtPayload } from '@/lib/dtos/JwtPayload.dto';
import { UnauthorizedException } from '@/lib/exceptions/UnauthorizedException';
import { db } from 'db';
import { users } from 'db/schema/users';
import { eq } from 'drizzle-orm';
import { sign } from 'hono/jwt';
import { JWTPayload } from 'hono/utils/jwt/types';
import { LoginData } from '../login/Login.schema';
import { RefreshRequest } from './Refresh.schema';

export class RefreshService {
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
}