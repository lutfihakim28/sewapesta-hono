import { z } from 'zod';
import { ProductCreate, ProductCreateSchema } from './ProductCreateSchema';

export type ProductUpdate = ProductCreate

export const ProductUpdateSchema: z.ZodType<ProductUpdate> = ProductCreateSchema