import { z } from 'zod';

const MAX_FILE_SIZE = 10000000;
const accept = ['image/jpeg', 'image/png', 'image/jpg', 'image/svg+xml'];

function checkFileType(type: string) {
  if (accept.includes(type)) return true;
  return false;
}

export const ImageRequestSchema = z.object({
  images: z.any()
    .refine((file) => file.size < MAX_FILE_SIZE, "Ukuran maksimal 10MB.")
    .refine((file) => checkFileType(file.type), "Hanya mendukung format .png, .jpeg, atau .jpg.")
    .openapi({
      type: 'array',
      items: { type: 'string', format: 'binary' },
      description: 'Hanya mendukung format .png, .jpeg, atau .jpg. Berukuran maksimal 10MB',
    })
  // images: z.array(z.instanceof(Blob)
  //   .refine((file) => file.size < MAX_FILE_SIZE, "Ukuran maksimal 10MB.")
  //   .refine((file) => checkFileType(file.type), "Hanya mendukung format .png, .jpeg, atau .jpg.")
  // ).openapi({
  //   type: 'array',
  //   items: { type: 'string', format: 'binary' },
  //   description: 'Hanya mendukung format .png, .jpeg, atau .jpg. Berukuran maksimal 10MB',
  // })
});

export type ImageRequest = {
  images: Blob[]
}