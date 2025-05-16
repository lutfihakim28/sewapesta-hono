import { honoApp } from '@/utils/helpers/hono';
import { UserChangePasswordRoute, UserCreateRoute, UserDeleteRoute, UserDetailRoute, UserListRoute, UserRoleUpdateRoute, UserUpdateRoute } from './User.route';
import { UserService } from './User.service';
import { ApiResponse, ApiResponseData, ApiResponseList } from '@/utils/dtos/ApiResponse.dto';
import { messages } from '@/utils/constants/messages';
import { Meta } from '@/utils/dtos/Meta.dto';
import { JwtPayload } from '@/utils/dtos/JwtPayload.dto';
import { RoleEnum } from '@/utils/enums/RoleEnum';
import { ForbiddenException } from '@/utils/exceptions/ForbiddenException';
import { BadRequestException } from '@/utils/exceptions/BadRequestException';

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
  const user = await UserService.updateProfile(+param.id, payload);

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

  if (+param.id !== jwt.user.id && !jwt.user.roles.includes(RoleEnum.SuperAdmin)) {
    throw new ForbiddenException('The password for this user can only be changed by the Super Admin or the user themselves.')
  }

  const user = await UserService.changePassword(+param.id, payload, jwt.user);

  return context.json(new ApiResponseData({
    code: 200,
    messages: [`Change password successfully`],
    data: user,
  }), 200)
})

UserController.openapi(UserRoleUpdateRoute, async (context) => {
  const param = context.req.valid('param')
  const payload = context.req.valid('json')
  const jwt = new JwtPayload(context.get('jwtPayload'));

  if (+param.id === jwt.user.id && !jwt.user.roles.includes(RoleEnum.SuperAdmin)) {
    throw new BadRequestException('Can not self assign.')
  }

  await UserService.changeRole(+param.id, payload);

  return context.json(new ApiResponse({
    code: 200,
    messages: [`User with ID ${param.id} successfully ${payload.assigned ? 'assigned' : 'unassigned'} as ${payload.role}`],
  }), 200)
})

export default UserController;