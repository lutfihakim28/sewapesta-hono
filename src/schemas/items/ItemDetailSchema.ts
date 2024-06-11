import { z } from 'zod';
import { ItemSchema } from './ItemSchema';
import { SubcategoryResponseSchema } from '../subcategories/SubcategoryResponseSchema';
import { OwnerResponseSchema } from '../owners/OwnerResponseSchema';
import { DamagedItemSchema } from '../damagedItems/DamagedItemSchema';
import { OrderedItemSchema } from '../orderedItems/OrderedItemSchema';
import { UnitShcema } from '../units/UnitSchema';

export const ItemDetailSchema = ItemSchema
  .pick({
    id: true,
    name: true,
    price: true,
    quantity: true,
  })
  .merge(z.object({
    subcategory: SubcategoryResponseSchema.pick({
      name: true,
    }).nullable(),
    owner: OwnerResponseSchema.pick({
      id: true,
      name: true,
      phone: true,
    }).nullable(),
    unit: UnitShcema.pick({
      name: true,
    }),
    quantity: z.object({
      available: z.number().positive(),
      damaged: z.number().positive(),
      used: z.number().positive(),
      total: z.number().positive(),
    }),
    damagedItems: z.array(DamagedItemSchema.pick({
      createdAt: true,
      description: true,
      id: true,
      quantity: true,
      updatedAt: true,
    })),
    orderedItems: z.array(OrderedItemSchema.pick({
      createdAt: true,
      id: true,
      quantity: true,
      updatedAt: true,
    })),
  }))
  .openapi('ItemDetail')

export type ItemDetail = z.infer<typeof ItemDetailSchema>