import { z } from 'zod';
import { ItemSchema } from './ItemSchema';
import { SubcategoryResponseSchema } from '../subcategories/SubcategoryResponseSchema';
import { OwnerResponseSchema } from '../owners/OwnerResponseSchema';
import { UnitShcema } from '../units/UnitSchema';

export const ItemListSchema = z.array(ItemSchema
  .pick({
    id: true,
    name: true,
    price: true,
  })
  .merge(z.object({
    subcategory: SubcategoryResponseSchema.pick({
      name: true,
    }).nullable(),
    owner: OwnerResponseSchema.pick({
      id: true,
      name: true,
    }).nullable(),
    unit: UnitShcema.pick({
      name: true,
    }),
    quantity: z.object({
      available: z.number().positive(),
      damaged: z.number().positive(),
      used: z.number().positive(),
      total: z.number().positive(),
    })
  })))
  .openapi('ItemList')

export type ItemList = z.infer<typeof ItemListSchema>