import { messages } from '@/utils/constants/messages';
import { honoApp } from '@/utils/helpers/hono';
import { Meta } from '@/utils/dtos/Meta.dto';
import { SubdistrictRoute } from 'src/api/public/locations/subdistricts/Subdistrict.route';
import { SubdistrictService } from './Subdistrict.service';
import { ApiResponseList } from '@/utils/dtos/ApiResponse.dto';

const SubdistrictController = honoApp()

SubdistrictController.openapi(SubdistrictRoute, async (context) => {
  const query = context.req.valid('query')
  const [subdistricts, totalData] = await Promise.all([
    SubdistrictService.list(query),
    SubdistrictService.count(query)
  ])

  return context.json(new ApiResponseList({
    code: 200,
    messages: [messages.successList('kelurahan')],
    meta: new Meta({
      page: query.page!,
      pageSize: query.pageSize!,
      total: totalData
    }),
    data: subdistricts
  }), 200)
})

export default SubdistrictController