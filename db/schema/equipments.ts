import { index, integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { timestamps } from './timestamps.helper';
import { users } from './users';
import { items } from './items';
import { EquipmentStatusEnum } from '@/utils/enums/EquipmentStatusEnum';
import { AppDate } from '@/utils/libs/AppDate';
// import { categories } from './categories';

export const equipments = sqliteTable('equipments', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  number: text('number').unique().notNull(),
  itemId: integer('item_id').references(() => items.id).notNull(),
  ownerId: integer('owner_id').references(() => users.id).notNull(),
  status: text('status', {
    enum: [
      EquipmentStatusEnum.Available,
      EquipmentStatusEnum.Damaged,
      EquipmentStatusEnum.Maintenance,
      EquipmentStatusEnum.Rented,
      EquipmentStatusEnum.Repaired,
      EquipmentStatusEnum.Reserved,
      EquipmentStatusEnum.Returned,
    ],
  }).notNull().default(EquipmentStatusEnum.Available),
  registerDate: integer('register_date').notNull().$defaultFn(() => new AppDate().unix),
  lastMaintenanceDate: integer('last_maintenance_date').notNull().$defaultFn(() => new AppDate().unix),
  ...timestamps,
}, (table) => [
  index('equipment_item_status_index').on(table.status),
  index('equipment_item_item_index').on(table.itemId),
  index('equipment_item_owner_index').on(table.ownerId),
  index('equipment_item_register_date_index').on(table.registerDate),
  index('equipment_item_last_maintenance_date_index').on(table.lastMaintenanceDate),
])