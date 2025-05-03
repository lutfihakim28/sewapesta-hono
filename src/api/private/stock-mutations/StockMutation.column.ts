import { getTableColumns } from 'drizzle-orm';
import { stockMutations } from 'db/schema/stock-mutations';

export const { deletedAt, updatedAt, createdAt, ...stockMutationsColumns } = getTableColumns(stockMutations)