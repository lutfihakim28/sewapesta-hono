import { messages } from '@/lib/constants/messages';
import { honoApp } from '@/lib/hono';
import { Meta } from '@/lib/dtos/Meta.dto';
import { SubdistrictRoute } from './Subdistrict.route';
import { SubdistrictService } from './Subdistrict.service';
import { ApiResponseList } from '@/lib/dtos/ApiResponse.dto';

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