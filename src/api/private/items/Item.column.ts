import { items } from 'db/schema/items';
import { getTableColumns } from 'drizzle-orm';

export const { createdAt, deletedAt, updatedAt, ...itemColumns } = getTableColumns(items)
