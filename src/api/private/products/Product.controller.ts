import { honoApp } from '@/utils/helpers/hono';
import { ProductCheckRoute, ProductCreateManyRoute, ProductCreateRoute, ProductDeleteRoute, ProductDetailRoute, ProductListRoute, ProductOptionRoute, ProductUpdateRoute } from 'src/api/private/products/Product.route';
import { ProductService } from './Product.service';
import { ApiResponse, ApiResponseData, ApiResponseList } from '@/utils/dtos/ApiResponse.dto';
import { Meta } from '@/utils/dtos/Meta.dto';
import { AcceptedLocale, tData, tMessage } from '@/utils/constants/locales/locale';

const ProductController = honoApp()

ProductController.openapi(ProductListRoute, async (context) => {
  const lang = context.get('language') as AcceptedLocale;
  const query = context.req.valid('query')
  const [products, totalData] = await ProductService.list(query);

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
            key: 'product',
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

ProductController.openapi(ProductOptionRoute, async (context) => {
  const lang = context.get('language') as AcceptedLocale
  const categories = await ProductService.options()

  return context.json(new ApiResponseData({
    code: 200,
    messages: [
      tMessage({
        key: 'successList',
        lang,
        textCase: 'sentence',
        params: {
          data: tData({ key: 'productOptions', lang })
        }
      })
    ],
    data: categories
  }), 200)
})

ProductController.openapi(ProductCreateManyRoute, async (context) => {
  const lang = context.get('language') as AcceptedLocale;
  const payload = context.req.valid('json');

  const products = await ProductService.createMany(payload)

  return context.json(new ApiResponseData({
    code: 200,
    data: products,
    messages: products.map((product) => tMessage({
      key: 'successCreate',
      lang,
      textCase: 'sentence',
      params: {
        data: tData({
          key: 'withName',
          lang,
          params: {
            data: tData({ key: 'product', lang }),
            value: product.name
          }
        })
      }
    })),
  }), 200)
})

ProductController.openapi(ProductCheckRoute, async (context) => {
  const lang = context.get('language') as AcceptedLocale;
  const query = context.req.valid('query')

  await ProductService.checkAvailability(query)

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
              data: tData({ lang, key: 'product' })
            }
          })
        }
      })
    ]
  }), 200)
})

ProductController.openapi(ProductDetailRoute, async (context) => {
  const lang = context.get('language') as AcceptedLocale;
  const param = context.req.valid('param')
  const product = await ProductService.get(+param.id)

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
            key: 'product',
          })
        }
      })
    ],
    data: product
  }), 200)
})

ProductController.openapi(ProductCreateRoute, async (context) => {
  const lang = context.get('language') as AcceptedLocale;
  const payload = context.req.valid('json')

  const product = await ProductService.create(payload)

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
              data: tData({ lang, key: 'product' }),
              value: product.name
            }
          })
        }
      })
    ],
    data: product
  }), 200)
})

ProductController.openapi(ProductUpdateRoute, async (context) => {
  const lang = context.get('language') as AcceptedLocale;
  const param = context.req.valid('param')
  const payload = context.req.valid('json')

  const product = await ProductService.update(+param.id, payload)

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
              data: tData({ lang, key: 'product' }),
              value: product.id
            }
          })
        }
      })
    ],
    data: product
  }), 200)
})

ProductController.openapi(ProductDeleteRoute, async (context) => {
  const lang = context.get('language') as AcceptedLocale;
  const param = context.req.valid('param')

  await ProductService.delete(+param.id)

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
            key: 'product',
          })
        }
      })
    ],
  }), 200)
})

export default ProductController