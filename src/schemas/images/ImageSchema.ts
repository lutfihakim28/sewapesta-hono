import { imagesTable } from 'db/schema/images';
import { createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';

export const ImageSchema = createSelectSchema(imagesTable).pick({
  id: true,
  url: true,
}).openapi('Image')

export type Image = z.infer<typeof ImageSchema>