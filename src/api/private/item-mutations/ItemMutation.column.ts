import { getTableColumns } from 'drizzle-orm';
import { itemMutations } from 'db/schema/item-mutations';

export const { deletedAt, updatedAt, ...itemMutationsColumns } = getTableColumns(itemMutations)