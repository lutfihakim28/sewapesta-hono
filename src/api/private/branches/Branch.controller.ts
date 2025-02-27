import { honoApp } from '@/lib/hono';
import { BranchCreateRoute, BranchDeleteRoute, BranchDetailRoute, BranchListRoute, BranchUpdateRoute } from './Branch.route';
import { BranchService } from './Branch.service';
import { ApiResponse, ApiResponseData, ApiResponseList } from '@/lib/dtos/ApiResponse.dto';
import { messages } from '@/lib/constants/messages';
import { Meta } from '@/lib/dtos/Meta.dto';
import { JwtPayload } from '@/lib/dtos/JwtPayload.dto';
import { RoleEnum } from '@/lib/enums/RoleEnum';
import { checkPermissions } from '@/lib/utils/checkPermissions';

const BranchController = honoApp()

BranchController.openapi(BranchListRoute, async (context) => {
  const query = context.req.valid('query')
  const jwtPayload = new JwtPayload(context.get('jwtPayload'))
  checkPermissions(jwtPayload, [RoleEnum.Admin, RoleEnum.SuperAdmin])

  const [branches, totalData] = await Promise.all([
    BranchService.list(query),
    BranchService.count(query),
  ])

  return context.json(new ApiResponseList({
    code: 200,
    messages: [messages.successList('branch')],
    meta: new Meta({
      page: query.page!,
      pageSize: query.pageSize!,
      total: totalData
    }),
    data: branches
  }), 200)
})

BranchController.openapi(BranchDetailRoute, async (context) => {
  const param = context.req.valid('param');
  const jwtPayload = new JwtPayload(context.get('jwtPayload'))
  checkPermissions(jwtPayload, [RoleEnum.Admin, RoleEnum.SuperAdmin])

  const branch = await BranchService.get(+param.id);

  return context.json(new ApiResponseData({
    code: 200,
    messages: [messages.successDetail('branch')],
    data: branch,
  }), 200)
})

BranchController.openapi(BranchCreateRoute, async (context) => {
  const payload = context.req.valid('json');
  const jwtPayload = new JwtPayload(context.get('jwtPayload'))
  checkPermissions(jwtPayload, [RoleEnum.SuperAdmin])

  const branch = await BranchService.create(payload)

  return context.json(new ApiResponseData({
    code: 200,
    messages: [messages.successCreate('branch')],
    data: branch
  }), 200)
})

BranchController.openapi(BranchUpdateRoute, async (context) => {
  const param = context.req.valid('param')
  const payload = context.req.valid('json')
  const jwtPayload = new JwtPayload(context.get('jwtPayload'))
  checkPermissions(jwtPayload, [RoleEnum.Admin, RoleEnum.SuperAdmin])

  const branch = await BranchService.update(+param.id, payload);

  return context.json(new ApiResponseData({
    code: 200,
    messages: [messages.successUpdate('branch')],
    data: branch
  }), 200)
})

BranchController.openapi(BranchDeleteRoute, async (context) => {
  const param = context.req.valid('param')
  const jwtPayload = new JwtPayload(context.get('jwtPayload'))
  checkPermissions(jwtPayload, [RoleEnum.SuperAdmin])

  await BranchService.delete(+param.id)

  return context.json(new ApiResponse({
    code: 200,
    messages: [messages.successDelete('branch')]
  }), 200)
})

export default BranchController