import { honoApp } from '@/utils/helpers/hono';
import { InventoryUsageService } from './InventoryUsage.service';
import { ApiResponse, ApiResponseData, ApiResponseList } from '@/utils/dtos/ApiResponse.dto';
import { Meta } from '@/utils/dtos/Meta.dto';
import { InventoryUsageCreateRoute, InventoryUsageDeleteRoute, InventoryUsageDetailRoute, InventoryUsageListRoute, InventoryUsageUpdateRoute } from './InventoryUsage.route';
import { AcceptedLocale, tData, tMessage } from '@/utils/constants/locales/locale';
import { NotFoundException } from '@/utils/exceptions/NotFoundException';

const InventoryUsageController = honoApp()

InventoryUsageController.openapi(InventoryUsageListRoute, async (context) => {
  const lang = context.get('language') as AcceptedLocale;
  const query = context.req.valid('query')
  const [inventoryUsages, totalData] = await InventoryUsageService.list(query);

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
            key: 'inventoryUsage',
            mode: 'plural'
          })
        }
      })
    ],
    meta: new Meta({
      page: query.page!,
      pageSize: query.pageSize!,
      total: totalData
    }),
    data: inventoryUsages
  }), 200)
})

InventoryUsageController.openapi(InventoryUsageDetailRoute, async (context) => {
  const lang = context.get('language') as AcceptedLocale;
  const param = context.req.valid('param')
  const inventoryUsage = await InventoryUsageService.get(+param.id)

  if (!inventoryUsage) {
    throw new NotFoundException('inventoryUsage', param.id)
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
            key: 'inventoryUsage',
          })
        }
      })
    ],
    data: inventoryUsage
  }), 200)
})

InventoryUsageController.openapi(InventoryUsageCreateRoute, async (context) => {
  const lang = context.get('language') as AcceptedLocale;
  const payload = context.req.valid('json')

  const inventoryUsage = await InventoryUsageService.create(payload)

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
              data: tData({
                lang,
                key: 'inventoryUsage',
              }),
              value: inventoryUsage.id
            }
          })
        }
      })
    ],
    data: inventoryUsage
  }), 200)
})

InventoryUsageController.openapi(InventoryUsageUpdateRoute, async (context) => {
  const lang = context.get('language') as AcceptedLocale;
  const param = context.req.valid('param')
  const payload = context.req.valid('json')

  const inventoryUsage = await InventoryUsageService.update(+param.id, payload)

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
                key: 'inventoryUsage',
              }),
              value: inventoryUsage.id
            }
          })
        }
      })
    ],
    data: inventoryUsage
  }), 200)
})

InventoryUsageController.openapi(InventoryUsageDeleteRoute, async (context) => {
  const lang = context.get('language') as AcceptedLocale;
  const param = context.req.valid('param')

  await InventoryUsageService.delete(+param.id)

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
              data: tData({
                lang,
                key: 'inventoryUsage',
              }),
              value: param.id
            }
          })
        }
      })
    ],
  }), 200)
})

export default InventoryUsageController