import { index, integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { timestamps } from './timestamps.helper';
import { users } from './users';
import { EquipmentItemStatusEnum } from '@/lib/enums/EquipmentItemStatusEnum';
import dayjs from 'dayjs';

export const equipmentItems = sqliteTable('equipment_items', {
  id: integer('id').primaryKey(),
  number: text('number').unique().notNull(),
  name: text('name').notNull(),
  ownerId: integer('owner_id').references(() => users.id).notNull(),
  status: text('type', {
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
  index('number_index').on(table.number),
  index('status_index').on(table.status),
  index('owner_index').on(table.ownerId),
  index('register_date_index').on(table.registerDate),
  index('last_maintenance_date_index').on(table.lastMaintenanceDate),
])