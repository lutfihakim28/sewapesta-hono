import { categoriesTable } from 'db/schema/categories';
import { createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';

const _CategorySchema = createSelectSchema(categoriesTable).pick({
  id: true,
  name: true,
})

export type Category = z.infer<typeof _CategorySchema>

export const CategorySchema: z.ZodType<Category> = _CategorySchema.openapi('Category')