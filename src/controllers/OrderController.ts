import { messages } from '@/constants/Message';
import { honoApp } from '@/lib/hono';
import { CreateOrderRoute } from '@/routes/orders/CreateOrderRoute';
import { DeleteOrderRoute } from '@/routes/orders/DeleteOrderRoute';
import { DetailOrderRoute } from '@/routes/orders/DetailOrderRoute';
import { ListAssignedEmployeeRoute } from '@/routes/orders/ListAssignedEmployeeRoute';
import { ListOrderedProductRoute } from '@/routes/orders/ListOrderedProductRoute';
import { ListOrderRoute } from '@/routes/orders/ListOrderRoute';
import { PatchOrderRoute } from '@/routes/orders/PatchOrderRoute';
import { UpdateOrderRoute } from '@/routes/orders/UpdateOrderRoute';
import { OrderCreate } from '@/schemas/orders/OrderCreateSchema';
import { OrderPatch } from '@/schemas/orders/OrderPatchSchema';
import { OrderUpdate } from '@/schemas/orders/OrderUpdateSchema';
import { OrderService } from '@/services/OrderService';

const OrderController = honoApp();

OrderController.openapi(ListOrderRoute, async (context) => {
  const query = context.req.valid('query');

  const _orders = await OrderService.getList(query);
  const totalData = await OrderService.count(query);

  return context.json({
    code: 200,
    messages: messages.successList('pesanan'),
    data: _orders,
    meta: {
      page: Number(query.page),
      pageSize: Number(query.pageSize),
      pageCount: Math.ceil(totalData / Number(query.pageSize)),
    }
  }, 200)
})

OrderController.openapi(DetailOrderRoute, async (context) => {
  const param = context.req.param();

  const order = await OrderService.get(param);

  return context.json({
    code: 200,
    messages: messages.successDetail('pesanan'),
    data: order,
  }, 200)
})

OrderController.openapi(CreateOrderRoute, async (context) => {
  const payload = await context.req.json() as unknown as OrderCreate;

  await OrderService.create(payload);

  return context.json({
    code: 200,
    messages: messages.successCreate('pesanan'),
  }, 200)
})

OrderController.openapi(UpdateOrderRoute, async (context) => {
  const param = context.req.valid('param');
  const payload = await context.req.json() as unknown as OrderUpdate;

  await OrderService.update(param, payload);

  return context.json({
    code: 200,
    messages: messages.successUpdate('pesanan'),
  }, 200)
})

OrderController.openapi(PatchOrderRoute, async (context) => {
  const param = context.req.valid('param');
  const payload = await context.req.json() as unknown as OrderPatch;

  await OrderService.patch(param, payload);

  const field: string[] = [];

  if (payload.middleman) {
    field.push('makelar')
  }

  if (payload.status) {
    field.push('status')
  }

  return context.json({
    code: 200,
    messages: messages.successPatch('pesanan', field.join(' dan ')),
  }, 200)
})

OrderController.openapi(ListOrderedProductRoute, async (context) => {
  const param = context.req.param();

  const orderedProducts = await OrderService.getOrderedProducts(param);

  return context.json({
    code: 200,
    messages: messages.successDetail('produk yang dipesan'),
    data: orderedProducts,
  }, 200)
})

OrderController.openapi(ListAssignedEmployeeRoute, async (context) => {
  const param = context.req.param();

  const assignedEmployees = await OrderService.getAssignedEmployees(param);

  return context.json({
    code: 200,
    messages: messages.successDetail('karyawan yang bertugas'),
    data: assignedEmployees,
  }, 200)
})

OrderController.openapi(DeleteOrderRoute, async (context) => {
  const param = context.req.valid('param');

  await OrderService.delete(param);

  return context.json({
    code: 200,
    messages: messages.successDelete('pesanan'),
  }, 200)
})

export default OrderController