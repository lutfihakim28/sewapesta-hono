import { honoApp } from '@/utils/helpers/hono';
import { InventoryMutationService } from './InventoryMutation.service';
import { ApiResponse, ApiResponseData, ApiResponseList } from '@/utils/dtos/ApiResponse.dto';
import { Meta } from '@/utils/dtos/Meta.dto';
import { InventoryMutationCreateRoute, InventoryMutationDeleteRoute, InventoryMutationDetailRoute, InventoryMutationListRoute, InventoryMutationUpdateRoute } from './InventoryMutation.route';
import { AcceptedLocale, tData, tMessage } from '@/utils/constants/locales/locale';

const InventoryMutationController = honoApp()

InventoryMutationController.openapi(InventoryMutationListRoute, async (context) => {
  const lang = context.get('language') as AcceptedLocale;
  const query = context.req.valid('query')
  const [inventoryMutations, totalData] = await InventoryMutationService.list(query);

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
            key: 'inventoryMutation',
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
    data: inventoryMutations
  }), 200)
})

InventoryMutationController.openapi(InventoryMutationDetailRoute, async (context) => {
  const lang = context.get('language') as AcceptedLocale;
  const param = context.req.valid('param')
  const inventoryMutation = await InventoryMutationService.get(+param.id)

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
            key: 'inventoryMutation',
          })
        }
      })
    ],
    data: inventoryMutation
  }), 200)
})

InventoryMutationController.openapi(InventoryMutationCreateRoute, async (context) => {
  const lang = context.get('language') as AcceptedLocale;
  const payload = context.req.valid('json')

  const inventoryMutation = await InventoryMutationService.create(payload)

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
              data: tData({ lang, key: 'inventoryMutation' }),
              value: inventoryMutation.id
            }
          })
        }
      })
    ],
    data: inventoryMutation
  }), 200)
})

InventoryMutationController.openapi(InventoryMutationUpdateRoute, async (context) => {
  const lang = context.get('language') as AcceptedLocale;
  const param = context.req.valid('param')
  const payload = context.req.valid('json')

  const inventoryMutation = await InventoryMutationService.update(+param.id, payload)

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
              data: tData({ lang, key: 'inventoryMutation' }),
              value: inventoryMutation.id
            }
          })
        }
      })
    ],
    data: inventoryMutation
  }), 200)
})

InventoryMutationController.openapi(InventoryMutationDeleteRoute, async (context) => {
  const lang = context.get('language') as AcceptedLocale;
  const param = context.req.valid('param')

  await InventoryMutationService.delete(+param.id)

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
              data: tData({ lang, key: 'inventoryMutation' }),
              value: param.id
            }
          })
        }
      })
    ],
  }), 200)
})

export default InventoryMutationController