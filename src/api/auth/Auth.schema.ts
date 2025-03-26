import { UserSchema } from '@/api/private/users/User.schema';
import { messages } from '@/lib/constants/messages';
import { validationMessages } from '@/lib/constants/validation-message';
import { ApiResponseDataSchema } from '@/lib/schemas/ApiResponse.schema';
import { z } from '@hono/zod-openapi';

/**======================
 **      LOGIN
 *========================**/

export const LoginRequestSchema = z.object({
  username: z.string({
    required_error: validationMessages.required('Username'),
    invalid_type_error: validationMessages.string('Username')
  }).openapi({
    example: 'superadmin',
  }),
  password: z
    .string({
      required_error: validationMessages.required('Password'),
      invalid_type_error: validationMessages.string('Password')
    })
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
    invalid_type_error: validationMessages.number('User ID'),
    required_error: validationMessages.required('User ID'),
  }).openapi({
    example: 1,
  }),
})

export type RefreshRequest = z.infer<typeof RefreshRequestSchema>

/*==== END OF REFRESH ====*/

export const CheckUsernameSchema = z.object({
  username: z.string()
})

export type CheckUsername = z.infer<typeof CheckUsernameSchema>