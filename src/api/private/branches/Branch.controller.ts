import { honoApp } from '@/lib/utils/hono';
import { BranchCreateRoute, BranchDeleteRoute, BranchDetailRoute, BranchListRoute, BranchUpdateRoute } from 'src/api/private/branches/Branch.route';
import { BranchService } from './Branch.service';
import { ApiResponse, ApiResponseData, ApiResponseList } from '@/lib/dtos/ApiResponse.dto';
import { messages } from '@/lib/constants/messages';
import { Meta } from '@/lib/dtos/Meta.dto';
import { JwtPayload } from '@/lib/dtos/JwtPayload.dto';
import { UserService } from '../users/User.service';
import { ForbiddenException } from '@/lib/exceptions/ForbiddenException';
import { RoleEnum } from '@/lib/enums/RoleEnum';

const BranchController = honoApp()

BranchController.openapi(BranchListRoute, async (context) => {
  const query = context.req.valid('query')
  const [branches, totalData] = await BranchService.list(query)

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
  const branch = await BranchService.get(+param.id);

  return context.json(new ApiResponseData({
    code: 200,
    messages: [messages.successDetail('branch')],
    data: branch,
  }), 200)
})

BranchController.openapi(BranchCreateRoute, async (context) => {
  const payload = context.req.valid('json');
  const branch = await BranchService.create(payload)

  return context.json(new ApiResponseData({
    code: 200,
    messages: [messages.successCreate(`Branch with name ${branch.name}`)],
    data: branch
  }), 200)
})

BranchController.openapi(BranchUpdateRoute, async (context) => {
  const current = new JwtPayload(context.get('jwtPayload'))
  const param = context.req.valid('param')

  const user = await UserService.isInBranch(+param.id, current.user.id)

  if (!user && current.user.role !== RoleEnum.SuperAdmin) {
    throw new ForbiddenException(messages.forbidden)
  }

  const payload = context.req.valid('json')
  const branch = await BranchService.update(+param.id, payload);

  return context.json(new ApiResponseData({
    code: 200,
    messages: [messages.successUpdate(`Branch with ID ${branch.id}`)],
    data: branch
  }), 200)
})

BranchController.openapi(BranchDeleteRoute, async (context) => {
  const current = new JwtPayload(context.get('jwtPayload'))
  const param = context.req.valid('param')

  const user = await UserService.isInBranch(+param.id, current.user.id)

  if (!user && current.user.role !== RoleEnum.SuperAdmin) {
    throw new ForbiddenException(messages.forbidden)
  }
  await BranchService.delete(+param.id)

  return context.json(new ApiResponse({
    code: 200,
    messages: [messages.successDelete(`Branch with ID ${param.id}`)]
  }), 200)
})

export default BranchController