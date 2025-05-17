import { equipments } from 'db/schema/equipments';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';
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
import { SchemaType } from '@/utils/types/Schema.type';
import { EnumSchema } from '@/utils/schemas/Enum.schema';

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

export type EquipmentListColumn = keyof Pick<SchemaType<typeof EquipmentListItemSchema>, 'id' |
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

export const EquipmentFilterSchema = SearchSchema
  .merge(SearchSchema)
  .merge(PaginationSchema)
  .merge(SortSchema(sortableEquipmentColumns))
  .extend({
    itemId: new StringSchema('Item ID').numeric({ min: 1, subset: 'natural' }).getSchema().optional(),
    ownerId: new StringSchema('Owner ID').numeric({ min: 1, subset: 'natural' }).getSchema().optional(),
    status: new EnumSchema('Status', EquipmentStatusEnum).getSchema().optional(),
    number: new StringSchema('Number').getSchema().optional(),
    categoryId: new StringSchema('Category ID').numeric({ min: 1, subset: 'natural' }).getSchema().optional(),
  })
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

export type Equipment = SchemaType<typeof EquipmentSchema>
export type EquipmentFilter = SchemaType<typeof EquipmentFilterSchema>
export type EquipmentRequest = SchemaType<typeof EquipmentRequestSchema>
export type EquipmentList = SchemaType<typeof EquipmentListSchema>
