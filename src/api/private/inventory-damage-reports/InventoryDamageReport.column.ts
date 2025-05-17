import { inventoryDamageReports } from 'db/schema/inventory-damage-reports';
import { getTableColumns } from 'drizzle-orm';

export const { createdAt, deletedAt, updatedAt, ...inventoryDamageReportColumns } = getTableColumns(inventoryDamageReports);