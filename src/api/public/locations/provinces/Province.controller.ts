import { messages } from '@/utils/constants/locales/messages';
import { honoApp } from '@/utils/helpers/hono';
import { ProvinceRoute } from 'src/api/public/locations/provinces/Province.route';
import { ProvinceService } from './Province.service';
import { Meta } from '@/utils/dtos/Meta.dto';
import { ApiResponseList } from '@/utils/dtos/ApiResponse.dto';

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