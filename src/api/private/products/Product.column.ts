import { products } from 'db/schema/products';
import { getTableColumns } from 'drizzle-orm';

export const { createdAt, deletedAt, updatedAt, ...productColumns } = getTableColumns(products)