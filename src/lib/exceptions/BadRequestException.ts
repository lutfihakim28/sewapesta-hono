import { HTTPException } from 'hono/http-exception';

export class BadRequestException extends HTTPException {
  constructor(messages: string[]) {
    super(422, { cause: messages })
  }
}