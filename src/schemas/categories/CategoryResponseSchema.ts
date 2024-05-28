import { categoriesTable } from '@/db/schema/categories';
import { createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';

export const CategoryResponseSchema = createSelectSchema(categoriesTable).openapi('CategoryResponse')

export type CategoryResponse = z.infer<typeof CategoryResponseSchema>