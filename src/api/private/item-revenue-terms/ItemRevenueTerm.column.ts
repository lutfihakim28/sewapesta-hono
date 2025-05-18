import { itemRevenueTerms } from 'db/schema/item-revenue-terms';
import { getTableColumns } from 'drizzle-orm';

export const { createdAt, deletedAt, updatedAt, ...itemRevenueTermColumns } = getTableColumns(itemRevenueTerms)