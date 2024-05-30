import { z } from 'zod';
import { UserResponseSchema } from './UserSchema';
import { validationMessages } from '@/constatnts/validationMessages';
import { messages } from '@/constatnts/messages';

export const LoginRequestSchema = z.object({
  username: z.string({
    message: validationMessages.required('Nama pengguna')
  }).openapi({
    example: 'superadmin',
  }),
  password: z.string({
    message: validationMessages.required('Kata sandi')
  }).min(8, validationMessages.minLength('Kata sandi', 8)).openapi({
    example: 'password',
  }),
}).openapi('Login');

export const LoginResponseSchema = z.object({
  token: z.string(),
  user: UserResponseSchema
});

export const LogoutResponseSchema = z.object({
  messages: z.string().array().default([messages.successLogout]).openapi({
    example: [messages.successLogout]
  }),
});

export type LoginRequest = z.infer<typeof LoginRequestSchema>