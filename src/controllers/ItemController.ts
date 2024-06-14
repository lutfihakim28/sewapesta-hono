import { messages } from '@/constatnts/messages';
import { honoApp } from '@/lib/hono';
import { CreateItemRoute, DeleteItemRoute, DetailItemRoute, ListItemRoute, UpdateItemRoute } from '@/routes/ItemRoute';
import { ItemCreate, ItemUpdate } from '@/schemas/items/ItemRequestSchema';
import { ItemService } from '@/services/ItemService';

const ItemController = honoApp()

ItemController.openapi(ListItemRoute, async (context) => {
  const query = context.req.valid('query');
  const items = await ItemService.getList(query);
  const totalData = await ItemService.count(query);


  return context.json({
    code: 200,
    messages: messages.successList('barang'),
    data: items,
    meta: {
      page: Number(query.page),
      limit: Number(query.limit),
      totalPage: Math.ceil(totalData / Number(query.limit)),
    }
  }, 200)
})

ItemController.openapi(DetailItemRoute, async (context) => {
  const param = context.req.valid('param');

  const item = await ItemService.get(param);

  return context.json({
    code: 200,
    messages: messages.successDetail('barang'),
    data: item,
  }, 200)
})

ItemController.openapi(CreateItemRoute, async (context) => {
  // const payload = context.req.valid('form');
  const payload = await context.req.parseBody({ all: true }) as unknown as ItemCreate;

  await ItemService.create(payload);

  return context.json({
    code: 200,
    messages: messages.successCreate('barang'),
  }, 200)
})

ItemController.openapi(UpdateItemRoute, async (context) => {
  const param = context.req.valid('param');
  // const payload = context.req.valid('form');
  const payload = await context.req.parseBody({ all: true }) as unknown as ItemUpdate;

  await ItemService.update(param, payload);

  return context.json({
    code: 200,
    messages: messages.successUpdate('barang'),
  }, 200)
})

ItemController.openapi(DeleteItemRoute, async (context) => {
  const param = context.req.valid('param');

  await ItemService.delete(param);

  return context.json({
    code: 200,
    messages: messages.successDelete('barang'),
  }, 200)
})

export default ItemController;