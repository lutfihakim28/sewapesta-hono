import { eq, getTableColumns } from 'drizzle-orm';
import { db } from 'db';
import { users } from 'db/schema/users';
import { LoginRequest } from '@/schemas/AuthSchema';

export abstract class UserService {
  static getByUsername(username: string) {
    const { password, ...rest } = getTableColumns(users);
    const user = db
      .select({ ...rest })
      .from(users)
      .where(eq(users.username, username))
      .get()

    return user;
  }

  static async checkCredentials(loginRequest: LoginRequest) {
    const user = db
      .select()
      .from(users)
      .where(eq(users.username, loginRequest.username))
      .get()

    if (!user) return;

    const isMatch = await Bun.password.verify(loginRequest.password, user.password);

    if (isMatch) return user;
  }
}