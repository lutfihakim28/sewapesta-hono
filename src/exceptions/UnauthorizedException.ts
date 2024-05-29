import { HTTPException } from 'hono/http-exception';

export class UnauthorizedException extends HTTPException {
  constructor(message: string) {
    super(401, { message })
  }
}