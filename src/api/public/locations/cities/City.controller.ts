import { messages } from '@/lib/constants/messages';
import { honoApp } from '@/lib/utils/hono';
import { Meta } from '@/lib/dtos/Meta.dto';
import { CityRoute } from './City.routes';
import { CityService } from './City.service';
import { ApiResponseList } from '@/lib/dtos/ApiResponse.dto';

const CityController = honoApp()

CityController.openapi(CityRoute, async (context) => {
  const query = context.req.valid('query')
  const [cities, totalData] = await Promise.all([
    CityService.list(query),
    CityService.count(query)
  ])

  return context.json(new ApiResponseList({
    code: 200,
    messages: [messages.successList('kabupaten/kota')],
    meta: new Meta({
      page: query.page!,
      pageSize: query.pageSize!,
      total: totalData
    }),
    data: cities
  }), 200)
})

export default CityController