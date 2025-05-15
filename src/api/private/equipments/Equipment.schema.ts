import { equipments } from 'db/schema/equipments';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';
import { NumericSchema } from '@/lib/schemas/Numeric.schema';
import { validationMessages } from '@/lib/constants/validation-message';
import { SearchSchema } from '@/lib/schemas/Search.schema';
import { PaginationSchema } from '@/lib/schemas/Pagination.schema';
import { SortSchema } from '@/lib/schemas/Sort.schema';
import { ApiResponseDataSchema, ApiResponseListSchema } from '@/lib/schemas/ApiResponse.schema';
import { messages } from '@/lib/constants/messages';
import { CategorySchema } from '../categories/Category.schema';
import { UnitSchema } from '../units/Unit.schema';
import { ItemSchema } from '../items/Item.schema';
import { UserExtendedSchema } from '../users/User.schema';
import { EquipmentStatusEnum } from '@/lib/enums/EquipmentStatusEnum';

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

export const EquipmentListSchema = z.array(createSelectSchema(equipments).pick({
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
})).openapi('EquipmentList')

export const EquipmentFilterSchema = z.object({
  itemId: NumericSchema('Item ID', 1).optional(),
  ownerId: NumericSchema('Owner ID', 1).optional(),
  status: z.nativeEnum(EquipmentStatusEnum, {
    invalid_type_error: validationMessages.enum('Status', EquipmentStatusEnum)
  }).optional(),
  number: z.string({
    invalid_type_error: validationMessages.string('Number'),
  }).optional(),
  categoryId: NumericSchema('Category ID', 1).optional(),
})
  .merge(SearchSchema)
  .merge(PaginationSchema)
  .merge(SortSchema<EquipmentColumn>([
    'id',
    'number',
    'registerDate',
    'lastMaintenanceDate',
    'status'
  ]))
  .openapi('EquipmentFilter')

export const EquipmentRequestSchema = createInsertSchema(equipments, {
  ownerId: z.number({
    invalid_type_error: validationMessages.number('Owner ID'),
    required_error: validationMessages.required('Owner ID')
  }).positive({
    message: validationMessages.positiveNumber('Owner ID')
  }),
  itemId: z.number({
    invalid_type_error: validationMessages.number('Item ID'),
    required_error: validationMessages.required('Item ID')
  }).positive({
    message: validationMessages.positiveNumber('Item ID')
  }),
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
