import { validationMessages } from '@/constatnts/validationMessages';
import { createInsertSchema } from 'drizzle-zod';
import { z } from 'zod';
import { OrderedProductRequest, OrderedProductRequestSchema } from '../orderedProducts/OrderedProductRequestSchema';
import { orders } from 'db/schema/orders';
import dayjs from 'dayjs';

const _OrderCreateSchema = createInsertSchema(orders, {
  customerAddress: z.string({ message: validationMessages.required('Alamat pelanggan') }).openapi({ example: 'Jl. Jalan' }),
  customerName: z.string({ message: validationMessages.required('Nama pelanggan') }).openapi({ example: 'Pelanggan Aza' }),
  customerPhone: z.string({ message: validationMessages.required('Nomor HP pelanggan') }).openapi({ example: '6282382' }),
  endDate: z.number({ message: validationMessages.requiredNumber('Tanggal berakhir') }).openapi({ example: dayjs().add(2, 'day').unix() }),
  startDate: z.number({ message: validationMessages.requiredNumber('Tanggal mulai') }).openapi({ example: dayjs().add(1, 'day').unix() }),
  note: z.string().nullable().openapi({ example: 'Catatan' }),
  middleman: z.boolean().nullable().openapi({ example: false }),
}).pick({
  customerAddress: true,
  customerName: true,
  customerPhone: true,
  endDate: true,
  note: true,
  startDate: true,
  middleman: true,
})

export type OrderCreate = z.infer<typeof _OrderCreateSchema> & {
  orderedProducts: Array<OrderedProductRequest>
}

export const OrderCreateSchema: z.ZodType<OrderCreate> = _OrderCreateSchema.extend({
  orderedProducts: z.array(OrderedProductRequestSchema)
}).openapi('OrderRequest')