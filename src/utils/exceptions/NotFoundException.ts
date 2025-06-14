import { HTTPException } from 'hono/http-exception';
import { AcceptedLocale, DataKey, tData, tMessage } from '../constants/locales/locale';

export class NotFoundException extends HTTPException {
  constructor(
    public dataKey: DataKey,
    public dataId?: number | string,
    public dataCode?: string
  ) {
    super(404)
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

    if (this.dataCode) {
      messageData = tData({
        lang,
        key: 'withCode',
        params: {
          data,
          value: this.dataCode
        }
      })
    }

    return tMessage({
      lang,
      key: 'errorConstraint',
      textCase: 'sentence',
      params: {
        data: messageData
      }
    })
  }
}