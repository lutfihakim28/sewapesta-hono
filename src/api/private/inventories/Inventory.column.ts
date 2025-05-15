import { inventories } from 'db/schema/inventories';
import { getTableColumns } from 'drizzle-orm';

export const { createdAt, deletedAt, updatedAt, ...inventoryColumns } = getTableColumns(inventories)