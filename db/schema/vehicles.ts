import { VehicleTypeEnum } from '@/enums/VehicleTypeEnum';
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const vehiclesTable = sqliteTable('vehicles', {
  id: integer('id', { mode: 'number' }).primaryKey({ autoIncrement: true }),
  name: text('name').notNull(),
  licenseNumber: text('license_number').notNull(),
  type: text('type', {
    enum: [
      VehicleTypeEnum.Pickup,
      VehicleTypeEnum.Truck,
    ]
  }).notNull(),
  createdAt: integer('created_at', { mode: 'number' }).notNull(),
  updatedAt: integer('updated_at', { mode: 'number' }),
  deletedAt: integer('deleted_at', { mode: 'number' }),
})