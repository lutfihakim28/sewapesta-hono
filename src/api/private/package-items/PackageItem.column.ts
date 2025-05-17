import { packageItems } from 'db/schema/package-items';
import { getTableColumns } from 'drizzle-orm';

export const { createdAt, deletedAt, updatedAt, ...packageItemColumns } = getTableColumns(packageItems)