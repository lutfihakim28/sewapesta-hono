import { equipments } from 'db/schema/equipments';
import { getTableColumns } from 'drizzle-orm';

export const { createdAt, deletedAt, updatedAt, ...equipmentColumns } = getTableColumns(equipments)