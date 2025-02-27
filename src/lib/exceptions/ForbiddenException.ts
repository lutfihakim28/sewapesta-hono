import { HTTPException } from 'hono/http-exception';

export class ForbiddenException extends HTTPException {
  constructor(message: string) {
    super(403, { message })
  }
}