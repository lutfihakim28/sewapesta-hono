import { inventoryUsages } from 'db/schema/inventory-usages';
import { getTableColumns } from 'drizzle-orm';

export const { createdAt, deletedAt, updatedAt, ...inventoryUsageColumns } = getTableColumns(inventoryUsages)