// prevents TS errors
// declare var self: Worker;

import dayjs from 'dayjs';
import { ItemService } from './services/ItemService';

const interval = 1000 * 5 * 60

self.onmessage = (event: MessageEvent) => {
  setInterval(async () => {
    const itemId = await ItemService.checkRecord({ id: '1' })
    console.log(itemId)
  }, interval)
};