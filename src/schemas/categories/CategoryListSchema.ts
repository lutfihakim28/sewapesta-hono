import { messages } from '@/lib/constants/messages';
import { z } from 'zod';
import { CategorySchema } from './CategorySchema';

export const CategoryListSchema = z.object({
  code: z.number().openapi({
    example: 200,
  }),
  messages: z.string().openapi({
    example: messages.successList('kategori'),
  }),
  data: z.array(CategorySchema),
})