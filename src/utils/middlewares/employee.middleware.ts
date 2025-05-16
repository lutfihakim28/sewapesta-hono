import { createMiddleware } from 'hono/factory';
import { JwtPayload } from '../dtos/JwtPayload.dto';
import { RoleEnum } from '../enums/RoleEnum';
import { checkPermissions } from '../helpers/check-permissions';

export const employeeMiddleware = createMiddleware(async (context, next) => {
  const jwtPayload = new JwtPayload(context.get('jwtPayload'))
  checkPermissions(jwtPayload, [RoleEnum.SuperAdmin, RoleEnum.Admin, RoleEnum.Employee])
  await next()
})