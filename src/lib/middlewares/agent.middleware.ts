import { createMiddleware } from 'hono/factory';
import { JwtPayload } from '../dtos/JwtPayload.dto';
import { RoleEnum } from '../enums/RoleEnum';
import { checkPermissions } from '../utils/check-permissions';

export const agentMiddleware = createMiddleware(async (context, next) => {
  const jwtPayload = new JwtPayload(context.get('jwtPayload'))
  checkPermissions(jwtPayload, [RoleEnum.SuperAdmin, RoleEnum.Admin, RoleEnum.Agent])
  await next()
})