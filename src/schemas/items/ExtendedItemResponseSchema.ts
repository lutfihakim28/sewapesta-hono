import { z } from 'zod';
import { ItemResponseSchema } from './ItemResponseSchema';
import { SubcategoryResponseSchema } from '../subcategories/SubcategoryResponseSchema';
import { OwnerResponseSchema } from '../owners/OwnerResponseSchema';

export const ExtendedItemResponseSchema = ItemResponseSchema.merge(z.object({
  subcategory: SubcategoryResponseSchema,
  owner: OwnerResponseSchema,
})).openapi('ExtendedItemResponse')

export type ExtendedItemResponse = z.infer<typeof ExtendedItemResponseSchema>