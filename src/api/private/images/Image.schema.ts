import { ImageReferenceEnum } from '@/lib/enums/ImageReference.Enum';
import { images } from 'db/schema/images';
import { createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';

const MAX_FILE_SIZE = 10000000;
const accept = ['image/jpeg', 'image/png', 'image/jpg', 'image/svg+xml'];

function checkFileType(type: string) {
  if (accept.includes(type)) return true;
  return false;
}

export const ImageSchema = createSelectSchema(images).pick({
  id: true,
  url: true,
  reference: true,
  referenceId: true,
}).openapi('Image')

export const ImageRequestSchema = z.object({
  images: z.any()
    .refine((file) => file.size < MAX_FILE_SIZE, "Ukuran maksimal 10MB.")
    .refine((file) => checkFileType(file.type), "Hanya mendukung format .png, .jpeg, atau .jpg.")
    .openapi({
      type: 'array',
      items: { type: 'string', format: 'binary' },
      description: 'Hanya mendukung format .png, .jpeg, atau .jpg. Berukuran maksimal 10MB',
    }).optional()
});

export const ImageFilterSchema = createSelectSchema(images).pick({
  reference: true,
  referenceId: true,
})

export const ImageUploadSchema = z.object({
  reference: z.nativeEnum(ImageReferenceEnum),
  referenceId: z.number(),
}).merge(ImageRequestSchema)

export type ImageUpload = z.infer<typeof ImageUploadSchema>

export type ImageRequest = {
  images: Blob[] | Blob
}
export type ImageFilter = z.infer<typeof ImageFilterSchema>
export type Image = z.infer<typeof ImageSchema>