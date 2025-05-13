import { inventoryItems } from 'db/schema/inventory-items';
import { getTableColumns } from 'drizzle-orm';

export const { createdAt, deletedAt, updatedAt, ...inventoryItemColumns } = getTableColumns(inventoryItems)