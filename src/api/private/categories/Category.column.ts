import { categories } from 'db/schema/categories';
import { getTableColumns } from 'drizzle-orm';

export const { createdAt, deletedAt, updatedAt, ...categoryColumns } = getTableColumns(categories)