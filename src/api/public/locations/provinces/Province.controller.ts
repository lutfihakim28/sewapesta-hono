import { MESSAGES } from '@/lib/constants/MESSAGES';
import { honoApp } from '@/lib/hono';
import { ProvinceRoute } from './Province.route';
import { ProvinceService } from './Province.service';
import { Meta } from '@/lib/dtos/Meta.dto';
import { ApiResponseList } from '@/lib/dtos/ApiResponse.dto';
import { Province } from './Province.dto';

const ProvinceController = honoApp()

ProvinceController.openapi(ProvinceRoute, async (context) => {
  const query = context.req.valid('query')
  const [provinces, totalData] = await Promise.all([
    ProvinceService.list(query),
    ProvinceService.count(query)
  ])

  return context.json(new ApiResponseList({
    code: 200,
    messages: MESSAGES.successList('provinsi'),
    meta: new Meta({
      page: query.page!,
      pageSize: query.pageSize!,
      total: totalData
    }),
    data: provinces.map((province) => new Province(province))
  }), 200)
})

export default ProvinceController