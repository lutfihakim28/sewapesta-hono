import { packages } from 'db/schema/packages';
import { getTableColumns } from 'drizzle-orm';

export const { createdAt, deletedAt, updatedAt, ...packageColumns } = getTableColumns(packages)