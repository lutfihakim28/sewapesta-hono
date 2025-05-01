import { itemsOwners } from 'db/schema/items-owners';
import { getTableColumns } from 'drizzle-orm';

export const { createdAt, deletedAt, updatedAt, ...itemOwnerColumns } = getTableColumns(itemsOwners)