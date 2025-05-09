import { equipmentItems } from 'db/schema/equipment-items';
import { getTableColumns } from 'drizzle-orm';

export const { createdAt, deletedAt, updatedAt, ...equipmentItemColumns } = getTableColumns(equipmentItems)