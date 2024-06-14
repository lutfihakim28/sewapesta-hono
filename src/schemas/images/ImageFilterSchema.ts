import { imagesTable } from 'db/schema/images';
import { createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';

export const ImageFilterSchema = createSelectSchema(imagesTable).pick({
  reference: true,
  referenceId: true,
})

export type ImageFilter = z.infer<typeof ImageFilterSchema>