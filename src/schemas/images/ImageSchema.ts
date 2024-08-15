import { images } from 'db/schema/images';
import { createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';

export const ImageSchema = createSelectSchema(images).pick({
  id: true,
  url: true,
}).openapi('Image')

export type Image = z.infer<typeof ImageSchema>