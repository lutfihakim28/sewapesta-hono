import { validationMessages } from '@/constatnts/validationMessages';
import { OrderStatusEnum } from '@/enums/OrderStatusEnum';
import { orders } from 'db/schema/orders';
import { createInsertSchema } from 'drizzle-zod';
import { z } from 'zod';

export const OrderPatchSchema = createInsertSchema(orders, {
  middleman: z.boolean().nullable().openapi({ example: false }),
  overtime: z.number().nullable().openapi({ example: 1 }),
  status: z.nativeEnum(OrderStatusEnum, { message: validationMessages.enum('Status', OrderStatusEnum) }).nullable().openapi({
    example: OrderStatusEnum.Cancel,
  })
}).pick({
  middleman: true,
  status: true,
  overtime: true,
})

export type OrderPatch = z.infer<typeof OrderPatchSchema>