import { honoApp } from '@/utils/helpers/hono';
import { ItemRevenueTermService } from './ItemRevenueTerm.service';
import { ApiResponse, ApiResponseData, ApiResponseList } from '@/utils/dtos/ApiResponse.dto';
import { Meta } from '@/utils/dtos/Meta.dto';
import { ItemRevenueTermCreateRoute, ItemRevenueTermDeleteRoute, ItemRevenueTermDetailRoute, ItemRevenueTermListRoute, ItemRevenueTermUpdateRoute } from './ItemRevenueTerm.route';
import { NotFoundException } from '@/utils/exceptions/NotFoundException';
import { AcceptedLocale, tData, tMessage } from '@/utils/constants/locales/locale';

const ItemRevenueTermController = honoApp()

ItemRevenueTermController.openapi(ItemRevenueTermListRoute, async (context) => {
  const lang = context.get('language') as AcceptedLocale;
  const query = context.req.valid('query')
  const [itemRevenueTerms, totalData] = await ItemRevenueTermService.list(query);

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
            key: 'itemRevenueTerm',
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
    data: itemRevenueTerms
  }), 200)
})

ItemRevenueTermController.openapi(ItemRevenueTermDetailRoute, async (context) => {
  const lang = context.get('language') as AcceptedLocale;
  const param = context.req.valid('param')
  const itemRevenueTerm = await ItemRevenueTermService.get(+param.id)

  if (!itemRevenueTerm) {
    throw new NotFoundException('itemRevenueTerm', param.id)
  }

  return context.json(new ApiResponseData({
    code: 200,
    messages: [
      tMessage({
        lang,
        key: 'successDetail',
        textCase: 'sentence',
        params: {
          data: tData({ lang, key: 'itemRevenueTerm' })
        }
      })
    ],
    data: itemRevenueTerm
  }), 200)
})

ItemRevenueTermController.openapi(ItemRevenueTermCreateRoute, async (context) => {
  const lang = context.get('language') as AcceptedLocale;
  const payload = context.req.valid('json')

  const itemRevenueTerm = await ItemRevenueTermService.create(payload)

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
              data: tData({ lang, key: 'itemRevenueTerm' }),
              value: itemRevenueTerm.id
            }
          })
        }
      })
    ],
    data: itemRevenueTerm
  }), 200)
})

ItemRevenueTermController.openapi(ItemRevenueTermUpdateRoute, async (context) => {
  const lang = context.get('language') as AcceptedLocale;
  const param = context.req.valid('param')
  const payload = context.req.valid('json')

  const itemRevenueTerm = await ItemRevenueTermService.update(+param.id, payload)

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
              data: tData({ lang, key: 'itemRevenueTerm' }),
              value: itemRevenueTerm.id
            }
          })
        }
      })
    ],
    data: itemRevenueTerm
  }), 200)
})

ItemRevenueTermController.openapi(ItemRevenueTermDeleteRoute, async (context) => {
  const lang = context.get('language') as AcceptedLocale;
  const param = context.req.valid('param')

  await ItemRevenueTermService.delete(+param.id)

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
              data: tData({ lang, key: 'itemRevenueTerm' }),
              value: param.id
            }
          })
        }
      })
    ],
  }), 200)
})

export default ItemRevenueTermController