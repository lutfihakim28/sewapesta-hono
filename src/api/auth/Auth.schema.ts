import { UserSchema } from '@/api/private/users/User.schema';
import { messages } from '@/utils/constants/messages';
import { validationMessages } from '@/utils/constants/validation-message';
import { ApiResponseDataSchema } from '@/utils/schemas/ApiResponse.schema';
import { NumberSchema } from '@/utils/schemas/Number.schema';
import { StringSchema } from '@/utils/schemas/String.schema';
import { z } from '@hono/zod-openapi';

/**======================
 **      LOGIN
 *========================**/

export const LoginRequestSchema = z.object({
  username: new StringSchema('Username').getSchema().openapi({
    example: 'superadmin',
  }),
  password: new StringSchema('Password')
    .getSchema()
    .openapi({
      example: 'password',
    }),
}).openapi('Login');
export const LoginDataSchema = z.object({
  token: new StringSchema('Token')
    .getSchema()
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
  userId: new NumberSchema('User ID').natural().getSchema().openapi({
    example: 1,
  }),
})

export type RefreshRequest = z.infer<typeof RefreshRequestSchema>

/*==== END OF REFRESH ====*/

export const CheckUsernameSchema = z.object({
  username: new StringSchema('Username').getSchema()
})

export type CheckUsername = z.infer<typeof CheckUsernameSchema>