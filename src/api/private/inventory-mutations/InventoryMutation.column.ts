import { inventoryMutations } from 'db/schema/inventory-mutations';
import { getTableColumns } from 'drizzle-orm';

export const { createdAt, deletedAt, updatedAt, ...inventoryMutationColumns } = getTableColumns(inventoryMutations)