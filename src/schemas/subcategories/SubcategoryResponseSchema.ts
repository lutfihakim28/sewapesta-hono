import { subcategoriesTable } from '@/db/schema/subcategories';
import { createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';

export const SubcategoryResponseSchema = createSelectSchema(subcategoriesTable).openapi('SubcategoryResponse')

export type SubcategoryResponse = z.infer<typeof SubcategoryResponseSchema>