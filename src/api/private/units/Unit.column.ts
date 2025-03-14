import { units } from 'db/schema/units';
import { getTableColumns } from 'drizzle-orm';

export const { createdAt, deletedAt, updatedAt, ...unitColumns } = getTableColumns(units)
