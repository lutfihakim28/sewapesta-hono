import { z } from 'zod';
import { UserResponseSchema } from './UserSchema';

export const LoginRequestSchema = z.object({
  username: z.string({
    message: 'Username harus diisi.',
  }).openapi({
    example: 'superadmin',
  }),
  password: z.string({
    message: 'Password harus diisi.'
  }).min(8, 'Password minimal 8 karakter.').openapi({
    example: 'password',
  }),
}).openapi('Login');

export const LoginResponseSchema = z.object({
  token: z.string(),
  user: UserResponseSchema
});

export const LogoutResponseSchema = z.object({
  messages: z.string().array().default(['Berhasil keluar']).openapi({
    example: ['Berhasil keluar']
  }),
});

export type LoginRequest = z.infer<typeof LoginRequestSchema>