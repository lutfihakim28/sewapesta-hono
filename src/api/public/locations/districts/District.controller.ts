import { MESSAGES } from '@/lib/constants/MESSAGES';
import { honoApp } from '@/lib/hono';
import { ResponseMeta } from '@/lib/dtos/ResponseMeta';
import { DistrictRoute } from './District.route';
import { DistrictService } from './District.service';

const DistrictController = honoApp()

DistrictController.openapi(DistrictRoute, async (context) => {
  const query = context.req.valid('query')
  const data = await DistrictService.list(query)
  const totalData = await DistrictService.count(query)

  return context.json({
    code: 200,
    messages: MESSAGES.successList('kecamatan'),
    data,
    meta: new ResponseMeta({
      page: query.page!,
      pageSize: query.pageSize!,
      total: totalData
    })
  })
})

export default DistrictController