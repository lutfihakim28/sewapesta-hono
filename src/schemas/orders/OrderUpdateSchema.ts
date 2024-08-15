import { z } from 'zod';
import { OrderCreateSchema } from './OrderCreateSchema';

export const OrderUpdateSchema = OrderCreateSchema;

export type OrderUpdate = z.infer<typeof OrderUpdateSchema>