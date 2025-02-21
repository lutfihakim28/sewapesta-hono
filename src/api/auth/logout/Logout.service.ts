import { JwtPayload } from '@/lib/dtos/JwtPayload.dto';
import { db } from 'db';
import { users } from 'db/schema/users';
import { eq } from 'drizzle-orm';

export class LogoutService {
  static async logout(jwtPayload: JwtPayload) {
    await db.update(users).set({ refreshToken: null }).where(eq(users.id, jwtPayload.user.id))
  }
}