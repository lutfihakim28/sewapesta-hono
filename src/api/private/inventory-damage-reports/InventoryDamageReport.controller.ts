import { honoApp } from '@/utils/helpers/hono';
import { InventoryDamageReportService } from './InventoryDamageReport.service';
import { messages } from '@/utils/constants/messages';
import { ApiResponse, ApiResponseData, ApiResponseList } from '@/utils/dtos/ApiResponse.dto';
import { Meta } from '@/utils/dtos/Meta.dto';
import { InventoryDamageReportCreateRoute, InventoryDamageReportDeleteRoute, InventoryDamageReportDetailRoute, InventoryDamageReportListRoute, InventoryDamageReportUpdateRoute } from './InventoryDamageReport.route';

const InventoryDamageReportController = honoApp()

InventoryDamageReportController.openapi(InventoryDamageReportListRoute, async (context) => {
  const query = context.req.valid('query')
  const [inventoryDamageReports, totalData] = await InventoryDamageReportService.list(query);

  return context.json(new ApiResponseList({
    code: 200,
    messages: [messages.successList('inventory damage reports')],
    meta: new Meta({
      page: query.page!,
      pageSize: query.pageSize!,
      total: totalData
    }),
    data: inventoryDamageReports
  }), 200)
})

InventoryDamageReportController.openapi(InventoryDamageReportDetailRoute, async (context) => {
  const param = context.req.valid('param')
  const inventoryDamageReport = await InventoryDamageReportService.get(+param.id)

  return context.json(new ApiResponseData({
    code: 200,
    messages: [messages.successDetail('inventory damage report')],
    data: inventoryDamageReport
  }), 200)
})

InventoryDamageReportController.openapi(InventoryDamageReportCreateRoute, async (context) => {
  const payload = context.req.valid('json')

  const inventoryDamageReport = await InventoryDamageReportService.create(payload)

  return context.json(new ApiResponseData({
    code: 200,
    messages: [messages.successCreate(`Inventory damage report with ID ${inventoryDamageReport.id}`)],
    data: inventoryDamageReport
  }), 200)
})

InventoryDamageReportController.openapi(InventoryDamageReportUpdateRoute, async (context) => {
  const param = context.req.valid('param')
  const payload = context.req.valid('json')

  const inventoryDamageReport = await InventoryDamageReportService.update(+param.id, payload)

  return context.json(new ApiResponseData({
    code: 200,
    messages: [messages.successUpdate(`Inventory damage report with ID ${inventoryDamageReport.id}`)],
    data: inventoryDamageReport
  }), 200)
})

InventoryDamageReportController.openapi(InventoryDamageReportDeleteRoute, async (context) => {
  const param = context.req.valid('param')

  await InventoryDamageReportService.delete(+param.id)

  return context.json(new ApiResponse({
    code: 200,
    messages: [messages.successDelete(`Inventory damage report with ID ${param.id}`)],
  }), 200)
})

export default InventoryDamageReportController