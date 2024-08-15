import { images } from 'db/schema/images';
import { createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';

export const ImageFilterSchema = createSelectSchema(images).pick({
  reference: true,
  referenceId: true,
})

export type ImageFilter = z.infer<typeof ImageFilterSchema>