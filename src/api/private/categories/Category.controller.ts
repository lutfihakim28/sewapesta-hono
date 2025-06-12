import { honoApp } from '@/utils/helpers/hono';
import { CategoryCheckRoute, CategoryCreateManyRoute, CategoryCreateRoute, CategoryDeleteRoute, CategoryListRoute, CategoryOptionRoute, CategoryUpdateRoute } from 'src/api/private/categories/Category.route';
import { CategoryService } from './Category.service';
import { ApiResponse, ApiResponseData, ApiResponseList } from '@/utils/dtos/ApiResponse.dto';
import { Meta } from '@/utils/dtos/Meta.dto';
import { AcceptedLocale, tData, tMessage } from '@/utils/constants/locales/locale';

const CategoryController = honoApp()

CategoryController.openapi(CategoryListRoute, async (context) => {
  const lang = context.get('language') as AcceptedLocale
  const query = context.req.valid('query')

  const [categories, totalData] = await CategoryService.list(query)

  return context.json(new ApiResponseList({
    code: 200,
    messages: [
      tMessage({
        key: 'successList',
        lang,
        textCase: 'sentence',
        params: {
          data: tData({ key: 'category', lang, mode: 'plural' })
        }
      })
    ],
    meta: new Meta({
      page: query.page!,
      pageSize: query.pageSize!,
      total: totalData
    }),
    data: categories
  }), 200)
})

CategoryController.openapi(CategoryOptionRoute, async (context) => {
  const lang = context.get('language') as AcceptedLocale
  const categories = await CategoryService.options()

  return context.json(new ApiResponseData({
    code: 200,
    messages: [
      tMessage({
        key: 'successList',
        lang,
        textCase: 'sentence',
        params: {
          data: tData({ key: 'categoryOptions', lang })
        }
      })
    ],
    data: categories
  }), 200)
})

CategoryController.openapi(CategoryCreateManyRoute, async (context) => {
  const lang = context.get('language') as AcceptedLocale;
  const payload = context.req.valid('json');

  const categories = await CategoryService.createMany(payload)

  return context.json(new ApiResponseData({
    code: 200,
    data: categories,
    messages: categories.map((category) => tMessage({
      key: 'successCreate',
      lang,
      textCase: 'sentence',
      params: {
        data: tData({
          key: 'withName',
          lang,
          params: {
            data: tData({ key: 'category', lang }),
            value: category.name
          }
        })
      }
    })),
  }), 200)
})

CategoryController.openapi(CategoryCreateRoute, async (context) => {
  const lang = context.get('language') as AcceptedLocale;
  const payload = context.req.valid('json');

  const category = await CategoryService.create(payload)

  return context.json(new ApiResponseData({
    code: 200,
    data: category,
    messages: [
      tMessage({
        key: 'successCreate',
        lang,
        textCase: 'sentence',
        params: {
          data: tData({
            key: 'withName',
            lang,
            params: {
              data: tData({ key: 'category', lang }),
              value: payload.name
            }
          })
        }
      })
    ],
  }), 200)
})

CategoryController.openapi(CategoryUpdateRoute, async (context) => {
  const lang = context.get('language') as AcceptedLocale;

  const param = context.req.valid('param')
  const payload = context.req.valid('json')

  const category = await CategoryService.update(+param.id, payload);

  return context.json(new ApiResponseData({
    code: 200,
    data: category,
    messages: [
      tMessage({
        key: 'successUpdate',
        lang,
        textCase: 'sentence',
        params: {
          data: tData({
            key: 'withId',
            lang,
            params: {
              data: tData({ key: 'category', lang }),
              value: param.id
            }
          })
        }
      })
    ],
  }), 200)
})

CategoryController.openapi(CategoryDeleteRoute, async (context) => {
  const lang = context.get('language') as AcceptedLocale;
  const param = context.req.valid('param')

  await CategoryService.delete(+param.id)

  return context.json(new ApiResponse({
    code: 200,
    messages: [
      tMessage({
        key: 'successDelete',
        lang,
        textCase: 'sentence',
        params: {
          data: tData({
            key: 'withId',
            lang,
            params: {
              data: tData({ key: 'category', lang }),
              value: param.id
            }
          })
        }
      })
    ]
  }), 200)
})

CategoryController.openapi(CategoryCheckRoute, async (context) => {
  const lang = context.get('language') as AcceptedLocale;
  const query = context.req.valid('query')

  await CategoryService.checkAvailability(query)

  return context.json(new ApiResponse({
    code: 200,
    messages: [
      tMessage({
        key: 'available',
        lang,
        textCase: 'sentence',
        params: {
          data: tData({
            lang,
            key: 'dataName',
            params: {
              data: tData({ lang, key: 'category' })
            }
          })
        }
      })
    ]
  }), 200)
})

export default CategoryController