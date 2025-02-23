import { UserSchema } from '@/schemas/users/UserSchema';
import { z } from 'zod';
import { validationMessages } from '@/lib/constants/validationMessage';
import { messages } from '@/lib/constants/messages';

export const LoginRequestSchema = z.object({
  username: z.string({
    message: validationMessages.required('Nama pengguna')
  }).openapi({
    example: 'superadmin',
  }),
  password: z
    .string({
      message: validationMessages.required('Password')
    })
    .min(8, validationMessages.minLength('Password', 8))
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
    .default([messages.successLogout])
    .openapi({
      example: [messages.successLogout]
    }),
}).openapi('LogoutResponse');

export type LoginRequest = z.infer<typeof LoginRequestSchema>