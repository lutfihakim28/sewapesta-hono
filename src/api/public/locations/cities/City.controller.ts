import { MESSAGES } from '@/lib/constants/MESSAGES';
import { honoApp } from '@/lib/hono';
import { Meta } from '@/lib/dtos/Meta.dto';
import { CityRoute } from './City.route';
import { CityService } from './City.service';
import { ApiResponseList } from '@/lib/dtos/ApiResponse.dto';
import { City } from './City.dto';

const CityController = honoApp()

CityController.openapi(CityRoute, async (context) => {
  const query = context.req.valid('query')
  const [cities, totalData] = await Promise.all([
    CityService.list(query),
    CityService.count(query)
  ])

  return context.json(new ApiResponseList({
    code: 200,
    messages: MESSAGES.successList('kabupaten/kota'),
    meta: new Meta({
      page: query.page!,
      pageSize: query.pageSize!,
      total: totalData
    }),
    data: cities.map((city) => new City(city))
  }), 200)
})

export default CityController