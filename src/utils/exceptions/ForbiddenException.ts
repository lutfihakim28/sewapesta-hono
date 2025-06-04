import { HTTPException } from 'hono/http-exception';
import { AcceptedLocale, MessageKey, tMessage } from '../constants/locales/locale';

export class ForbiddenException extends HTTPException {
  constructor(public messageKey: MessageKey) {
    super(403)
  }

  writeMessage(lang: AcceptedLocale) {
    return tMessage({
      lang,
      key: this.messageKey,
    })
  }
}