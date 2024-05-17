import { eq } from 'drizzle-orm';
import { db } from '../../db';
import { users } from '../../db/schema/users';

export abstract class UserService {
  static getByUsername(username: string) {
    const user = db
      .select()
      .from(users)
      .where(eq(users.username, username))
      .get()

    return user;
  }

  static async checkCredentials(username: string, password: string) {
    const user = await db
      .select()
      .from(users)
      .where(eq(users.username, username))
      .get()

    if (!user) return;

    const isMatch = await Bun.password.verify(password, user.password);

    if (isMatch) return user;
  }
}