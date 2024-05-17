import { z } from 'zod';

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
}).openapi('Login')