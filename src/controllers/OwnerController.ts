import { messages } from '@/constatnts/messages';
import { honoApp } from '@/lib/hono';
import { CreateOwnerRoute } from '@/routes/owners/CreateOwnerRoute';
import { DeleteOwnerRoute } from '@/routes/owners/DeleteOwnerRoute';
import { DetailOwnerRoute } from '@/routes/owners/DetailOwnerRoute';
import { ListOwnerRoute } from '@/routes/owners/ListOwnerRoute';
import { UpdateOwnerRoute } from '@/routes/owners/UpdateOwnerRoute';
import { OwnerService } from '@/services/OwnerService';

const OwnerController = honoApp()

OwnerController.openapi(ListOwnerRoute, async (context) => {
  const query = context.req.valid('query');

  const owners = await OwnerService.getList(query);
  const totalData = await OwnerService.count(query);

  return context.json({
    code: 200,
    messages: messages.successList('pemilik'),
    data: owners,
    meta: {
      page: Number(query.page),
      pageSize: Number(query.pageSize),
      pageCount: Math.ceil(totalData / Number(query.pageSize)),
    }
  }, 200)
})

OwnerController.openapi(DetailOwnerRoute, async (context) => {
  const param = context.req.valid('param');

  const owner = await OwnerService.get(param);

  return context.json({
    code: 200,
    messages: messages.successDetail('pemilik'),
    data: owner,
  }, 200)
})

OwnerController.openapi(CreateOwnerRoute, async (context) => {
  const payload = context.req.valid('json');

  await OwnerService.create(payload);

  return context.json({
    code: 200,
    messages: messages.successCreate('pemilik'),
  }, 200)
})

OwnerController.openapi(UpdateOwnerRoute, async (context) => {
  const param = context.req.valid('param');
  const payload = context.req.valid('json');

  await OwnerService.update(param, payload);

  return context.json({
    code: 200,
    messages: messages.successUpdate('pemilik'),
  }, 200)
})

OwnerController.openapi(DeleteOwnerRoute, async (context) => {
  const param = context.req.valid('param');

  await OwnerService.delete(param);

  return context.json({
    code: 200,
    messages: messages.successDelete('pemilik'),
  }, 200)
})

export default OwnerController;