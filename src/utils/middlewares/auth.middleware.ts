import { createMiddleware } from 'hono/factory';
import { db } from 'db';
import { users } from 'db/schema/users';
import { eq } from 'drizzle-orm';
import { UnauthorizedException } from '../exceptions/UnauthorizedException';
import { messages } from '../constants/locales/messages';

export const authMiddleware = createMiddleware(async (context, next) => {
  const payload = context.get('jwtPayload')

  const [user] = await db.select().from(users).where(eq(users.id, payload.user.id))

  if (!user || !user.refreshToken) {
    throw new UnauthorizedException(messages.unauthorized)
  }

  if (user.deletedAt) {
    throw new UnauthorizedException('Your account has been deleted by admin.')
  }

  await next()
})