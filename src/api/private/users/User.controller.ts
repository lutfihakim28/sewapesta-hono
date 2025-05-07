import { honoApp } from '@/lib/utils/hono';
import { UserChangePasswordRoute, UserCreateRoute, UserDeleteRoute, UserDetailRoute, UserListRoute, UserUpdateRoute } from './User.route';
import { UserService } from './User.service';
import { ApiResponse, ApiResponseData, ApiResponseList } from '@/lib/dtos/ApiResponse.dto';
import { messages } from '@/lib/constants/messages';
import { Meta } from '@/lib/dtos/Meta.dto';
import { JwtPayload } from '@/lib/dtos/JwtPayload.dto';
import { RoleEnum } from '@/lib/enums/RoleEnum';
import { ForbiddenException } from '@/lib/exceptions/ForbiddenException';

const UserController = honoApp();

UserController.openapi(UserListRoute, async (context) => {
  const query = context.req.valid('query');
  const [users, totalData] = await UserService.list(query);

  return context.json(new ApiResponseList({
    code: 200,
    messages: [messages.successList('users')],
    meta: new Meta({
      page: query.page!,
      pageSize: query.pageSize!,
      total: totalData
    }),
    data: users
  }), 200)
})

UserController.openapi(UserDetailRoute, async (context) => {
  const param = context.req.valid('param')
  const user = await UserService.get(+param.id)

  return context.json(new ApiResponseData({
    code: 200,
    messages: [messages.successDetail('user')],
    data: user,
  }), 200)
})

UserController.openapi(UserCreateRoute, async (context) => {
  const payload = context.req.valid('json');
  const user = await UserService.create(payload);

  return context.json(new ApiResponseData({
    code: 200,
    messages: [messages.successCreate(`User with username ${user.username}`)],
    data: user,
  }), 200)
})

UserController.openapi(UserUpdateRoute, async (context) => {
  const param = context.req.valid('param');
  const payload = context.req.valid('json');
  const user = await UserService.update(+param.id, payload);

  return context.json(new ApiResponseData({
    code: 200,
    messages: [messages.successUpdate(`User with ID ${param.id}`)],
    data: user,
  }), 200)
})

UserController.openapi(UserDeleteRoute, async (context) => {
  const param = context.req.valid('param');
  await UserService.delete(+param.id);

  return context.json(new ApiResponse({
    code: 200,
    messages: [messages.successDelete(`User with ID ${param.id}`)]
  }))
})

UserController.openapi(UserChangePasswordRoute, async (context) => {
  const param = context.req.valid('param')
  const payload = context.req.valid('json')
  const jwt = new JwtPayload(context.get('jwtPayload'))

  if (+param.id !== jwt.user.id && jwt.user.role !== RoleEnum.SuperAdmin) {
    throw new ForbiddenException('The password for this user can only be changed by the Super Admin or the user themselves.')
  }

  const user = await UserService.changePassword(+param.id, payload, jwt.user);

  return context.json(new ApiResponseData({
    code: 200,
    messages: [`Change password successfully`],
    data: user,
  }), 200)
})

export default UserController;