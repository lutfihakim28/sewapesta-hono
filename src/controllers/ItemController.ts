import { messages } from '@/constatnts/messages';
import { honoApp } from '@/lib/hono';
import { CreateItemRoute, DeleteItemRoute, DetailItemRoute, ListItemRoute, UpdateItemRoute } from '@/routes/ItemRoute';
import { ItemService } from '@/services/ItemService';

const ItemController = honoApp()

ItemController.openapi(ListItemRoute, async (context) => {
  const query = context.req.valid('query');
  const items = await ItemService.getList(query);

  return context.json({
    code: 200,
    messages: [messages.successList('barang')],
    data: items,
  }, 200)
})

ItemController.openapi(DetailItemRoute, async (context) => {
  const param = context.req.valid('param');

  const item = await ItemService.get(param);

  return context.json({
    code: 200,
    messages: [messages.successDetail('barang')],
    data: item,
  }, 200)
})

ItemController.openapi(CreateItemRoute, async (context) => {
  const payload = context.req.valid('json');

  const item = await ItemService.create(payload);

  return context.json({
    code: 200,
    messages: [messages.successCreate('barang')],
    data: item,
  }, 200)
})

ItemController.openapi(UpdateItemRoute, async (context) => {
  const param = context.req.valid('param');
  const payload = context.req.valid('json');

  const item = await ItemService.update(param, payload);

  return context.json({
    code: 200,
    messages: [messages.successUpdate('barang')],
    data: item,
  }, 200)
})

ItemController.openapi(DeleteItemRoute, async (context) => {
  const param = context.req.valid('param');

  await ItemService.delete(param);

  return context.json({
    code: 200,
    messages: [messages.successDelete('barang')],
  }, 200)
})

export default ItemController;