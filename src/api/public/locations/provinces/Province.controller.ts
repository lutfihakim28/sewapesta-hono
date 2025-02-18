import { MESSAGES } from '@/lib/constants/MESSAGES';
import { honoApp } from '@/lib/hono';
import { ProvinceRoute } from './Province.route';
import { ProvinceService } from './Province.service';
import { ResponseMeta } from '@/lib/dtos/ResponseMeta';

const ProvinceController = honoApp()

ProvinceController.openapi(ProvinceRoute, async (context) => {
  const query = context.req.valid('query')
  const data = await ProvinceService.list(query)
  const totalData = await ProvinceService.count(query)

  return context.json({
    code: 200,
    messages: MESSAGES.successList('provinsi'),
    data,
    meta: new ResponseMeta({
      page: query.page!,
      pageSize: query.pageSize!,
      total: totalData
    })
  })
})

export default ProvinceController