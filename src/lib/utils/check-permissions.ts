import { messages } from '../constants/messages';
import { JwtPayload } from '../dtos/JwtPayload.dto';
import { RoleEnum } from '../enums/RoleEnum';
import { ForbiddenException } from '../exceptions/ForbiddenException';

export function checkPermissions(jwtPayload: JwtPayload, allowedRoles: RoleEnum[]) {
  if (jwtPayload.user.roles.every((role) => !allowedRoles.includes(role))) {
    throw new ForbiddenException(messages.forbidden)
  }
}