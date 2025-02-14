import { z } from 'zod';
import { UserSchema } from './UserSchema';
import { validationMessages } from '@/constants/ValidationMessage';
import { messages } from '@/constants/Message';

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
  user: UserSchema
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