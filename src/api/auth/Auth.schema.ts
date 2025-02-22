import { UserSchema } from '@/api/private/users/User.schema';
import { messages } from '@/lib/constants/messages';
import { validationMessages } from '@/lib/constants/validationMessage';
import { ApiResponseDataSchema } from '@/lib/schemas/ApiResponse.schema';
import { z } from 'zod';

/**======================
 **      LOGIN
 *========================**/

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
export const LoginDataSchema = z.object({
  token: z
    .string()
    .openapi({
      example: 'eyJH*************',
    }),
  user: UserSchema
})
export const LoginResponseSchema = ApiResponseDataSchema(LoginDataSchema, messages.successLogin).openapi('LoginResponse');

export type LoginRequest = z.infer<typeof LoginRequestSchema>
export type LoginData = z.infer<typeof LoginDataSchema>

/*==== END OF LOGIN ====*/

/**======================
 **      REFRESH
 *========================**/

export const RefreshRequestSchema = z.object({
  userId: z.number({
    message: validationMessages.requiredNumber('User ID')
  }).openapi({
    example: 1,
  }),
})

export type RefreshRequest = z.infer<typeof RefreshRequestSchema>

/*==== END OF REFRESH ====*/