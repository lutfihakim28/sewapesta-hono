import { honoApp } from '@/utils/helpers/hono';
import { ItemCreateRoute, ItemDeleteRoute, ItemDetailRoute, ItemListRoute, ItemUpdateRoute } from 'src/api/private/items/Item.route';
import { ItemService } from './Item.service';
import { ApiResponse, ApiResponseData, ApiResponseList } from '@/utils/dtos/ApiResponse.dto';
import { Meta } from '@/utils/dtos/Meta.dto';
import { AcceptedLocale, tData, tMessage } from '@/utils/constants/locales/locale';
import { NotFoundException } from '@/utils/exceptions/NotFoundException';

const ItemController = honoApp()

ItemController.openapi(ItemListRoute, async (context) => {
  const lang = context.get('language') as AcceptedLocale;
  const query = context.req.valid('query')
  const [items, totalData] = await ItemService.list(query);

  return context.json(new ApiResponseList({
    code: 200,
    messages: [
      tMessage({
        lang,
        key: 'successList',
        textCase: 'sentence',
        params: {
          data: tData({
            lang,
            key: 'item',
            mode: 'plural'
          })
        }
      })
    ],
    meta: new Meta({
      page: query.page,
      pageSize: query.pageSize,
      total: totalData
    }),
    data: items
  }), 200)
})

ItemController.openapi(ItemDetailRoute, async (context) => {
  const lang = context.get('language') as AcceptedLocale;
  const param = context.req.valid('param')

  const item = await ItemService.get(+param.id)

  if (!item) {
    throw new NotFoundException('item', param.id)
  }

  return context.json(new ApiResponseData({
    code: 200,
    messages: [
      tMessage({
        lang,
        key: 'successDetail',
        textCase: 'sentence',
        params: {
          data: tData({
            lang,
            key: 'item',
          })
        }
      })
    ],
    data: item,
  }), 200)
})

ItemController.openapi(ItemCreateRoute, async (context) => {
  const lang = context.get('language') as AcceptedLocale;
  const payload = context.req.valid('json')

  const item = await ItemService.create(payload)

  return context.json(new ApiResponseData({
    code: 200,
    messages: [
      tMessage({
        lang,
        key: 'successCreate',
        textCase: 'sentence',
        params: {
          data: tData({
            lang,
            key: 'withName',
            params: {
              data: tData({ lang, key: 'item' }),
              value: payload.name
            }
          })
        }
      })
    ],
    data: item,
  }), 200)
})

ItemController.openapi(ItemUpdateRoute, async (context) => {
  const lang = context.get('language') as AcceptedLocale;
  const param = context.req.valid('param')
  const payload = context.req.valid('json')

  const item = await ItemService.update(+param.id, payload)

  return context.json(new ApiResponseData({
    code: 200,
    messages: [
      tMessage({
        lang,
        key: 'successUpdate',
        textCase: 'sentence',
        params: {
          data: tData({
            lang,
            key: 'withId',
            params: {
              data: tData({ lang, key: 'item' }),
              value: item.id
            }
          })
        }
      })
    ],
    data: item,
  }), 200)
})

ItemController.openapi(ItemDeleteRoute, async (context) => {
  const lang = context.get('language') as AcceptedLocale;
  const param = context.req.valid('param')

  await ItemService.delete(+param.id)

  return context.json(new ApiResponse({
    code: 200,
    messages: [
      tMessage({
        lang,
        key: 'successDelete',
        textCase: 'sentence',
        params: {
          data: tData({
            lang,
            key: 'withId',
            params: {
              data: tData({ lang, key: 'item' }),
              value: param.id
            }
          })
        }
      })
    ]
  }), 200)
})

export default ItemController;