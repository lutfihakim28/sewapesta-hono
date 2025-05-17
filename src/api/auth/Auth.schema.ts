import { UserSchema } from '@/api/private/users/User.schema';
import { messages } from '@/utils/constants/messages';
import { validationMessages } from '@/utils/constants/validation-message';
import { ApiResponseDataSchema } from '@/utils/schemas/ApiResponse.schema';
import { NumberSchema } from '@/utils/schemas/Number.schema';
import { ObjectSchema } from '@/utils/schemas/Object.schema';
import { StringSchema } from '@/utils/schemas/String.schema';
import { SchemaType } from '@/utils/types/Schema.type';

/**======================
 **      LOGIN
 *========================**/

export const LoginRequestSchema = new ObjectSchema({
  username: new StringSchema('Username').getSchema().openapi({
    example: 'superadmin',
  }),
  password: new StringSchema('Password')
    .getSchema()
    .openapi({
      example: 'password',
    }),
}).getSchema().openapi('Login');

export const LoginDataSchema = new ObjectSchema({
  token: new StringSchema('Token')
    .getSchema()
    .openapi({
      example: 'eyJH*************',
    }),
  user: UserSchema
}).getSchema()

export const LoginResponseSchema = ApiResponseDataSchema(LoginDataSchema, messages.successLogin).openapi('LoginResponse');

export type LoginRequest = SchemaType<typeof LoginRequestSchema>
export type LoginData = SchemaType<typeof LoginDataSchema>

/*==== END OF LOGIN ====*/

/**======================
 **      REFRESH
 *========================**/

export const RefreshRequestSchema = new ObjectSchema({
  userId: new NumberSchema('User ID').natural().getSchema().openapi({
    example: 1,
  }),
}).getSchema()

export type RefreshRequest = SchemaType<typeof RefreshRequestSchema>

/*==== END OF REFRESH ====*/

export const CheckUsernameSchema = new ObjectSchema({
  username: new StringSchema('Username').getSchema()
}).getSchema()

export type CheckUsername = SchemaType<typeof CheckUsernameSchema>