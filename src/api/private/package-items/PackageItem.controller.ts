import { honoApp } from '@/utils/helpers/hono';
import { PackageItemService } from './PackageItem.service';
import { ApiResponse, ApiResponseData, ApiResponseList } from '@/utils/dtos/ApiResponse.dto';
import { Meta } from '@/utils/dtos/Meta.dto';
import { PackageItemListRoute, PackageItemCreateRoute, PackageItemDeleteRoute, PackageItemDetailRoute, PackageItemUpdateRoute } from './PackageItem.route';
import { AcceptedLocale, tData, tMessage } from '@/utils/constants/locales/locale';
import { NotFoundException } from '@/utils/exceptions/NotFoundException';

const PackageItemController = honoApp()

PackageItemController.openapi(PackageItemListRoute, async (context) => {
  const lang = context.get('language') as AcceptedLocale;
  const query = context.req.valid('query')
  const [packageItems, totalData] = await PackageItemService.list(query);

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
            key: 'packageItem',
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
    data: packageItems
  }), 200)
})

PackageItemController.openapi(PackageItemDetailRoute, async (context) => {
  const lang = context.get('language') as AcceptedLocale;
  const param = context.req.valid('param')
  const packageItem = await PackageItemService.get(+param.id)

  if (!packageItem) {
    throw new NotFoundException('packageItem', param.id)
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
            key: 'packageItem',
          })
        }
      })
    ],
    data: packageItem
  }), 200)
})

PackageItemController.openapi(PackageItemCreateRoute, async (context) => {
  const lang = context.get('language') as AcceptedLocale;
  const payload = context.req.valid('json')

  const packageItem = await PackageItemService.create(payload)

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
                key: 'packageItem',
              }),
              value: packageItem.id
            }
          })
        }
      })
    ],
    data: packageItem
  }), 200)
})

PackageItemController.openapi(PackageItemUpdateRoute, async (context) => {
  const lang = context.get('language') as AcceptedLocale;
  const param = context.req.valid('param')
  const payload = context.req.valid('json')

  const packageItem = await PackageItemService.update(+param.id, payload)

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
                key: 'packageItem',
              }),
              value: packageItem.id
            }
          })
        }
      })
    ],
    data: packageItem
  }), 200)
})

PackageItemController.openapi(PackageItemDeleteRoute, async (context) => {
  const lang = context.get('language') as AcceptedLocale;
  const param = context.req.valid('param')

  await PackageItemService.delete(+param.id)

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
                key: 'packageItem',
              }),
              value: param.id
            }
          })
        }
      })
    ],
  }), 200)
})

export default PackageItemController