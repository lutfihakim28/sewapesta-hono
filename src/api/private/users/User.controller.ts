import { honoApp } from '@/utils/helpers/hono';
import { UserChangePasswordRoute, UserCreateRoute, UserDeleteRoute, UserDetailRoute, UserListRoute, UserRoleUpdateRoute, UserUpdateRoute } from './User.route';
import { UserService } from './User.service';
import { ApiResponse, ApiResponseData, ApiResponseList } from '@/utils/dtos/ApiResponse.dto';
import { Meta } from '@/utils/dtos/Meta.dto';
import { JwtPayload } from '@/utils/dtos/JwtPayload.dto';
import { RoleEnum } from '@/utils/enums/RoleEnum';
import { ForbiddenException } from '@/utils/exceptions/ForbiddenException';
import { AcceptedLocale, tData, tMessage } from '@/utils/constants/locales/locale';

const UserController = honoApp();

UserController.openapi(UserListRoute, async (context) => {
  const lang = context.get('language') as AcceptedLocale;
  const query = context.req.valid('query');
  const [users, totalData] = await UserService.list(query);

  return context.json(new ApiResponseList({
    code: 200,
    messages: [
      tMessage({
        lang,
        key: 'successList',
        textCase: 'sentence',
        params: {
          data: tData({
            lang,
            key: 'user',
            mode: 'plural'
          })
        }
      })
    ],
    meta: new Meta({
      page: query.page!,
      pageSize: query.pageSize!,
      total: totalData
    }),
    data: users
  }), 200)
})

UserController.openapi(UserDetailRoute, async (context) => {
  const lang = context.get('language') as AcceptedLocale;
  const param = context.req.valid('param')
  const user = await UserService.get(+param.id)

  return context.json(new ApiResponseData({
    code: 200,
    messages: [
      tMessage({
        lang,
        key: 'successDetail',
        textCase: 'sentence',
        params: {
          data: tData({
            lang,
            key: 'user',
          })
        }
      })
    ],
    data: user,
  }), 200)
})

UserController.openapi(UserCreateRoute, async (context) => {
  const lang = context.get('language') as AcceptedLocale;
  const payload = context.req.valid('json');
  const user = await UserService.create(payload);

  return context.json(new ApiResponseData({
    code: 200,
    messages: [
      tMessage({
        lang,
        key: 'successCreate',
        textCase: 'sentence',
        params: {
          data: tData({
            lang,
            key: 'withUsername',
            params: {
              data: tData({
                lang,
                key: 'user',
              }),
              value: payload.username
            }
          })
        }
      })
    ],
    data: user,
  }), 200)
})

UserController.openapi(UserUpdateRoute, async (context) => {
  const lang = context.get('language') as AcceptedLocale;
  const param = context.req.valid('param');
  const payload = context.req.valid('json');
  const user = await UserService.updateProfile(+param.id, payload);

  return context.json(new ApiResponseData({
    code: 200,
    messages: [
      tMessage({
        lang,
        key: 'successUpdate',
        textCase: 'sentence',
        params: {
          data: tData({
            lang,
            key: 'withId',
            params: {
              data: tData({
                lang,
                key: 'user',
              }),
              value: param.id
            }
          })
        }
      })
    ],
    data: user,
  }), 200)
})

UserController.openapi(UserDeleteRoute, async (context) => {
  const lang = context.get('language') as AcceptedLocale;
  const param = context.req.valid('param');
  await UserService.delete(+param.id);

  return context.json(new ApiResponse({
    code: 200,
    messages: [
      tMessage({
        lang,
        key: 'successDelete',
        textCase: 'sentence',
        params: {
          data: tData({
            lang,
            key: 'withId',
            params: {
              data: tData({
                lang,
                key: 'user',
              }),
              value: param.id
            }
          })
        }
      })
    ]
  }))
})

UserController.openapi(UserChangePasswordRoute, async (context) => {
  const lang = context.get('language') as AcceptedLocale;
  const param = context.req.valid('param')
  const payload = context.req.valid('json')
  const jwt = new JwtPayload(context.get('jwtPayload'))

  if (+param.id !== jwt.user.id && !jwt.user.roles.includes(RoleEnum.SuperAdmin)) {
    throw new ForbiddenException('changePassword')
  }

  const user = await UserService.changePassword(+param.id, payload, jwt.user);

  return context.json(new ApiResponseData({
    code: 200,
    messages: [
      tMessage({
        lang,
        key: 'successChangePassword',
      })
    ],
    data: user,
  }), 200)
})

UserController.openapi(UserRoleUpdateRoute, async (context) => {
  const lang = context.get('language') as AcceptedLocale;
  const param = context.req.valid('param')
  const payload = context.req.valid('json')
  const jwt = new JwtPayload(context.get('jwtPayload'));

  if (+param.id === jwt.user.id && !jwt.user.roles.includes(RoleEnum.SuperAdmin)) {
    throw new ForbiddenException('selfAssign')
  }

  await UserService.changeRole(+param.id, payload);

  return context.json(new ApiResponse({
    code: 200,
    messages: [
      tMessage({
        lang,
        key: 'success'
      })
    ],
  }), 200)
})

export default UserController;