import { honoApp } from '@/utils/helpers/hono';
import { PackageService } from './Package.service';
import { ApiResponse, ApiResponseData, ApiResponseList } from '@/utils/dtos/ApiResponse.dto';
import { Meta } from '@/utils/dtos/Meta.dto';
import { PackageCreateRoute, PackageCreateWithItemsRoute, PackageDeleteRoute, PackageDetailRoute, PackageListRoute, PackageOptionRoute, PackageUpdateRoute } from './Package.route';
import { AcceptedLocale, tData, tMessage } from '@/utils/constants/locales/locale';
import { NotFoundException } from '@/utils/exceptions/NotFoundException';

const PackageController = honoApp()

PackageController.openapi(PackageListRoute, async (context) => {
  const lang = context.get('language') as AcceptedLocale;
  const query = context.req.valid('query')
  const [products, totalData] = await PackageService.list(query);

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
            key: 'package',
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
    data: products
  }), 200)
})

PackageController.openapi(PackageOptionRoute, async (context) => {
  const lang = context.get('language') as AcceptedLocale
  const categories = await PackageService.options()

  return context.json(new ApiResponseData({
    code: 200,
    messages: [
      tMessage({
        key: 'successList',
        lang,
        textCase: 'sentence',
        params: {
          data: tData({ key: 'packageOptions', lang })
        }
      })
    ],
    data: categories
  }), 200)
})

PackageController.openapi(PackageDetailRoute, async (context) => {
  const lang = context.get('language') as AcceptedLocale;
  const param = context.req.valid('param')
  const _package = await PackageService.get(+param.id)

  if (!_package) {
    throw new NotFoundException('package', param.id)
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
            key: 'package',
          })
        }
      })
    ],
    data: _package
  }), 200)
})

PackageController.openapi(PackageCreateRoute, async (context) => {
  const lang = context.get('language') as AcceptedLocale;
  const payload = context.req.valid('json')

  const _package = await PackageService.create(payload)

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
              data: tData({ lang, key: 'package' }),
              value: _package.name
            }
          })
        }
      })
    ],
    data: _package
  }), 200)
})

PackageController.openapi(PackageCreateWithItemsRoute, async (context) => {
  const lang = context.get('language') as AcceptedLocale;
  const body = context.req.valid('json');
  const created = await PackageService.createWithItems(body);
  return context.json(new ApiResponseData({
    code: 201,
    messages: [
      tMessage({
        lang,
        key: 'successCreate',
        textCase: 'sentence',
        params: {
          data: tData({ lang, key: 'package' })
        }
      })
    ],
    data: created
  }), 201);
});

PackageController.openapi(PackageUpdateRoute, async (context) => {
  const lang = context.get('language') as AcceptedLocale;
  const param = context.req.valid('param')
  const payload = context.req.valid('json')

  const _package = await PackageService.update(+param.id, payload)

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
              data: tData({ lang, key: 'package' }),
              value: _package.id
            }
          })
        }
      })
    ],
    data: _package
  }), 200)
})

PackageController.openapi(PackageDeleteRoute, async (context) => {
  const lang = context.get('language') as AcceptedLocale;
  const param = context.req.valid('param')

  await PackageService.delete(+param.id)

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
              data: tData({ lang, key: 'package' }),
              value: param.id
            }
          })
        }
      })
    ],
  }), 200)
})

export default PackageController