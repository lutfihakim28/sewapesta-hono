import { HTTPException } from 'hono/http-exception';

export class InvalidException extends HTTPException {
  constructor(messages: Array<string>) {
    super(422, { cause: messages })
  }
}