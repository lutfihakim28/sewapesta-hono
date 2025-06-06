import { HTTPException } from 'hono/http-exception';
import { AcceptedLocale, MessageKey, tMessage } from '../constants/locales/locale';

export class UnauthorizedException extends HTTPException {
  constructor(public messageKey: MessageKey) {
    super(401)
  }

  writeMessage(lang: AcceptedLocale) {
    return tMessage({
      lang,
      key: this.messageKey,
    })
  }
}