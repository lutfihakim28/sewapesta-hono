import { productsItems } from 'db/schema/products-items';
import { getTableColumns } from 'drizzle-orm';

export const { itemId, productId, ...productItemColumns } = getTableColumns(productsItems);