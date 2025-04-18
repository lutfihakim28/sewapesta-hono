import { messages } from '@/lib/constants/messages';
import { validationMessages } from '@/lib/constants/validation-message';
import { ImageReferenceEnum } from '@/lib/enums/ImageReference.Enum';
import { ApiResponseDataSchema } from '@/lib/schemas/ApiResponse.schema';
import { images } from 'db/schema/images';
import { createSelectSchema } from 'drizzle-zod';
import { z } from '@hono/zod-openapi';

const MAX_FILE_SIZE = 10000000;
const accept = ['image/jpeg', 'image/png', 'image/jpg', 'image/svg+xml'];

function checkFileType(type: string) {
  return accept.includes(type);
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
    .refine((file) => checkFileType(file.type), 'Your file\'s type is not supported.')
    .openapi({
      type: 'string',
      format: 'binary',
      description: 'Available for .png, .jpeg, or .jpg. Max size 10MB',
    })
});

const ImageFilterSchema = createSelectSchema(images).pick({
  reference: true,
  referenceId: true,
})

const ImageSaveSchema = z.object({
  reference: z.nativeEnum(ImageReferenceEnum, {
    required_error: validationMessages.required('Image Reference'),
    invalid_type_error: validationMessages.enum('Image Reference', ImageReferenceEnum),
  }),
  referenceId: z.string({
    required_error: validationMessages.required('Image Reference ID'),
    invalid_type_error: validationMessages.string('Image Reference ID'),
  }).transform((value) => Number(value)),
}).openapi('ImageSave')

const ImageUploadSchema = ImageSchema.pick({ path: true })
export const ImageUploadResponse = ApiResponseDataSchema(ImageUploadSchema, messages.successUpload('Image'))

export type ImageSave = z.infer<typeof ImageSaveSchema>

export type ImageRequest = {
  image: Blob
}
export type ImageFilter = z.infer<typeof ImageFilterSchema>
export type Image = z.infer<typeof ImageSchema>
export type ImageUpload = z.infer<typeof ImageUploadSchema>