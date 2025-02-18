import { HTTPException } from 'hono/http-exception';

export class BadRequestException extends HTTPException {
  constructor(messages: Array<string>) {
    super(422, { cause: messages })
  }
}