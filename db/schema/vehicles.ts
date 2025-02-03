import { VehicleTypeEnum } from '@/enums/VehicleTypeEnum';
import { timestamps } from 'db/schema/timestamps.helper';
import { index, integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const vehicles = sqliteTable('vehicles', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull(),
  licenseNumber: text('license_number').notNull(),
  type: text('type', {
    enum: [
      VehicleTypeEnum.Pickup,
      VehicleTypeEnum.Truck,
    ]
  }).notNull(),
  ...timestamps,
}, (table) => ({
  vehicleTypeIndex: index('vehicle_type_index').on(table.type)
}))