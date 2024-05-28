import { z } from 'zod';
import { CategoryResponseSchema } from './CategoryResponseSchema';
import { SubcategoryResponseSchema } from '../subcategories/SubcategoryResponseSchema';

export const ExtendedCategoryResponseSchema = CategoryResponseSchema
  .merge(z.object({
    subcategories: z.array(SubcategoryResponseSchema)
  })).openapi('ExtendedCategoryResponse')

export type ExtendedCategoryResponse = z.infer<typeof ExtendedCategoryResponseSchema>