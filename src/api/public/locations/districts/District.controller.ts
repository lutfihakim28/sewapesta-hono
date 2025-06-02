import { messages } from '@/utils/constants/locales/messages';
import { honoApp } from '@/utils/helpers/hono';
import { Meta } from '@/utils/dtos/Meta.dto';
import { DistrictRoute } from 'src/api/public/locations/districts/District.route';
import { DistrictService } from './District.service';
import { ApiResponseList } from '@/utils/dtos/ApiResponse.dto';

const DistrictController = honoApp()

DistrictController.openapi(DistrictRoute, async (context) => {
  const query = context.req.valid('query')
  const [districts, totalData] = await Promise.all([
    DistrictService.list(query),
    DistrictService.count(query)
  ])

  return context.json(new ApiResponseList({
    code: 200,
    messages: [messages.successList('kecamatan')],
    meta: new Meta({
      page: query.page!,
      pageSize: query.pageSize!,
      total: totalData
    }),
    data: districts
  }), 200)
})

export default DistrictController