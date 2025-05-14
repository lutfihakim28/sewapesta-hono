import { inventoryItemMutations } from 'db/schema/inventory-item-mutations';
import { getTableColumns } from 'drizzle-orm';

export const { createdAt, deletedAt, updatedAt, ...inventoryItemMutationColumns } = getTableColumns(inventoryItemMutations)