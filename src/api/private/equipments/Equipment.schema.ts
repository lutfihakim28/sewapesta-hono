import { equipments } from 'db/schema/equipments';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { SearchSchema } from '@/utils/schemas/Search.schema';
import { PaginationSchema } from '@/utils/schemas/Pagination.schema';
import { SortSchema } from '@/utils/schemas/Sort.schema';
import { ApiResponseDataSchema, ApiResponseListSchema } from '@/utils/schemas/ApiResponse.schema';
import { CategorySchema } from '../categories/Category.schema';
import { UnitSchema } from '../units/Unit.schema';
import { ItemSchema } from '../items/Item.schema';
import { UserExtendedSchema } from '../users/User.schema';
import { EquipmentStatusEnum } from '@/utils/enums/EquipmentStatusEnum';
import { StringSchema } from '@/utils/schemas/String.schema';
import { NumberSchema } from '@/utils/schemas/Number.schema';
import { SchemaType } from '@/utils/types/Schema.type';
import { EnumSchema } from '@/utils/schemas/Enum.schema';
import { ArraySchema } from '@/utils/schemas/Array.schema';
import { tMessage, tData } from '@/utils/constants/locales/locale';

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
  category: CategorySchema.pick({
    id: true,
    name: true,
  }),
  unit: UnitSchema,
  owner: UserExtendedSchema.pick({
    id: true,
    phone: true,
    name: true,
  })
})

export const EquipmentListSchema = new ArraySchema('Equipment list', EquipmentListItemSchema).getSchema().openapi('EquipmentList')

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
    itemId: new StringSchema('Item ID').neutralNumeric().getSchema().optional(),
    ownerId: new StringSchema('Owner ID').neutralNumeric().getSchema().optional(),
    status: new EnumSchema('Status', EquipmentStatusEnum).getSchema().optional(),
    number: new StringSchema('Number').getSchema().optional(),
    categoryId: new StringSchema('Category ID').neutralNumeric().getSchema().optional(),
  })
  .openapi('EquipmentFilter')

export const EquipmentRequestSchema = createInsertSchema(equipments, {
  ownerId: new NumberSchema('Owner ID').natural().getSchema(),
  itemId: new NumberSchema('Item ID').natural().getSchema(),
}).pick({
  ownerId: true,
  itemId: true,
}).openapi('EquipmentRequest')

export const EquipmentResponseListSchema = ApiResponseListSchema(EquipmentListSchema, tMessage({
  lang: 'en',
  key: 'successList',
  textCase: 'sentence',
  params: {
    data: tData({
      lang: 'en',
      key: 'equipment',
      mode: 'plural'
    })
  }
}))
export const EquipmentResponseDataSchema = ApiResponseDataSchema(EquipmentSchema, tMessage({
  lang: 'en',
  key: 'successDetail',
  textCase: 'sentence',
  params: {
    data: tData({
      lang: 'en',
      key: 'equipment'
    })
  }
}))

export type Equipment = SchemaType<typeof EquipmentSchema>
export type EquipmentFilter = SchemaType<typeof EquipmentFilterSchema>
export type EquipmentRequest = SchemaType<typeof EquipmentRequestSchema>
export type EquipmentList = SchemaType<typeof EquipmentListSchema>
