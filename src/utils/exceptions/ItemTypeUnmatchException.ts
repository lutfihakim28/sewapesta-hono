import { HTTPException } from 'hono/http-exception';
import { ItemTypeEnum } from '../enums/ItemTypeEnum';
import { AcceptedLocale, tMessage } from '../constants/locales/locale';

export class ItemTypeUnmatchException extends HTTPException {
  constructor(public dataId: string | number, public dataType: ItemTypeEnum) {
    super(404)
  }

  writeMessage(lang: AcceptedLocale) {
    return tMessage({
      lang,
      key: 'itemTypeUnmatch',
      params: { id: +this.dataId, type: this.dataType }
    })
  }
}