import { index, integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { timestamps } from './timestamps.helper';
import { users } from './users';
import { EquipmentItemStatusEnum } from '@/lib/enums/EquipmentItemStatusEnum';
import dayjs from 'dayjs';
import { items } from './items';
// import { categories } from './categories';

export const equipmentItems = sqliteTable('equipment_items', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  number: text('number').unique().notNull(),
  itemId: integer('item_id').references(() => items.id).notNull(),
  ownerId: integer('owner_id').references(() => users.id).notNull(),
  status: text('status', {
    enum: [
      EquipmentItemStatusEnum.Available,
      EquipmentItemStatusEnum.Damaged,
      EquipmentItemStatusEnum.Maintenance,
      EquipmentItemStatusEnum.Rented,
      EquipmentItemStatusEnum.Repaired,
      EquipmentItemStatusEnum.Reserved,
      EquipmentItemStatusEnum.Returned,
    ],
  }).notNull().default(EquipmentItemStatusEnum.Available),
  registerDate: integer('register_date').notNull().$defaultFn(() => dayjs().unix()),
  lastMaintenanceDate: integer('last_maintenance_date').notNull().$defaultFn(() => dayjs().unix()),
  ...timestamps,
}, (table) => [
  index('equipment_item_number_index').on(table.number),
  index('equipment_item_status_index').on(table.status),
  index('equipment_item_item_index').on(table.itemId),
  index('equipment_item_owner_index').on(table.ownerId),
  index('equipment_item_register_date_index').on(table.registerDate),
  index('equipment_item_last_maintenance_date_index').on(table.lastMaintenanceDate),
])