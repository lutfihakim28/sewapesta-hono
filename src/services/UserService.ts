import { eq, getTableColumns } from 'drizzle-orm';
import { db } from '@/db';
import { usersTable } from '@/db/schema/users';
import { LoginRequest } from '@/schemas/AuthSchema';

export abstract class UserService {
  static getByUsername(username: string) {
    const { password, ...rest } = getTableColumns(usersTable);
    const user = db
      .select({ ...rest })
      .from(usersTable)
      .where(eq(usersTable.username, username))
      .get()

    return user;
  }

  static async checkCredentials(loginRequest: LoginRequest) {
    const user = db
      .select()
      .from(usersTable)
      .where(eq(usersTable.username, loginRequest.username))
      .get()

    if (!user) return;

    const isMatch = await Bun.password.verify(loginRequest.password, user.password);

    if (isMatch) return user;
  }
}