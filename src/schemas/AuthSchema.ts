import { UserSchema } from '@/schemas/users/UserSchema';
import { z } from 'zod';
import { validationMessages } from '@/lib/constants/validationMessage';
import { MESSAGES } from '@/lib/constants/MESSAGES';

export const LoginRequestSchema = z.object({
  username: z.string({
    message: validationMessages.required('Nama pengguna')
  }).openapi({
    example: 'superadmin',
  }),
  password: z
    .string({
      message: validationMessages.required('Kata sandi')
    })
    .min(8, validationMessages.minLength('Kata sandi', 8))
    .openapi({
      example: 'password',
    }),
}).openapi('Login');

export const LoginResponseSchema = z.object({
  token: z
    .string()
    .openapi({
      example: 'eyJH*************',
    }),
  user: UserSchema.pick({
    username: true,
    id: true,
  })
}).openapi('LoginResponse');

export const LogoutResponseSchema = z.object({
  messages: z
    .string()
    .array()
    .default([MESSAGES.successLogout])
    .openapi({
      example: [MESSAGES.successLogout]
    }),
}).openapi('LogoutResponse');

export type LoginRequest = z.infer<typeof LoginRequestSchema>