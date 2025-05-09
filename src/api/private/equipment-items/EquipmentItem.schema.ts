import { equipmentItems } from 'db/schema/equipment-items';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { CategorySchema } from '../categories/Category.schema';
import { UserExtendedSchema } from '../users/User.schema';
import { z } from 'zod';
import { NumericSchema } from '@/lib/schemas/Numeric.schema';
import { EquipmentItemStatusEnum } from '@/lib/enums/EquipmentItemStatusEnum';
import { validationMessages } from '@/lib/constants/validation-message';
import { SearchSchema } from '@/lib/schemas/Search.schema';
import { PaginationSchema } from '@/lib/schemas/Pagination.schema';
import { SortSchema } from '@/lib/schemas/Sort.schema';
import { ApiResponseListSchema } from '@/lib/schemas/ApiResponse.schema';
import { messages } from '@/lib/constants/messages';

type EquipmentItemColumn = keyof typeof equipmentItems.$inferSelect;

const EquipmentItemSchema = createSelectSchema(equipmentItems).pick({
  id: true,
  lastMaintenanceDate: true,
  number: true,
  ownerId: true,
  registerDate: true,
  status: true,
})

const EquipmentItemExtendedSchema = EquipmentItemSchema.omit({
  // categoryId: true,
  ownerId: true
}).extend({
  category: CategorySchema,
  owner: UserExtendedSchema,
}).openapi('EquipmentItemExtended')

const EquipmentItemFilterSchema = z.object({
  categoryId: NumericSchema('Category ID').optional(),
  ownerId: NumericSchema('Owner ID').optional(),
  status: z.nativeEnum(EquipmentItemStatusEnum, {
    invalid_type_error: validationMessages.enum('Status', EquipmentItemStatusEnum)
  }).optional()
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

const EquipmentItemRequestSchema = createInsertSchema(equipmentItems, {
  ownerId: NumericSchema('Owner ID'),
}).pick({
  ownerId: true,
})

const EquipmentItemResponseListSchema = ApiResponseListSchema(z.array(EquipmentItemExtendedSchema), messages.successList('equipment items'))
