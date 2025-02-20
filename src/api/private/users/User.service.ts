import { LoginRequest } from '@/api/auth/login/Login.schema';
import { db } from 'db';
import { users } from 'db/schema/users';
import { eq } from 'drizzle-orm';
import { User } from './User.schema';

export class UserService {
  static async checkCredentials(loginRequest: LoginRequest): Promise<User | undefined> {
    const user = db
      .select()
      .from(users)
      .where(eq(users.username, loginRequest.username))
      .get()

    if (!user) return;

    const isMatch = await Bun.password.verify(loginRequest.password, user.password);

    if (isMatch) return {
      id: user.id,
      role: user.role,
      username: user.username
    };
  }
}