import { messages } from '@/utils/constants/locales/messages';
import { validationMessages } from '@/utils/constants/validation-message';
import { ImageReferenceEnum } from '@/utils/enums/ImageReference.Enum';
import { ApiResponseDataSchema } from '@/utils/schemas/ApiResponse.schema';
import { images } from 'db/schema/images';
import { createSelectSchema } from 'drizzle-zod';
import { NumberSchema } from '@/utils/schemas/Number.schema';
import { ObjectSchema } from '@/utils/schemas/Object.schema';
import { SchemaType } from '@/utils/types/Schema.type';
import { z } from 'zod';
import { EnumSchema } from '@/utils/schemas/Enum.schema';

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

export const ImageRequestSchema = new ObjectSchema({
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
}).getSchema();

const ImageFilterSchema = createSelectSchema(images).pick({
  reference: true,
  referenceId: true,
})

const ImageSaveSchema = new ObjectSchema({
  reference: new EnumSchema('Reference', ImageReferenceEnum).getSchema(),
  referenceId: new NumberSchema('Reference ID').natural().getSchema(),
}).getSchema().openapi('ImageSave')

const ImageUploadSchema = ImageSchema.pick({ path: true })
export const ImageUploadResponse = ApiResponseDataSchema(ImageUploadSchema, messages.successUpload('Image'))

export type ImageSave = SchemaType<typeof ImageSaveSchema>

export type ImageRequest = {
  image: File
}
export type ImageFilter = SchemaType<typeof ImageFilterSchema>
export type Image = SchemaType<typeof ImageSchema>
export type ImageUpload = SchemaType<typeof ImageUploadSchema>