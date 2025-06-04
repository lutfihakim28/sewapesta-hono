import { inventoryMutations } from 'db/schema/inventory-mutations';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { ItemSchema } from '../items/Item.schema';
import { UserExtendedSchema } from '../users/User.schema';
import { SearchSchema } from '@/utils/schemas/Search.schema';
import { PaginationSchema } from '@/utils/schemas/Pagination.schema';
import { StockMutationTypeEnum } from '@/utils/enums/StockMutationType.Enum';
import { ApiResponseDataSchema, ApiResponseListSchema } from '@/utils/schemas/ApiResponse.schema';
import { StringSchema } from '@/utils/schemas/String.schema';
import { NumberSchema } from '@/utils/schemas/Number.schema';
import { SchemaType } from '@/utils/types/Schema.type';
import { EnumSchema } from '@/utils/schemas/Enum.schema';
import { ArraySchema } from '@/utils/schemas/Array.schema';
import { tMessage, tData } from '@/utils/constants/locales/locale';

export type InventoryMutaionColumn = keyof typeof inventoryMutations.$inferSelect

export const InventoryMutationSchema = createSelectSchema(inventoryMutations)
  .pick({
    description: true,
    id: true,
    inventoryId: true,
    itemId: true,
    mutateAt: true,
    quantity: true,
    type: true,
  })
  .openapi('InventoryMutation')

export const InventoryMutationListSchema = new ArraySchema('Inventory mutation list', InventoryMutationSchema.extend({
  item: ItemSchema.pick({
    id: true,
    name: true,
  }),
  owner: UserExtendedSchema.pick({
    id: true,
    name: true,
  })
})).getSchema().openapi('InventoryMutationList')

export const InventoryMutationFilterSchema = SearchSchema
  .merge(PaginationSchema)
  .extend({
    ownerId: new StringSchema('Owner ID').neutralNumeric().getSchema().optional(),
    itemId: new StringSchema('Item ID').neutralNumeric().getSchema().optional(),
  })
  .openapi('InventoryMutationFilter')

export const InventoryMutationRequestSchema = createInsertSchema(inventoryMutations, {
  description: new StringSchema('Description').getSchema().optional(),
  inventoryId: new NumberSchema('Inventory ID').natural().getSchema(),
  quantity: new NumberSchema('Quantity').natural().getSchema(),
  type: new EnumSchema('Type', StockMutationTypeEnum).getSchema()
}).pick({
  description: true,
  inventoryId: true,
  quantity: true,
  type: true,
}).openapi('InventoryMutationRequest')

export const InventoryMutationResponseListSchema = ApiResponseListSchema(InventoryMutationListSchema, tMessage({
  lang: 'en',
  key: 'successList',
  textCase: 'sentence',
  params: {
    data: tData({
      lang: 'en',
      key: 'inventoryMutation',
      mode: 'plural'
    })
  }
}))
export const InventoryMutationResponseDataSchema = ApiResponseDataSchema(InventoryMutationSchema, tMessage({
  lang: 'en',
  key: 'successDetail',
  textCase: 'sentence',
  params: {
    data: tData({
      lang: 'en',
      key: 'inventoryMutation',
    })
  }
}))

export type InventoryMutation = SchemaType<typeof InventoryMutationSchema>
export type InventoryMutationList = SchemaType<typeof InventoryMutationListSchema>
export type InventoryMutationFilter = SchemaType<typeof InventoryMutationFilterSchema>
export type InventoryMutationRequest = SchemaType<typeof InventoryMutationRequestSchema>
