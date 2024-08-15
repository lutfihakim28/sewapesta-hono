import { categories } from 'db/schema/categories';
import { createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';

const _CategorySchema = createSelectSchema(categories).pick({
  id: true,
  name: true,
})

export type Category = z.infer<typeof _CategorySchema> & {
  itemsCount?: number
}

export const CategorySchema: z.ZodType<Category> = _CategorySchema.extend({
  itemsCount: z.number().optional()
}).openapi('Category')