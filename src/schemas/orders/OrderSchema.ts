import { orders } from 'db/schema/orders';
import { createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';

const _OrderSchema = createSelectSchema(orders).pick({
  id: true,
  createdAt: true,
  customerAddress: true,
  customerName: true,
  customerPhone: true,
  endDate: true,
  note: true,
  number: true,
  startDate: true,
  status: true,
}).openapi('Order')

export type Order = z.infer<typeof _OrderSchema>

export const OrderSchema: z.ZodType<Order> = _OrderSchema
