import { HTTPException } from 'hono/http-exception';
import { AcceptedLocale, DataKey, tData, tMessage } from '../constants/locales/locale';

export class UniqueConstraintException extends HTTPException {
  constructor(
    public dataKey: DataKey,
    public dataId?: number,
    public dataName?: string
  ) {
    super(422)
  }

  writeMessage(lang: AcceptedLocale) {
    const data = tData({ lang, key: this.dataKey });
    let messageData = data;

    if (this.dataId) {
      messageData = tData({
        lang,
        key: 'withId',
        params: {
          data,
          value: this.dataId
        }
      })
    }

    if (this.dataName) {
      messageData = tData({
        lang,
        key: 'withName',
        params: {
          data,
          value: this.dataName
        }
      })
    }

    return tMessage({
      lang,
      key: 'uniqueConstraint',
      textCase: 'sentence',
      params: {
        data: messageData
      }
    })
  }
}