import { MESSAGES } from '@/lib/constants/MESSAGES';
import { honoApp } from '@/lib/hono';
import { CreateItemRoute } from '@/routes/items/CreateItemRoute';
import { DeleteItemRoute } from '@/routes/items/DeleteItemRoute';
import { DetailItemRoute } from '@/routes/items/DetailItemRoute';
import { ListItemOrderStatRoute } from '@/routes/items/ListItemOrderStatRoute';
import { ListItemProductRoute } from '@/routes/items/ListItemProductRoute';
import { ListItemRoute } from '@/routes/items/ListItemRoute';
import { ListStockMutationRoute } from '@/routes/items/ListStockMutationRoute';
import { UpdateItemRoute } from '@/routes/items/UpdateItemRoute';
import { ItemCreate, ItemUpdate } from '@/schemas/items/ItemRequestSchema';
import { ItemService } from '@/services/ItemService';
import { StockMutationService } from '@/services/StockMutationService';

const ItemController = honoApp()

ItemController.openapi(ListItemRoute, async (context) => {
  const query = context.req.valid('query');
  const items = await ItemService.getList(query);
  const totalData = await ItemService.count(query);

  return context.json({
    code: 200,
    messages: MESSAGES.successList('barang'),
    data: items,
    meta: {
      page: Number(query.page),
      pageSize: Number(query.pageSize),
      pageCount: Math.ceil(totalData / Number(query.pageSize)),
    }
  }, 200)
})

ItemController.openapi(DetailItemRoute, async (context) => {
  const param = context.req.valid('param');

  const item = await ItemService.get(param);

  return context.json({
    code: 200,
    messages: MESSAGES.successDetail('barang'),
    data: item,
  }, 200)
})

ItemController.openapi(CreateItemRoute, async (context) => {
  const payload = await context.req.parseBody({ all: true }) as unknown as ItemCreate;

  await ItemService.create(payload);

  return context.json({
    code: 200,
    messages: MESSAGES.successCreate('barang'),
  }, 200)
})

ItemController.openapi(UpdateItemRoute, async (context) => {
  const param = context.req.valid('param');
  const payload = await context.req.parseBody({ all: true }) as unknown as ItemUpdate;

  await ItemService.update(param, payload);

  return context.json({
    code: 200,
    messages: MESSAGES.successUpdate('barang'),
  }, 200)
})

ItemController.openapi(DeleteItemRoute, async (context) => {
  const param = context.req.valid('param');

  await ItemService.delete(param);

  return context.json({
    code: 200,
    messages: MESSAGES.successDelete('barang'),
  }, 200)
})

ItemController.openapi(ListStockMutationRoute, async (context) => {
  const param = context.req.param()

  const data = await StockMutationService.getList(param)

  return context.json({
    code: 200,
    messages: MESSAGES.successList('mutasi stok'),
    data
  }, 200)
})

ItemController.openapi(ListItemProductRoute, async (context) => {
  const param = context.req.param()

  const data = await ItemService.getProductByItem(param)

  return context.json({
    code: 200,
    messages: MESSAGES.successList('produk'),
    data
  }, 200)
})

ItemController.openapi(ListItemOrderStatRoute, async (context) => {
  const param = context.req.param()
  const query = context.req.valid('query')

  const data = await ItemService.getItemOrderStats(param, query)

  return context.json({
    code: 200,
    messages: MESSAGES.successList('statistik pemesanan'),
    data
  }, 200)
})

export default ItemController;