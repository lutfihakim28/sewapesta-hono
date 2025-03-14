import { images } from 'db/schema/images';
import { getTableColumns } from 'drizzle-orm';

export const { createdAt, ...imageColumns } = getTableColumns(images)