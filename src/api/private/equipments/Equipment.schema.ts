import { equipments } from 'db/schema/equipments';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';
import { validationMessages } from '@/utils/constants/validation-message';
import { SearchSchema } from '@/utils/schemas/Search.schema';
import { PaginationSchema } from '@/utils/schemas/Pagination.schema';
import { SortSchema } from '@/utils/schemas/Sort.schema';
import { ApiResponseDataSchema, ApiResponseListSchema } from '@/utils/schemas/ApiResponse.schema';
import { messages } from '@/utils/constants/messages';
import { CategorySchema } from '../categories/Category.schema';
import { UnitSchema } from '../units/Unit.schema';
import { ItemSchema } from '../items/Item.schema';
import { UserExtendedSchema } from '../users/User.schema';
import { EquipmentStatusEnum } from '@/utils/enums/EquipmentStatusEnum';
import { StringSchema } from '@/utils/schemas/String.schema';
import { NumberSchema } from '@/utils/schemas/Number.schema';

export type EquipmentColumn = keyof typeof equipments.$inferSelect;

export const EquipmentSchema = createSelectSchema(equipments).pick({
  id: true,
  lastMaintenanceDate: true,
  number: true,
  registerDate: true,
  status: true,
  itemId: true,
  ownerId: true,
}).openapi('Equipment')

const EquipmentListItemSchema = EquipmentSchema.extend({
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
})

export const EquipmentListSchema = z.array(EquipmentListItemSchema).openapi('EquipmentList')

export type EquipmentListColumn = keyof Pick<z.infer<typeof EquipmentListItemSchema>, 'id' |
  'number' |
  'registerDate' |
  'lastMaintenanceDate' |
  'item' |
  'owner'>;
export const sortableEquipmentColumns: EquipmentListColumn[] = [
  'id',
  'number',
  'registerDate',
  'lastMaintenanceDate',
  'item',
  'owner',
]

export const EquipmentFilterSchema = z.object({
  itemId: new StringSchema('Item ID').numeric({ min: 1, subset: 'natural' }).getSchema().optional(),
  ownerId: new StringSchema('Owner ID').numeric({ min: 1, subset: 'natural' }).getSchema().optional(),
  status: z.nativeEnum(EquipmentStatusEnum, {
    invalid_type_error: validationMessages.enum('Status', EquipmentStatusEnum)
  }).optional(),
  number: new StringSchema('Number').getSchema().optional(),
  categoryId: new StringSchema('Category ID').numeric({ min: 1, subset: 'natural' }).getSchema().optional(),
})
  .merge(SearchSchema)
  .merge(PaginationSchema)
  .merge(SortSchema(sortableEquipmentColumns))
  .openapi('EquipmentFilter')

export const EquipmentRequestSchema = createInsertSchema(equipments, {
  ownerId: new NumberSchema('Owner ID').natural().getSchema(),
  itemId: new NumberSchema('Item ID').natural().getSchema(),
}).pick({
  ownerId: true,
  itemId: true,
}).openapi('EquipmentRequest')

export const EquipmentResponseListSchema = ApiResponseListSchema(EquipmentListSchema, messages.successList('equipment items'))
export const EquipmentResponseDataSchema = ApiResponseDataSchema(EquipmentSchema, messages.successDetail('equipment item'))

export type Equipment = z.infer<typeof EquipmentSchema>
export type EquipmentFilter = z.infer<typeof EquipmentFilterSchema>
export type EquipmentRequest = z.infer<typeof EquipmentRequestSchema>
export type EquipmentList = z.infer<typeof EquipmentListSchema>
