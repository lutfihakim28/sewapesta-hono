import { honoApp } from '@/utils/helpers/hono';
import { InventoryService } from './Inventory.service';
import { ApiResponse, ApiResponseData, ApiResponseList } from '@/utils/dtos/ApiResponse.dto';
import { Meta } from '@/utils/dtos/Meta.dto';
import { InventoryCreateRoute, InventoryDeleteRoute, InventoryDetailRoute, InventoryListRoute, InventoryUpdateRoute } from './Inventory.route';
import { AcceptedLocale, tData, tMessage } from '@/utils/constants/locales/locale';
import { NotFoundException } from '@/utils/exceptions/NotFoundException';

const InventoryController = honoApp()

InventoryController.openapi(InventoryListRoute, async (context) => {
  const lang = context.get('language') as AcceptedLocale
  const query = context.req.valid('query')
  const [inventories, totalData] = await InventoryService.list(query);

  return context.json(new ApiResponseList({
    code: 200,
    messages: [tMessage({
      lang,
      key: 'successList',
      textCase: 'sentence',
      params: {
        data: tData({
          lang,
          key: 'inventory',
          mode: 'plural'
        })
      }
    })],
    meta: new Meta({
      page: query.page!,
      pageSize: query.pageSize!,
      total: totalData
    }),
    data: inventories
  }), 200)
})

InventoryController.openapi(InventoryDetailRoute, async (context) => {
  const lang = context.get('language') as AcceptedLocale
  const param = context.req.valid('param')
  const inventory = await InventoryService.get(+param.id)

  return context.json(new ApiResponseData({
    code: 200,
    messages: [
      tMessage({
        lang,
        key: 'errorNotFound',
        textCase: 'sentence',
        params: {
          data: tData({
            lang,
            key: 'withId',
            params: {
              data: tData({
                lang,
                key: 'inventory',
              }),
              value: param.id
            }
          })
        }
      })
    ],
    data: inventory
  }), 200)
})

InventoryController.openapi(InventoryCreateRoute, async (context) => {
  const lang = context.get('language') as AcceptedLocale;
  const payload = context.req.valid('json')

  const inventory = await InventoryService.create(payload)

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
            key: 'withId',
            params: {
              data: tData({ lang, key: 'inventory' }),
              value: inventory.id
            }
          })
        }
      })
    ],
    data: inventory
  }), 200)
})

InventoryController.openapi(InventoryUpdateRoute, async (context) => {
  const lang = context.get('language') as AcceptedLocale;
  const param = context.req.valid('param')
  const payload = context.req.valid('json')

  const inventory = await InventoryService.update(+param.id, payload)

  if (!inventory) {
    throw new NotFoundException('inventory', param.id)
  }

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
              data: tData({
                lang,
                key: 'inventory',
              }),
              value: param.id
            }
          })
        }
      })
    ],
    data: inventory
  }), 200)
})

InventoryController.openapi(InventoryDeleteRoute, async (context) => {
  const lang = context.get('language') as AcceptedLocale;
  const param = context.req.valid('param')

  await InventoryService.delete(+param.id)

  return context.json(new ApiResponse({
    code: 200,
    messages: [tMessage({
      lang,
      key: 'successDelete',
      textCase: 'sentence',
      params: {
        data: tData({
          lang,
          key: 'withId',
          params: {
            data: tData({
              lang,
              key: 'inventory',
            }),
            value: param.id
          }
        })
      }
    })],
  }), 200)
})

export default InventoryController