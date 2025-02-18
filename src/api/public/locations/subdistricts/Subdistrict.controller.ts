import { MESSAGES } from '@/lib/constants/MESSAGES';
import { honoApp } from '@/lib/hono';
import { ResponseMeta } from '@/lib/dtos/ResponseMeta';
import { SubdistrictRoute } from './Subdistrict.route';
import { SubdistrictService } from './Subdistrict.service';

const SubdistrictController = honoApp()

SubdistrictController.openapi(SubdistrictRoute, async (context) => {
  const query = context.req.valid('query')
  const data = await SubdistrictService.list(query)
  const totalData = await SubdistrictService.count(query)

  return context.json({
    code: 200,
    messages: MESSAGES.successList('kelurahan'),
    data,
    meta: new ResponseMeta({
      page: query.page!,
      pageSize: query.pageSize!,
      total: totalData
    })
  })
})

export default SubdistrictController