import { honoApp } from '@/utils/helpers/hono';
import { InventoryDamageReportService } from './InventoryDamageReport.service';
import { ApiResponse, ApiResponseData, ApiResponseList } from '@/utils/dtos/ApiResponse.dto';
import { Meta } from '@/utils/dtos/Meta.dto';
import { InventoryDamageReportCreateRoute, InventoryDamageReportDeleteRoute, InventoryDamageReportDetailRoute, InventoryDamageReportListRoute, InventoryDamageReportUpdateRoute } from './InventoryDamageReport.route';
import { AcceptedLocale, tData, tMessage } from '@/utils/constants/locales/locale';

const InventoryDamageReportController = honoApp()

InventoryDamageReportController.openapi(InventoryDamageReportListRoute, async (context) => {
  const lang = context.get('language') as AcceptedLocale;
  const query = context.req.valid('query')
  const [inventoryDamageReports, totalData] = await InventoryDamageReportService.list(query);

  return context.json(new ApiResponseList({
    code: 200,
    messages: [
      tMessage({
        key: 'successList',
        lang,
        textCase: 'sentence',
        params: {
          data: tData({
            key: 'inventoryDamageReport',
            lang,
            mode: 'plural',
          })
        }
      })
    ],
    meta: new Meta({
      page: query.page!,
      pageSize: query.pageSize!,
      total: totalData
    }),
    data: inventoryDamageReports
  }), 200)
})

InventoryDamageReportController.openapi(InventoryDamageReportDetailRoute, async (context) => {
  const lang = context.get('language') as AcceptedLocale;
  const param = context.req.valid('param')
  const inventoryDamageReport = await InventoryDamageReportService.get(+param.id)

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
            key: 'inventoryDamageReport',
          })
        }
      })
    ],
    data: inventoryDamageReport
  }), 200)
})

InventoryDamageReportController.openapi(InventoryDamageReportCreateRoute, async (context) => {
  const lang = context.get('language') as AcceptedLocale
  const payload = context.req.valid('json')

  const inventoryDamageReport = await InventoryDamageReportService.create(payload)

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
                key: 'inventoryDamageReport',
              }),
              value: inventoryDamageReport.id
            }
          })
        }
      })
    ],
    data: inventoryDamageReport
  }), 200)
})

InventoryDamageReportController.openapi(InventoryDamageReportUpdateRoute, async (context) => {
  const lang = context.get('language') as AcceptedLocale;
  const param = context.req.valid('param')
  const payload = context.req.valid('json')

  const inventoryDamageReport = await InventoryDamageReportService.update(+param.id, payload)

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
                key: 'inventoryDamageReport',
              }),
              value: inventoryDamageReport.id
            }
          })
        }
      })
    ],
    data: inventoryDamageReport
  }), 200)
})

InventoryDamageReportController.openapi(InventoryDamageReportDeleteRoute, async (context) => {
  const lang = context.get('language') as AcceptedLocale;
  const param = context.req.valid('param')

  await InventoryDamageReportService.delete(+param.id)

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
                key: 'inventoryDamageReport',
              }),
              value: param.id
            }
          })
        }
      })
    ],
  }), 200)
})

export default InventoryDamageReportController