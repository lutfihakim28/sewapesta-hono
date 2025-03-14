import { branches } from 'db/schema/branches';
import { getTableColumns } from 'drizzle-orm';

export const { createdAt, updatedAt, deletedAt, ...branchColumns } = getTableColumns(branches);