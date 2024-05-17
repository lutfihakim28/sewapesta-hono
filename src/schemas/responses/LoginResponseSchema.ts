import { z } from 'zod';
import { UserResponseSchema } from './UserResponseSchema';

export const LoginResponseSchema = z.object({
  token: z.string(),
  user: UserResponseSchema
})