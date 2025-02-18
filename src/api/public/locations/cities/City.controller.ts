import { MESSAGES } from '@/lib/constants/MESSAGES';
import { honoApp } from '@/lib/hono';
import { ResponseMeta } from '@/lib/dtos/ResponseMeta';
import { CityRoute } from './City.route';
import { CityService } from './City.service';

const CityController = honoApp()

CityController.openapi(CityRoute, async (context) => {
  const query = context.req.valid('query')
  const data = await CityService.list(query)
  const totalData = await CityService.count(query)

  return context.json({
    code: 200,
    messages: MESSAGES.successList('kabupaten/kota'),
    data,
    meta: new ResponseMeta({
      page: query.page!,
      pageSize: query.pageSize!,
      total: totalData
    })
  })
})

export default CityController