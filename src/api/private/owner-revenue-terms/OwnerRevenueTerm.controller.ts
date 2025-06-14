import { honoApp } from '@/utils/helpers/hono';
import { OwnerRevenueTermService } from './OwnerRevenueTerm.service';
import { ApiResponse, ApiResponseData, ApiResponseList } from '@/utils/dtos/ApiResponse.dto';
import { Meta } from '@/utils/dtos/Meta.dto';
import { OwnerRevenueTermCreateRoute, OwnerRevenueTermDeleteRoute, OwnerRevenueTermDetailRoute, OwnerRevenueTermListRoute, OwnerRevenueTermUpdateRoute } from './OwnerRevenueTerm.route';
import { tMessage, tData, AcceptedLocale } from '@/utils/constants/locales/locale';
import { NotFoundException } from '@/utils/exceptions/NotFoundException';

const OwnerRevenueTermController = honoApp()

OwnerRevenueTermController.openapi(OwnerRevenueTermListRoute, async (context) => {
  const lang = context.get('language') as AcceptedLocale;
  const query = context.req.valid('query')
  const [ownerRevenueTerms, totalData] = await OwnerRevenueTermService.list(query);

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
            key: 'ownerRevenueTerm',
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
    data: ownerRevenueTerms
  }), 200)
})

OwnerRevenueTermController.openapi(OwnerRevenueTermDetailRoute, async (context) => {
  const lang = context.get('language') as AcceptedLocale;
  const param = context.req.valid('param')
  const ownerRevenueTerm = await OwnerRevenueTermService.get(+param.id)

  if (!ownerRevenueTerm) {
    throw new NotFoundException('ownerRevenueTerm', param.id)
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
            key: 'ownerRevenueTerm',
          })
        }
      })
    ],
    data: ownerRevenueTerm
  }), 200)
})

OwnerRevenueTermController.openapi(OwnerRevenueTermCreateRoute, async (context) => {
  const lang = context.get('language') as AcceptedLocale;
  const payload = context.req.valid('json')

  const ownerRevenueTerm = await OwnerRevenueTermService.create(payload)

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
              data: tData({ lang, key: 'ownerRevenueTerm' }),
              value: ownerRevenueTerm.id
            }
          })
        }
      })
    ],
    data: ownerRevenueTerm
  }), 200)
})

OwnerRevenueTermController.openapi(OwnerRevenueTermUpdateRoute, async (context) => {
  const lang = context.get('language') as AcceptedLocale;
  const param = context.req.valid('param')
  const payload = context.req.valid('json')

  const ownerRevenueTerm = await OwnerRevenueTermService.update(+param.id, payload)

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
              data: tData({ lang, key: 'ownerRevenueTerm' }),
              value: ownerRevenueTerm.id
            }
          })
        }
      })
    ],
    data: ownerRevenueTerm
  }), 200)
})

OwnerRevenueTermController.openapi(OwnerRevenueTermDeleteRoute, async (context) => {
  const lang = context.get('language') as AcceptedLocale;
  const param = context.req.valid('param')

  await OwnerRevenueTermService.delete(+param.id)

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
            data: tData({ lang, key: 'ownerRevenueTerm' }),
            value: param.id
          }
        })
      }
    })],
  }), 200)
})

export default OwnerRevenueTermController