import { equipmentItems } from 'db/schema/equipment-items';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';
import { NumericSchema } from '@/lib/schemas/Numeric.schema';
import { EquipmentItemStatusEnum } from '@/lib/enums/EquipmentItemStatusEnum';
import { validationMessages } from '@/lib/constants/validation-message';
import { SearchSchema } from '@/lib/schemas/Search.schema';
import { PaginationSchema } from '@/lib/schemas/Pagination.schema';
import { SortSchema } from '@/lib/schemas/Sort.schema';
import { ApiResponseDataSchema, ApiResponseListSchema } from '@/lib/schemas/ApiResponse.schema';
import { messages } from '@/lib/constants/messages';
import { ItemTypeEnum } from '@/lib/enums/ItemTypeEnum';
import { CategorySchema } from '../categories/Category.schema';
import { UnitSchema } from '../units/Unit.schema';
import { ItemSchema } from '../items/Item.schema';
import { UserExtendedSchema, UserSchema } from '../users/User.schema';

export type EquipmentItemColumn = keyof typeof equipmentItems.$inferSelect;

export const EquipmentItemSchema = createSelectSchema(equipmentItems).pick({
  id: true,
  lastMaintenanceDate: true,
  number: true,
  registerDate: true,
  status: true,
  itemId: true,
  ownerId: true,
}).openapi('EquipmentItem')

export const EquipmentItemListSchema = z.array(createSelectSchema(equipmentItems).pick({
  id: true,
  lastMaintenanceDate: true,
  number: true,
  registerDate: true,
  status: true,
}).extend({
  item: ItemSchema.pick({
    id: true,
    name: true,
    type: true
  }),
  category: CategorySchema,
  unit: UnitSchema,
  owner: UserExtendedSchema.pick({
    id: true,
    phone: true,
    name: true,
  })
})).openapi('EquipmentItemList')

export const EquipmentItemFilterSchema = z.object({
  itemId: NumericSchema('Item ID').optional(),
  ownerId: NumericSchema('Owner ID').optional(),
  status: z.nativeEnum(EquipmentItemStatusEnum, {
    invalid_type_error: validationMessages.enum('Status', EquipmentItemStatusEnum)
  }).optional(),
  number: z.string({
    invalid_type_error: validationMessages.string('Number'),
  }).optional(),
  categoryId: NumericSchema('Category ID').optional(),
})
  .merge(SearchSchema)
  .merge(PaginationSchema)
  .merge(SortSchema<EquipmentItemColumn>([
    'id',
    'number',
    'registerDate',
    'lastMaintenanceDate',
    'status'
  ]))
  .openapi('EquipmentItemFilter')

export const EquipmentItemRequestSchema = createInsertSchema(equipmentItems, {
  ownerId: z.number({
    invalid_type_error: validationMessages.number('Owner ID'),
    required_error: validationMessages.required('Owner ID')
  }),
  itemId: z.number({
    invalid_type_error: validationMessages.number('Item ID'),
    required_error: validationMessages.required('Item ID')
  }),
}).pick({
  ownerId: true,
  itemId: true,
}).openapi('EquipmentItemRequest')

export const EquipmentItemResponseListSchema = ApiResponseListSchema(EquipmentItemListSchema, messages.successList('equipment items'))
export const EquipmentItemResponseDataSchema = ApiResponseDataSchema(EquipmentItemSchema, messages.successDetail('equipment item'))

export type EquipmentItem = z.infer<typeof EquipmentItemSchema>
export type EquipmentItemFilter = z.infer<typeof EquipmentItemFilterSchema>
export type EquipmentItemRequest = z.infer<typeof EquipmentItemRequestSchema>
export type EquipmentItemList = z.infer<typeof EquipmentItemListSchema>
