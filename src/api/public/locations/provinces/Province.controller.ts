import { messages } from '@/lib/constants/messages';
import { honoApp } from '@/lib/utils/hono';
import { ProvinceRoute } from 'src/api/public/locations/provinces/Province.route';
import { ProvinceService } from './Province.service';
import { Meta } from '@/lib/dtos/Meta.dto';
import { ApiResponseList } from '@/lib/dtos/ApiResponse.dto';

const ProvinceController = honoApp()

ProvinceController.openapi(ProvinceRoute, async (context) => {
  const query = context.req.valid('query')
  const [provinces, totalData] = await Promise.all([
    ProvinceService.list(query),
    ProvinceService.count(query)
  ])

  return context.json(new ApiResponseList({
    code: 200,
    messages: [messages.successList('provinsi')],
    meta: new Meta({
      page: query.page!,
      pageSize: query.pageSize!,
      total: totalData
    }),
    data: provinces
  }), 200)
})

export default ProvinceController