import { getTableColumns } from 'drizzle-orm';
import { stockMutations } from 'db/schema/inventory-item-mutations';

export const { deletedAt, updatedAt, createdAt, ...stockMutationsColumns } = getTableColumns(stockMutations)