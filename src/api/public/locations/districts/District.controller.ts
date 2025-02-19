import { MESSAGES } from '@/lib/constants/MESSAGES';
import { honoApp } from '@/lib/hono';
import { Meta } from '@/lib/dtos/Meta.dto';
import { DistrictRoute } from './District.route';
import { DistrictService } from './District.service';
import { ApiResponseList } from '@/lib/dtos/ApiResponse.dto';
import { District } from './District.dto';

const DistrictController = honoApp()

DistrictController.openapi(DistrictRoute, async (context) => {
  const query = context.req.valid('query')
  const [districts, totalData] = await Promise.all([
    DistrictService.list(query),
    DistrictService.count(query)
  ])

  return context.json(new ApiResponseList({
    code: 200,
    messages: MESSAGES.successList('kecamatan'),
    meta: new Meta({
      page: query.page!,
      pageSize: query.pageSize!,
      total: totalData
    }),
    data: districts.map((district) => new District(district))
  }), 200)
})

export default DistrictController