import { messages } from '@/lib/constants/messages';
import { validationMessages } from '@/lib/constants/validationMessage';
import { ImageReferenceEnum } from '@/lib/enums/ImageReference.Enum';
import { ApiResponseDataSchema } from '@/lib/schemas/ApiResponse.schema';
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
  path: true,
}).openapi('Image')

export const ImageRequestSchema = z.object({
  image: z.any({
    required_error: validationMessages.required('Image')
  })
    .refine((file) => file.size < MAX_FILE_SIZE, 'Max size 10MB.')
    .refine((file) => checkFileType(file.type), 'Available for .png, .jpeg, or .jpg.')
    .openapi({
      type: 'string',
      format: 'binary',
      description: 'Available for .png, .jpeg, or .jpg. Max size 10MB',
    })
});

export const ImageFilterSchema = createSelectSchema(images).pick({
  reference: true,
  referenceId: true,
})

export const ImageUploadSchema = z.object({
  reference: z.nativeEnum(ImageReferenceEnum, {
    required_error: validationMessages.required('Image Reference'),
    invalid_type_error: validationMessages.enum('Image Reference', ImageReferenceEnum),
  }),
  referenceId: z.string({
    required_error: validationMessages.required('Image Reference ID'),
    invalid_type_error: validationMessages.string('Image Reference ID'),
  }).transform((value) => Number(value)),
}).merge(ImageRequestSchema)

export const ImageUploadResponse = ApiResponseDataSchema(ImageSchema.pick({ path: true }), messages.successUpdate('Image'))

export type ImageUpload = z.infer<typeof ImageUploadSchema>

export type ImageRequest = {
  images: Blob[] | Blob
}
export type ImageFilter = z.infer<typeof ImageFilterSchema>
export type Image = z.infer<typeof ImageSchema>