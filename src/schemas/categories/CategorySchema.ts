import { categoriesTable } from 'db/schema/categories';
import { createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';
import { Subcategory, SubcategorySchema } from '../subcategories/SubcategorySchema';

const _CategorySchema = createSelectSchema(categoriesTable).pick({
  id: true,
  name: true,
})

export type Category = z.infer<typeof _CategorySchema> & {
  subcategories: Array<Subcategory>
}

export const CategorySchema: z.ZodType<Category> = _CategorySchema.extend({
  subcategories: z.array(SubcategorySchema)
}).openapi('Category')