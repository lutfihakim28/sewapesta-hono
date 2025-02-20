import { honoApp } from '@/lib/hono';
import { BranchRoute } from './Branch.route';
import { BranchService } from './Branch.service';
import { ApiResponseList } from '@/lib/dtos/ApiResponse.dto';
import { messages } from '@/lib/constants/messages';
import { Meta } from '@/lib/dtos/Meta.dto';

const BranchController = honoApp()

BranchController.openapi(BranchRoute, async (context) => {
  const query = context.req.valid('query')
  const [branches, totalData] = await Promise.all([
    BranchService.list(query),
    BranchService.count(query),
  ])

  return context.json(new ApiResponseList({
    code: 200,
    messages: [messages.successList('cabang')],
    meta: new Meta({
      page: query.page!,
      pageSize: query.pageSize!,
      total: totalData
    }),
    data: branches
  }), 200)
})

export default BranchController