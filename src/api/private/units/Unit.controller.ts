import { honoApp } from '@/utils/helpers/hono';
import { UnitCheckRoute, UnitCreateManyRoute, UnitCreateRoute, UnitDeleteRoute, UnitListRoute, UnitOptionRoute, UnitUpdateRoute } from 'src/api/private/units/Unit.route';
import { UnitService } from './Unit.service';
import { ApiResponse, ApiResponseData, ApiResponseList } from '@/utils/dtos/ApiResponse.dto';
import { Meta } from '@/utils/dtos/Meta.dto';
import { AcceptedLocale, tData, tMessage } from '@/utils/constants/locales/locale';

const UnitController = honoApp()

UnitController.openapi(UnitListRoute, async (context) => {
  const lang = context.get('language') as AcceptedLocale;
  const query = context.req.valid('query')

  const [units, totalData] = await UnitService.list(query)

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
            key: 'unit',
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
    data: units
  }), 200)
})

UnitController.openapi(UnitOptionRoute, async (context) => {
  const lang = context.get('language') as AcceptedLocale
  const units = await UnitService.options()

  return context.json(new ApiResponseData({
    code: 200,
    messages: [
      tMessage({
        key: 'successList',
        lang,
        textCase: 'sentence',
        params: {
          data: tData({ key: 'unitOptions', lang })
        }
      })
    ],
    data: units
  }), 200)
})

UnitController.openapi(UnitCreateManyRoute, async (context) => {
  const lang = context.get('language') as AcceptedLocale;
  const payload = context.req.valid('json');

  const units = await UnitService.createMany(payload)

  return context.json(new ApiResponseData({
    code: 200,
    data: units,
    messages: units.map((unit) => tMessage({
      key: 'successCreate',
      lang,
      textCase: 'sentence',
      params: {
        data: tData({
          key: 'withName',
          lang,
          params: {
            data: tData({ key: 'unit', lang }),
            value: unit.name
          }
        })
      }
    })),
  }), 200)
})

UnitController.openapi(UnitCreateRoute, async (context) => {
  const lang = context.get('language') as AcceptedLocale;
  const payload = context.req.valid('json');

  await UnitService.create(payload)

  return context.json(new ApiResponse({
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
              data: tData({
                lang,
                key: 'unit',
              }),
              value: payload.name
            }
          })
        }
      })
    ],
  }), 200)
})

UnitController.openapi(UnitUpdateRoute, async (context) => {
  const lang = context.get('language') as AcceptedLocale;
  const param = context.req.valid('param')
  const payload = context.req.valid('json')

  await UnitService.update(+param.id, payload);

  return context.json(new ApiResponse({
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
              data: tData({ lang, key: 'unit' }),
              value: param.id
            }
          })
        }
      })
    ],
  }), 200)
})

UnitController.openapi(UnitDeleteRoute, async (context) => {
  const lang = context.get('language') as AcceptedLocale;
  const param = context.req.valid('param')

  await UnitService.delete(+param.id)

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
              data: tData({ lang, key: 'unit' }),
              value: param.id
            }
          })
        }
      })
    ]
  }), 200)
})

UnitController.openapi(UnitCheckRoute, async (context) => {
  const lang = context.get('language') as AcceptedLocale;
  const query = context.req.valid('query')

  await UnitService.checkAvailability(query)

  return context.json(new ApiResponse({
    code: 200,
    messages: [
      tMessage({
        lang,
        key: 'available',
        textCase: 'sentence',
        params: {
          data: tData({
            lang,
            key: 'dataName',
            params: {
              data: tData({ lang, key: 'unit' }),
            }
          })
        }
      })
    ]
  }), 200)
})

export default UnitController