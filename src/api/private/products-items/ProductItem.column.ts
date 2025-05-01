import { productsItems } from 'db/schema/products-items';
import { getTableColumns } from 'drizzle-orm';

export const { itemId, productId, createdAt, deletedAt, updatedAt, ...productItemColumns } = getTableColumns(productsItems);