import { ownerRevenueTerms } from 'db/schema/owner-revenue-terms';
import { getTableColumns } from 'drizzle-orm';

export const { createdAt, deletedAt, updatedAt, ...ownerRevenueTermColumns } = getTableColumns(ownerRevenueTerms)