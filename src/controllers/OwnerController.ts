import { messages } from '@/constatnts/messages';
import { honoApp } from '@/lib/hono';
import { CreateOwnerRoute, DeleteOwnerRoute, DetailOwnerRoute, ListOwnerRoute, UpdateOwnerRoute } from '@/routes/OwnerRoute';
import { OwnerService } from '@/services/OwnerService';

const OwnerController = honoApp()

OwnerController.openapi(ListOwnerRoute, async (context) => {
  const owners = await OwnerService.getList();

  return context.json({
    code: 200,
    messages: [messages.successList('pemilik')],
    data: owners,
  }, 200)
})

OwnerController.openapi(DetailOwnerRoute, async (context) => {
  const param = context.req.valid('param');

  const owner = await OwnerService.get(param);

  return context.json({
    code: 200,
    messages: [messages.successDetail('pemilik')],
    data: owner,
  }, 200)
})

OwnerController.openapi(CreateOwnerRoute, async (context) => {
  const payload = context.req.valid('json');

  const owner = await OwnerService.create(payload);

  return context.json({
    code: 200,
    messages: [messages.successCreate('pemilik')],
    data: owner,
  }, 200)
})

OwnerController.openapi(UpdateOwnerRoute, async (context) => {
  const param = context.req.valid('param');
  const payload = context.req.valid('json');

  const owner = await OwnerService.update(param, payload);

  return context.json({
    code: 200,
    messages: [messages.successUpdate('pemilik')],
    data: owner,
  }, 200)
})

OwnerController.openapi(DeleteOwnerRoute, async (context) => {
  const param = context.req.valid('param');

  await OwnerService.delete(param);

  return context.json({
    code: 200,
    messages: [messages.successDelete('pemilik')],
  }, 200)
})

export default OwnerController;