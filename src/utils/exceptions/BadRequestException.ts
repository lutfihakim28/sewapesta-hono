import { HTTPException } from 'hono/http-exception';

export class BadRequestException extends HTTPException {
  constructor(message: string) {
    super(422, { message })
  }
}