import { z } from 'zod';
import { ImageRequestSchema } from './ImageRequestSchema';

export const ImageUploadSchema = z.object({
  reference: z.string(),
  referenceId: z.number(),
}).merge(ImageRequestSchema)

export type ImageUpload = z.infer<typeof ImageUploadSchema>