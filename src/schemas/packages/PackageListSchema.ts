import { messages } from '@/constatnts/messages';
import { z } from 'zod';
import { PackageSchema } from './PackageSchema';

export const PackageListSchema = z.object({
  code: z.number().openapi({
    example: 200,
  }),
  messages: z.string().openapi({
    example: messages.successList('pemilik'),
  }),
  data: z.array(PackageSchema),
  meta: z.object({
    page: z.number().positive().openapi({ example: 1 }),
    pageSize: z.number().positive().openapi({ example: 10 }),
    pageCount: z.number().positive().openapi({ example: 15 }),
  }),
})